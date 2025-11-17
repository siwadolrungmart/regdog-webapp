// components/MyMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import 'L' จาก leaflet

// (NEW) แก้ปัญหาไอคอน Marker ไม่แสดง (บั๊กยอดนิยมของ Webpack/Next.js)
// เราต้อง import รูปไอคอนมาตรงๆ แล้วตั้งค่า
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: iconMarker.src,
  iconRetinaUrl: iconRetina.src,
  shadowUrl: iconShadow.src,
});

// กำหนด Type ของ props ที่จะรับเข้ามา
// เราจะรับ 'places' ที่มี lat/lng เข้ามา
type Place = {
  id: number;
  title: string;
  lat: number;
  lng: number;
};

type MyMapProps = {
  places: Place[];
};

export default function MyMap({ places }: MyMapProps) {
  return (
    <MapContainer
      center={[13.7563, 100.5018]} // [lat, lng] จุดศูนย์กลางแผนที่ (เช่น กทม.)
      zoom={13} // ระดับการซูม
      scrollWheelZoom={false} // ปิดการซูมด้วย scroll-wheel (ถ้าต้องการ)
      className="w-full h-72 rounded-xl" // ใช้ class เดิมของ placeholder
    >
      {/* 1. ชั้นของแผนที่ (Tile Layer) - เราใช้ OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 2. วน Loop สร้าง Marker (หมุด) จาก 'places' ที่รับมา */}
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>{place.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
