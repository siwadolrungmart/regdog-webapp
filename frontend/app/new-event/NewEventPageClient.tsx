// app/new-event/NewEventPageClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import Navigation from "@/components/navigation";

// ปุ่ม category
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

export default function NewEventPageClient() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date"); // เอาวันที่จาก query ?date=...

  // เวลาไปหน้า form จริง ให้ส่ง query date ต่อไปด้วย
  const buildHref = (slug: string) =>
    selectedDate ? `/new-event/${slug}?date=${selectedDate}` : `/new-event/${slug}`;

  return (
    <div className="mobile flex flex-col items-center px-2">
      <div className="flex flex-col items-center justify-center relative mb-4 w-full pt-10">
          <Link href="/calendar" className="absolute left-0 text-gray-700 p-2">
            <ChevronLeftIcon className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-medium text-gray-800">
            เลือกประเภทเพื่อบันทึก
          </h1>
        </div>

        <div className="space-y-6 w-full px-4">
          {/* กิจกรรม */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
              กิจกรรม
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <CategoryButton
                href={buildHref("walk")}
                icon={<SunIcon className="w-10 h-10" />}
                label="เดิน"
              />
              <CategoryButton
                href={buildHref("play")}
                icon={<PlayCircleIcon className="w-10 h-10" />}
                label="เวลาเล่น"
              />
              <CategoryButton
                href={buildHref("train")}
                icon={<AcademicCapIcon className="w-10 h-10" />}
                label="ฝึก"
              />
            </div>
          </section>

          {/* สุขภาพ */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
              สุขภาพ
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <CategoryButton
                href={buildHref("symptom")}
                icon={
                  <ClipboardDocumentListIcon className="w-10 h-10" />
                }
                label="อาการ"
              />
              <CategoryButton
                href={buildHref("vaccine")}
                icon={<ShieldCheckIcon className="w-10 h-10" />}
                label="วัคซีน"
              />
              <CategoryButton
                href={buildHref("medicine")}
                icon={<BeakerIcon className="w-10 h-10" />}
                label="ยา"
              />
              <CategoryButton
                href={buildHref("vet")}
                icon={<BuildingStorefrontIcon className="w-10 h-10" />}
                label="พบสัตว์แพทย์"
              />
              <CategoryButton
                href={buildHref("weight")}
                icon={<ScaleIcon className="w-10 h-10" />}
                label="น้ำหนัก"
              />
            </div>
          </section>

          {/* ค่าใช้จ่าย */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3 px-2">
              ค่าใช้จ่าย
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <CategoryButton
                href={buildHref("expense")}
                icon={<CurrencyDollarIcon className="w-10 h-10" />}
                label="ค่าใช้จ่าย"
              />
            </div>
          </section>
        </div>
      <Navigation />
    </div>
  );
}