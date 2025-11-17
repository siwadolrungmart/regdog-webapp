// -------------------------------------------------------------
// ไฟล์: app/new-event/page.tsx (หรือ path ที่คุณใช้จริง)
// -------------------------------------------------------------
"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  SunIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

// --- Helper Component (สร้างปุ่มสี่เหลี่ยมสวยๆ) ---
const CategoryButton = ({
  icon,
  label,
  href = "#",
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center space-y-2 group"
  >
    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex justify-center items-center text-blue-600 shadow-sm transition-all group-hover:bg-blue-200 group-hover:shadow-md">
      {icon}
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </Link>
);

// --- คอมโพเนนต์หลักของหน้า ---
const NewEventPage = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date"); // รับมาจาก calendar เช่น 2025-04-17

  // helper แปะ ?date= ให้ทุกลิงก์ ถ้ามี
  const withDate = (path: string) =>
    date ? `${path}?date=${encodeURIComponent(date)}` : path;

  return (
    <div className="w-full max-w-sm mx-auto p-4 relative z-10">
      <div className="flex items-center justify-center relative mb-6">
        <Link
          href={withDate("/calendar")}
          className="absolute left-0 text-gray-700 p-2"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-medium text-gray-800">
          เลือกประเภทเพื่อบันทึก
        </h1>
      </div>

      {/* รายการ Categories */}
      <div className="space-y-6">
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
            กิจกรรม
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <CategoryButton
              href={withDate("/new-event/walk")}
              icon={<SunIcon className="w-10 h-10" />}
              label="เดิน"
            />
            <CategoryButton
              href={withDate("/new-event/play")}
              icon={<PlayCircleIcon className="w-10 h-10" />}
              label="เวลาเล่น"
            />
            <CategoryButton
              href={withDate("/new-event/train")}
              icon={<AcademicCapIcon className="w-10 h-10" />}
              label="ฝึก"
            />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
            สุขภาพ
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <CategoryButton
              href={withDate("/new-event/symptom")}
              icon={<ClipboardDocumentListIcon className="w-10 h-10" />}
              label="อาการ"
            />
            <CategoryButton
              href={withDate("/new-event/vaccine")}
              icon={<ShieldCheckIcon className="w-10 h-10" />}
              label="วัคซีน"
            />
            <CategoryButton
              href={withDate("/new-event/medicine")}
              icon={<BeakerIcon className="w-10 h-10" />}
              label="ยา"
            />
            <CategoryButton
              href={withDate("/new-event/vet")}
              icon={<BuildingStorefrontIcon className="w-10 h-10" />}
              label="พบสัตว์แพทย์"
            />
            <CategoryButton
              href={withDate("/new-event/weight")}
              icon={<ScaleIcon className="w-10 h-10" />}
              label="น้ำหนัก"
            />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
            ค่าใช้จ่าย
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <CategoryButton
              href={withDate("/new-event/expense")}
              icon={<CurrencyDollarIcon className="w-10 h-10" />}
              label="ค่าใช้จ่าย"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewEventPage;
