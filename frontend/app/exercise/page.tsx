"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Bar from "@/components/bar";
import Navigation from "@/components/navigation";
// map ไม่มี SSR
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type LatLng = [number, number];

// ใช้คำนวณระยะทางระหว่าง 2 จุด (km)
function haversine(a: LatLng, b: LatLng) {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const R = 6371; // km
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const s1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
  return R * c;
}

export default function ExercisePage() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);

  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  const [gpsStatus, setGpsStatus] = useState<
    "idle" | "searching" | "tracking" | "error"
  >("idle");

  const watchIdRef = useRef<number | null>(null);

  // ขอพิกัดครั้งแรกตอนเข้าเพจ
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      return;
    }

    setGpsStatus("searching");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const p: LatLng = [latitude, longitude];
        setPosition(p);
        setRoute([p]);
        setGpsStatus("idle");
      },
      (err) => {
        console.log("getCurrentPosition error:", err);
        setGpsStatus("error");
      },
      { enableHighAccuracy: true },
    );
  }, []);

  // จับเวลาเมื่อ isTracking = true
  useEffect(() => {
    if (!isTracking) return;

    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [isTracking]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }

    if (isTracking) return;

    setIsTracking(true);
    setGpsStatus("tracking");

    // reset route / distance / timer ถ้าอยากเริ่มใหม่ทุกครั้ง
    setElapsedSec(0);
    setDistanceKm(0);
    setRoute((prev) => (prev.length ? [prev[prev.length - 1]] : prev));

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPoint: LatLng = [latitude, longitude];

        setPosition(newPoint);
        setRoute((prev) => {
          if (prev.length === 0) return [newPoint];

          const last = prev[prev.length - 1];
          const dist = haversine(last, newPoint);
          // ไม่เอา “กระตุก” ผิดปกติ เช่น กระโดด 1km ใน 1 วินาที
          if (dist < 0.01) {
            // < 10m
            setDistanceKm((d) => d + dist);
            return [...prev, newPoint];
          }
          return prev;
        });
      },
      (err) => {
        console.log("watchPosition error:", err);
        setGpsStatus("error");
        setIsTracking(false);
      },
      { enableHighAccuracy: true },
    );

    watchIdRef.current = id;
  };

  const stopTracking = () => {
    setIsTracking(false);
    setGpsStatus("idle");
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const toggleTracking = () => {
    if (isTracking) stopTracking();
    else startTracking();
  };

  // format เวลา mm:ss
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // text สถานะ GPS
  const gpsText =
    gpsStatus === "searching"
      ? "กำลังค้นหาตำแหน่ง…"
      : gpsStatus === "tracking"
        ? "กำลังติดตามการเดิน"
        : gpsStatus === "error"
          ? "ใช้ GPS ไม่ได้ (เช็คการอนุญาตหรือลองเปิด Location)"
          : "พร้อมเริ่มติดตาม";

  return (
    <div className="mobile relative flex flex-col">
      {/* top bar */}
      <header className="relative flex justify-between items-center px-4 z-20 w-full">
        <Bar />
      </header>

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapView center={position} route={route} />
      </div>

      {/* bottom card */}
      <div className="mt-auto z-10 p-4 pb-10">
        {/* แสดงสถานะ GPS เล็ก ๆ ด้านบน */}
        <div className="mb-2 text-xs text-black bg-white/70 backdrop-blur px-3 py-1 rounded-full inline-block">
          {gpsText}
        </div>

        <div className="w-full bg-white/95 backdrop-blur rounded-[32px] shadow-lg px-6 py-4 flex items-center justify-between">
          {/* time */}
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold text-gray-900">
              {formatTime(elapsedSec)} นาที
            </span>
            <span className="text-xs text-gray-500">ระยะเวลา</span>
          </div>

          {/* start/stop button */}
          <button
            onClick={toggleTracking}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-semibold shadow-md ${
              isTracking
                ? "bg-red-400 text-white"
                : "bg-[#FFE07A] text-gray-900"
            }`}
          >
            {isTracking ? "หยุด" : "เริ่ม"}
          </button>

          {/* distance */}
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-900">
              {distanceKm.toFixed(2)} กม.
            </span>
            <span className="text-xs text-gray-500">ระยะทาง</span>
          </div>
        </div>
      </div>
    </div>
  );
}
