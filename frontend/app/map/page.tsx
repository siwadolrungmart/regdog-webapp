"use client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import React, { useState } from "react"; // 1. Import useState
import {
  Menu,
  Bell,
  User,
  Bath,
  Coffee,
  HeartPulse,
  MapPin,
  Phone,
  Clock,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  List, // 2. Import ไอคอน "List" สำหรับปุ่ม "ทั้งหมด"
} from "lucide-react";
// --- (FIX) ---
// The alias "@/" seems to be misconfigured in the build environment.
// Reverting to a relative path to import the Navigation component.
import Navigation from "../../components/navigation";
import Bar from "@/components/bar";
// --- (END FIX) ---

// --- (Helper Types) ---

// 3. (NEW) กำหนดประเภทของหมวดหมู่
type PlaceCategory = "GROOMING" | "CAFE" | "HOSPITAL";

type OpeningHours = {
  [day: string]: string;
};

type Place = {
  id: number;
  category: PlaceCategory; // 4. (NEW) เพิ่ม field category
  imageUrl: string;
  title: string;
  distance: string;
  location: string;
  lat: number;
  lng: number;
  phone: string;
  openingHoursSummary: string;
  detailedHours: OpeningHours;
  website: string;
  rating: number;
  reviewCount: number;
  description: string;
};

