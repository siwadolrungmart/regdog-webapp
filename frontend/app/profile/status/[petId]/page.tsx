"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { getDogById, getDogEvents } from "@/lib/api";

export default function StatusPage() {
  const params = useParams();
  const petId = Number(params.petId);

  const [dog, setDog] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลสุนัข + event
  useEffect(() => {
    const fetchData = async () => {
      try {
        //----------------------
        // 1) โหลดข้อมูลสุนัข
        //----------------------
        const resDog = await getDogById(petId);
        if (resDog.data) {
          setDog(resDog.data);
        }

        //----------------------
        // 2) โหลด event 30 วันล่าสุด
        //----------------------
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const resEvents = await getDogEvents({
          dogId: petId,
          since: since.toISOString(),
          until: new Date().toISOString(),
          page: 1,
          pageSize: 200,
        });

        if (resEvents.data?.items) {
          const sorted = resEvents.data.items.sort(
            (a: any, b: any) =>
              new Date(b.eventAt).getTime() - new Date(a.eventAt).getTime()
          );
          setEvents(sorted.slice(0, 3)); // เอาเฉพาะ 3 อันล่าสุด
        }
      } catch (e) {
        console.error("Load status page error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  if (loading)
    return (
      <div className="mobile flex items-center justify-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );

  if (!dog)
    return (
      <div className="mobile flex items-center justify-center text-red-400">
        ไม่พบข้อมูลสัตว์เลี้ยง
      </div>
    );

  // ----------------------------
  // Status mapping
  // ----------------------------
  const status = dog.lostStatus; // from API (NORMAL / LOST / FOUND / UNKNOWN)

  const statusText =
    status === "LOST"
      ? "สัตว์เลี้ยงหาย"
      : status === "FOUND"
      ? "พบแล้ว / รอรับกลับ"
      : status === "UNKNOWN"
      ? "ไม่ระบุ"
      : "ปกติ";

  const statusColor =
    status === "LOST"
      ? "bg-red-100 text-red-700"
      : status === "FOUND"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="mobile p-4 pb-10">
      {/* Header */}
      <div className="w-full flex flex-col items-center mt-4">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
          {dog.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dog.avatarUrl}
              alt={dog.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>

        <div className="text-3xl font-bold text-gray-800 mt-3">{dog.name}</div>

        <div
          className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {statusText}
        </div>

        {dog.extraDescription && (
          <div className="mt-2 text-sm text-gray-600 text-center max-w-xs">
            {dog.extraDescription}
          </div>
        )}
      </div>

      {/* ข้อมูลเจ้าของ */}
      <div className="bg-white p-4 rounded-2xl shadow-lg mt-6 space-y-2">
        <div className="text-lg font-semibold text-gray-800">เจ้าของสัตว์</div>

        <div className="text-sm text-gray-700">
          ชื่อ: {dog.ownerName || "ไม่ระบุ"}
        </div>

        <div className="text-sm text-gray-700">
          เบอร์โทร: {dog.ownerPhone || "-"}
        </div>

        <div className="text-sm text-gray-700">
          ที่อยู่: {dog.ownerAddress || "-"}
        </div>

        {dog.ownerPhone && (
          <a
            href={`tel:${dog.ownerPhone}`}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center py-2 rounded-xl font-medium"
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            โทรหาเจ้าของทันที
          </a>
        )}
      </div>

      {/* Event ล่าสุด */}
      <div className="bg-white p-4 rounded-2xl shadow-lg mt-6">
        <div className="text-lg font-semibold text-gray-800 mb-2">
          กิจกรรมล่าสุด
        </div>

        {events.length === 0 && (
          <div className="text-gray-400 text-sm">ไม่มีข้อมูลในช่วง 30 วัน</div>
        )}

        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-3 bg-blue-50 border border-blue-100 rounded-lg"
            >
              <div className="text-sm font-medium text-gray-800">
                {ev.eventType?.nameTh ??
                  ev.eventType?.code ??
                  "กิจกรรม"}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(ev.eventAt).toLocaleString("th-TH")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}