// --- (Helper Components) ---
const MyMap = dynamic(() => import("@/components/Mymap"), {
  ssr: false, // บอก Next.js ว่าไม่ต้องรัน Component นี้บน Server
  loading: () => (
    <div className="w-full h-72 bg-gray-300 rounded-xl flex items-center justify-center text-gray-500">
      กำลังโหลดแผนที่...
    </div>
  ),
});
// 5. (UPDATED) อัปเดต CategoryCard ให้รับ isActive prop
const CategoryCard = ({
  icon: Icon,
  label,
  isActive, // <-- prop ใหม่
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean; // <-- ทำให้เป็น optional
}) => (
  <div className="flex flex-col items-center justify-center gap-2.5 w-28 flex-shrink-0">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md border transition-all
        ${
          isActive
            ? "bg-sky-300 border-sky-400" // <-- สไตล์เมื่อถูกเลือก
            : "bg-sky-100 border-sky-200" // <-- สไตล์ปกติ
        }`}
    >
      <Icon className="w-6 h-6 text-sky-600" />
    </div>
    <span className="text-slate-500 text-xs font-medium text-center">
      {label}
    </span>
  </div>
);

// 2. (UPDATED) การ์ดสถานที่ (Expandable)
const PlaceCard = ({ place }: { place: Place }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-56 bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0 transition-all duration-300">
      {/* รูปภาพ */}
      <div className="w-full h-36 relative">
        <img
          src={place.imageUrl}
          alt={place.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/226x139/eee/aaa?text=Image";
          }}
        />
      </div>

      {/* รายละเอียด (ส่วนที่แสดงตลอด) */}
      <div className="p-2.5 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-xs font-medium">
            {place.title}
          </span>
          <span className="text-black text-xs font-normal">
            {place.distance}
          </span>
        </div>
        <div className="w-full h-px bg-zinc-300"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-black text-xs font-light">
              {place.location}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-black text-xs font-light">{place.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-black text-xs font-light">
                {place.openingHoursSummary}
              </span>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. (NEW) ส่วนข้อมูลเพิ่มเติมที่จะ Slide ออกมา */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="p-2.5 pt-0 space-y-2 border-t border-zinc-200 mt-2">
          {/* เวลาทำการแบบละเอียด */}
          {Object.entries(place.detailedHours).map(([day, time]) => (
            <div
              key={day}
              className="flex justify-between items-center text-xs"
            >
              <span className="text-gray-600">{day}</span>
              <span className="text-gray-800">{time}</span>
            </div>
          ))}
          {/* เว็บไซต์ */}
          <div className="flex items-center gap-2.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-xs font-light hover:underline"
            >
              {place.website}
            </a>
          </div>
          {/* เรตติ้ง */}
          <div className="flex items-center gap-2.5">
            <Star className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-black text-xs font-light">
              {place.rating.toFixed(1)} ({place.reviewCount} รีวิว)
            </span>
          </div>
          {/* เกี่ยวกับเรา */}
          <div>
            <span className="text-slate-500 text-xs font-medium">
              เกี่ยวกับเรา
            </span>
            <p className="text-black text-xs font-light mt-1">
              {place.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- (Main Page Component) ---

export default function PlacesPage() {
  // 6. (NEW) เพิ่ม State สำหรับการ Filter
  const [selectedCategory, setSelectedCategory] =
    useState<PlaceCategory | null>(null);

  // 7. (UPDATED) อัปเดตข้อมูลจำลองให้มี 'category'
  const mockPlaces: Place[] = [
    {
      id: 1,
      category: "CAFE",
      imageUrl: "https://placehold.co/226x139/FFF0D9/B47608?text=Cafe+1",
      title: "คาเฟ่หมาแมว",
      distance: "2.1 กม.",
      location: "ใกล้ ม.กรุงเทพ",
      lat: 13.7384,
      lng: 100.5309, // 4. (NEW) เพิ่ม Latitude
      // 4. (NEW) เพิ่ม Longitude
      phone: "099-9876543",
      openingHoursSummary: "ปิดวันจันทร์",
      detailedHours: {
        วันอาทิตย์: "11:00 - 20:00 น.",
        วันจันทร์: "ปิดทำการ",
        วันอังคาร: "11:00 - 20:00 น.",
        วันพุธ: "11:00 - 20:00 น.",
        วันพฤหัสบดี: "11:00 - 20:00 น.",
        วันศุกร์: "11:00 - 20:00 น.",
        วันเสาร์: "11:00 - 20:00 น.",
      },
      website: "www.dogcatcafe.com",
      rating: 4.8,
      reviewCount: 120,
      description: "คาเฟ่สำหรับคนรักสัตว์ นั่งชิลกับน้องๆ ได้ทั้งวัน",
    },
    {
      id: 2,
      category: "GROOMING",
      imageUrl: "https://placehold.co/226x139/E0F2FE/0891B2?text=Grooming+1",
      title: "สยาม เพ็ทช็อป",
      distance: "1.5 กม.",
      location: "พีต้า เพ็ทช็อป - BTS สยาม",
      lat: 13.746,
      lng: 100.5344,
      phone: "088-1234567",
      openingHoursSummary: "เปิด 10:00 - 18:00 น",
      detailedHours: {
        วันอาทิตย์: "10:00 - 18:00 น.",
        วันจันทร์: "10:00 - 18:00 น.",
        วันอังคาร: "10:00 - 18:00 น.",
        วันพุธ: "10:00 - 18:00 น.",
        วันพฤหัสบดี: "10:00 - 18:00 น.",
        วันศุกร์: "10:00 - 18:00 น.",
        วันเสาร์: "10:00 - 18:00 น.",
      },
      website: "www.siampetshop.com",
      rating: 5.0,
      reviewCount: 40,
      description:
        "บริการอาบน้ำตัดขน พร้อมจำหน่ายอาหาร อุปกรณ์ ของเล่นสัตว์เลี้ยง สุนัข แมว และอื่นๆอีกมากมาย...",
    },
    {
      id: 3,
      category: "HOSPITAL",
      imageUrl: "https://placehold.co/226x139/FEE2E2/DC2626?text=Hospital+1",
      title: "รพ. สัตว์ทองหล่อ",
      distance: "3.2 กม.",
      location: "สาขาสุขุมวิท",
      lat: 13.7234,
      lng: 100.582,
      phone: "02-123-4567",
      openingHoursSummary: "เปิด 24 ชั่วโมง",
      detailedHours: {
        วันอาทิตย์: "เปิด 24 ชั่วโมง",
        วันจันทร์: "เปิด 24 ชั่วโมง",
        วันอังคาร: "เปิด 24 ชั่วโมง",
        วันพุธ: "เปิด 24 ชั่วโมง",
        วันพฤหัสบดี: "เปิด 24 ชั่วโมง",
        วันศุกร์: "เปิด 24 ชั่วโมง",
        วันเสาร์: "เปิด 24 ชั่วโมง",
      },
      website: "www.thonglorpet.com",
      rating: 4.9,
      reviewCount: 350,
      description:
        "โรงพยาบาลสัตว์ครบวงจร พร้อมทีมสัตวแพทย์ผู้เชี่ยวชาญและเครื่องมือที่ทันสมัย",
    },
    {
      id: 4,
      category: "GROOMING",
      imageUrl: "https://placehold.co/226x139/E0F2FE/0891B2?text=Grooming+2",
      title: "Doggy Style Grooming",
      distance: "4.0 กม.",
      location: "ซอยอารีย์",
      lat: 13.78,
      lng: 100.545,
      phone: "081-555-6677",
      openingHoursSummary: "เปิด 09:00 - 17:00 น.",
      detailedHours: {
        วันอาทิตย์: "09:00 - 17:00 น.",
        วันจันทร์: "ปิดทำการ",
        วันอังคาร: "09:00 - 17:00 น.",
        วันพุธ: "09:00 - 17:00 น.",
        วันพฤหัสบดี: "09:00 - 17:00 น.",
        วันศุกร์: "09:00 - 17:00 น.",
        วันเสาร์: "09:00 - 17:00 น.",
      },
      website: "www.doggystyle.com",
      rating: 4.7,
      reviewCount: 85,
      description: "อาบน้ำ ตัดขน สปาน้องหมา โดยช่างมืออาชีพ",
    },
    {
      id: 5,
      category: "CAFE",
      imageUrl: "https://placehold.co/226x139/FFF0D9/B47608?text=Cafe+2",
      title: "Pet-Friendly Cafe",
      distance: "1.8 กม.",
      location: "ลาดพร้าว 71",
      lat: 56.2578,
      lng: 58.96314,
      phone: "02-222-3333",
      openingHoursSummary: "เปิด 10:00 - 20:00 น.",
      detailedHours: {
        วันอาทิตย์: "10:00 - 20:00 น.",
        วันจันทร์: "10:00 - 20:00 น.",
        วันอังคาร: "10:00 - 20:00 น.",
        วันพุธ: "10:00 - 20:00 น.",
        วันพฤหัสบดี: "10:00 - 20:00 น.",
        วันศุกร์: "10:00 - 20:00 น.",
        วันเสาร์: "10:00 - 20:00 น.",
      },
      website: "www.petfriendlycafe.com",
      rating: 4.5,
      reviewCount: 65,
      description: "ร้านกาแฟและอาหารที่ต้อนรับน้องๆ สัตว์เลี้ยงทุกชนิด",
    },
  ];
  const filteredPlaces = selectedCategory // ถ้ามี category ที่เลือก
    ? mockPlaces.filter((place) => place.category === selectedCategory) // ให้กรอง
    : mockPlaces; // ไม่งั้น (selectedCategory เป็น null) ให้แสดงทั้งหมด

  const mapPlaces = filteredPlaces.map((p) => ({
    id: p.id,
    title: p.title,
    lat: p.lat,
    lng: p.lng,
  }));

  return (
    <div className="mobile flex flex-col relative overflow-hidden">
      {/* 1. Top Navigation */}

      {/* 2. Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-4 py-3.5 space-y-6 pb-24">
        {/* Map Placeholder */}
        <div className="w-full h-72 bg-gray-300 rounded-xl shadow-md overflow-hidden">
          <MyMap places={mapPlaces} />
        </div>

        {/* 9. (UPDATED) Category Section (Horizontal Scroll) */}
        <section>
          <span className="text-black text-sm font-medium">ค้นหาตามประเภท</span>
          <div className="mt-2 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {/* ปุ่ม "ทั้งหมด" */}
            <button onClick={() => setSelectedCategory(null)}>
              <CategoryCard
                icon={List}
                label="ทั้งหมด"
                isActive={selectedCategory === null}
              />
            </button>
            {/* ปุ่ม "อาบน้ำ-ตัดขน" */}
            <button onClick={() => setSelectedCategory("GROOMING")}>
              <CategoryCard
                icon={Bath}
                label="อาบน้ำ-ตัดขน"
                isActive={selectedCategory === "GROOMING"}
              />
            </button>
            {/* ปุ่ม "คาเฟ่" */}
            <button onClick={() => setSelectedCategory("CAFE")}>
              <CategoryCard
                icon={Coffee}
                label="คาเฟ่-ร้านอาหาร"
                isActive={selectedCategory === "CAFE"}
              />
            </button>
            {/* ปุ่ม "โรงพยาบาล" */}
            <button onClick={() => setSelectedCategory("HOSPITAL")}>
              <CategoryCard
                icon={HeartPulse}
                label="โรงพยาบาลสัตว์"
                isActive={selectedCategory === "HOSPITAL"}
              />
            </button>
          </div>
        </section>

        {/* 10. (UPDATED) Recommended Places Section */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-2 items-start [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {filteredPlaces.length > 0 ? (
              // 11. (UPDATED) Render เฉพาะ 'filteredPlaces'
              filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))
            ) : (
              // 12. (NEW) แสดงผลกรณีไม่พบข้อมูล
              <div className="w-full text-center py-10 text-slate-500">
                ไม่พบสถานที่ในประเภทนี้
              </div>
            )}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
