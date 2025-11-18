"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  SunIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ArrowUpTrayIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import { createEvent } from "@/lib/api"; // 👈 เพิ่มอันนี้
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/navigation";

// 1. Config ของแต่ละ category (เหมือนเดิม)
const categoryConfig: Record<string, any> = {
  walk: {
    groupTitle: "เพิ่มกิจกรรมใหม่",
    title: "เดิน",
    icon: <SunIcon className="w-12 h-12" />,
    fields: ["duration", "distance"],
  },
  play: {
    groupTitle: "เพิ่มกิจกรรมใหม่",
    title: "เวลาเล่น",
    icon: <PlayCircleIcon className="w-12 h-12" />,
    fields: ["duration"],
  },
  train: {
    groupTitle: "เพิ่มกิจกรรมใหม่",
    title: "ฝึก",
    icon: <AcademicCapIcon className="w-12 h-12" />,
    fields: ["duration"],
  },
  symptom: {
    groupTitle: "เพิ่มข้อมูลสุขภาพ",
    title: "อาการ",
    icon: <ClipboardDocumentListIcon className="w-12 h-12" />,
    fields: ["reminder"],
  },
  vaccine: {
    groupTitle: "เพิ่มข้อมูลสุขภาพ",
    title: "วัคซีน",
    icon: <ShieldCheckIcon className="w-12 h-12" />,
    fields: ["reminder"],
  },
  medicine: {
    groupTitle: "เพิ่มข้อมูลสุขภาพ",
    title: "ยา",
    icon: <BeakerIcon className="w-12 h-12" />,
    fields: ["dosage"],
  },
  vet: {
    groupTitle: "เพิ่มข้อมูลสุขภาพ",
    title: "พบสัตว์แพทย์",
    icon: <BuildingStorefrontIcon className="w-12 h-12" />,
    fields: ["reminder"],
  },
  weight: {
    groupTitle: "เพิ่มข้อมูลสุขภาพ",
    title: "น้ำหนัก",
    icon: <ScaleIcon className="w-12 h-12" />,
    fields: ["weight"],
  },
  expense: {
    groupTitle: "เพิ่มค่าใช้จ่าย",
    title: "ค่าใช้จ่าย",
    icon: <CurrencyDollarIcon className="w-12 h-12" />,
    fields: ["amount"],
  },
};

// ✨ mapping category → eventTypeId + detail.type สำหรับ backend
const eventTypeMap: Record<
  string,
  { eventTypeId: number; detailType: string | null }
> = {
  walk: { eventTypeId: 1, detailType: "WALK" },
  play: { eventTypeId: 2, detailType: "PLAY" },
  train: { eventTypeId: 3, detailType: "TRAINING" },
  symptom: { eventTypeId: 4, detailType: "SYMPTOM" },
  vaccine: { eventTypeId: 5, detailType: "VACCINE" },
  medicine: { eventTypeId: 6, detailType: "MEDICATION" },
  vet: { eventTypeId: 7, detailType: "VET_VISIT" },
  weight: { eventTypeId: 8, detailType: "WEIGHT" },
  expense: { eventTypeId: 9, detailType: "EXPENSE" },
};

type FormState = {
  name: string;
  date: string; // UI แสดงเฉย ๆ ยังไม่ได้ผูกกับ eventAt
  time: string; // HH:mm
  duration_hr: number;
  duration_min: number;
  distance: number;
  weight: number;
  dosageAmount: number;
  dosageUnit: string;
  amount: number;
  reminder: string;
  note: string;
};

const DynamicEventFormPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDate = searchParams.get("date"); // <-- ดึงตรงนี้ครั้งเดียว

  const categorySlug = params.category as string;
  const config = categoryConfig[categorySlug];

  
const [formData, setFormData] = useState<FormState>(() => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  return {
    name: "",
    date: selectedDate
      ? new Date(selectedDate).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "ยังไม่ได้เลือกวัน",
    time: `${hh}:${mm}`,          // 👈 default เป็นเวลาปัจจุบัน

    duration_hr: 0,
    duration_min: 30,
    distance: 1.0,
    weight: 2.5,
    dosageAmount: 50,
    dosageUnit: "mg",
    amount: 200,
    reminder: "everyday",
    note: "",
  };
});
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // แปลง field จำนวนให้เป็น number
    const numericFields = [
      "duration_hr",
      "duration_min",
      "distance",
      "weight",
      "dosageAmount",
      "amount",
    ] as const;

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name as any) ? Number(value) : value,
    }));
  };

  if (!config) {
    return (
      <div className="text-center p-10">
        <p>ไม่พบประเภทการบันทึกที่เลือก</p>
        <Link href="/new-event" className="text-blue-600">
          กลับไปหน้าเลือกประเภท
        </Link>
      </div>
    );
  }

  const buildPayload = (dogId: number, selectedDate: string | null) => {
    const mapping = eventTypeMap[categorySlug];
    if (!mapping) throw new Error("Unknown category");

    const { eventTypeId, detailType } = mapping;

    // ถ้ามี selectedDate + time → ใช้เป็น eventAt จริง
    const eventAt = selectedDate
      ? new Date(`${selectedDate}T${formData.time || "00:00"}:00`).toISOString()
      : new Date().toISOString(); // fallback กันพัง

    let detail: any = undefined;

    switch (detailType) {
      case "WALK":
        detail = {
          type: "WALK",
          distanceKm: formData.distance,
          durationMin: formData.duration_hr * 60 + formData.duration_min,
        };
        break;

      case "PLAY":
        detail = {
          type: "PLAY",
          durationMin: formData.duration_hr * 60 + formData.duration_min,
        };
        break;

      case "TRAINING":
        detail = {
          type: "TRAINING",
          durationMin: formData.duration_hr * 60 + formData.duration_min,
        };
        break;

      case "SYMPTOM":
        detail = {
          type: "SYMPTOM",
          symptom: formData.name, // ใช้ name เป็นชื่ออาการ
          severity: undefined,
          sinceWhen: undefined,
        };
        break;

      case "VACCINE":
        detail = {
          type: "VACCINE",
        };
        break;

      case "MEDICATION":
        detail = {
          type: "MEDICATION",
          dosageAmount: formData.dosageAmount,
          dosageUnit: formData.dosageUnit,
        };
        break;

      case "VET_VISIT":
        detail = {
          type: "VET_VISIT",
          reason: formData.name, // เหตุผลที่ไปหาหมอ
          clinicName: undefined,
          vetName: undefined,
          cost: formData.amount || undefined,
          nextAppointment: undefined,
        };
        break;

      case "WEIGHT":
        detail = {
          type: "WEIGHT",
          weightKg: formData.weight,
        };
        break;

      case "EXPENSE":
        detail = {
          type: "EXPENSE",
          amount: formData.amount,
          currency: "THB",
        };
        break;

      default:
        detail = undefined;
    }

    return {
      dogId,
      eventTypeId,
      eventAt,
      note: formData.note || undefined,
      imageUrl: undefined,
      detail,
    };
  };

  // 🎯 กดปุ่มบันทึก → call createEvent
  const handleSave = async () => {
    try {
      setSaving(true);

      const petIdStr = localStorage.getItem("petId");
      const petId = petIdStr ? Number(petIdStr) : 0;
      if (!petId) {
        alert("ไม่พบรหัสสุนัข (petId) ในระบบ");
        return;
      }

      const payload = buildPayload(petId, selectedDate);

      const res = await createEvent(payload);
      console.log("createEvent petId:", petId);
      console.log("payload:", payload);
      if (res.status >= 200 && res.status < 300) {
        // จะ redirect ไปหน้าก่อนหน้า / หน้า list ก็ได้
        router.back();
      } else {
        console.error("createEvent failed:", res);
        alert(res.error ?? "บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  // helper สำหรับ dynamic fields
  const renderDynamicFields = () => {
    const numberOptions = (max: number) =>
      Array.from(Array(max).keys()).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ));

    const inputStyle =
      "text-right text-sm border-none focus:ring-0 p-0 w-24 bg-transparent";
    const selectStyle =
      "text-right text-sm border-none focus:ring-0 p-0 bg-transparent pr-8";

    return (
      <>
        {config.fields.includes("duration") && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">ระยะเวลา:</span>
            <div className="flex items-center gap-2">
              <select
                name="duration_hr"
                value={formData.duration_hr}
                onChange={handleChange}
                className={selectStyle}
              >
                {numberOptions(24)}
              </select>
              <span className="text-sm">ชม.</span>
              <select
                name="duration_min"
                value={formData.duration_min}
                onChange={handleChange}
                className={selectStyle}
              >
                {numberOptions(60)}
              </select>
              <span className="text-sm">นาที</span>
            </div>
          </div>
        )}

        {config.fields.includes("distance") && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">ระยะทาง:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className={inputStyle}
                step="0.1"
              />
              <span className="text-sm text-gray-900">กม.</span>
            </div>
          </div>
        )}

        {config.fields.includes("weight") && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">น้ำหนัก:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={inputStyle}
                step="0.1"
              />
              <span className="text-sm text-gray-900">กก.</span>
            </div>
          </div>
        )}

        {config.fields.includes("dosage") && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">ปริมาณยา:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="dosageAmount"
                value={formData.dosageAmount}
                onChange={handleChange}
                className={inputStyle}
              />
              <select
                name="dosageUnit"
                value={formData.dosageUnit}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="เม็ด">เม็ด</option>
              </select>
            </div>
          </div>
        )}

        {config.fields.includes("amount") && (
          <div className="flex justify_between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">จำนวน:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={inputStyle}
              />
              <span className="text-sm text-gray-900">บาท</span>
            </div>
          </div>
        )}

        {config.fields.includes("reminder") && (
          <>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">แจ้งเตือน:</span>
              <select
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
                className={selectStyle}
              >
                <option value="everyday">ทุกวัน</option>
                <option value="once">ครั้งเดียว</option>
                <option value="no">ไม่แจ้งเตือน</option>
              </select>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">
                วันที่สิ้นสุดการแจ้งเตือน:
              </span>
              <span className="text-sm text-gray-900">
                25 พฤศจิกายน พ.ศ.2567
              </span>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="mobile flex flex-col items-center px-2">
      <div className="flex items-center justify-center relative mb-4 w-full pt-10">
        <Link href="/new-event" className="absolute left-0 text-gray-700 p-2">
          <ChevronLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-medium text-gray-800">
          {config.groupTitle}
        </h1>
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-24 h-24 bg-blue-100/60 rounded-full flex justify-center items-center text-blue-600">
          {config.icon}
        </div>
        <span className="text-2xl font-semibold text-gray-800">
          {config.title}
        </span>
      </div>

      <div className="w-full bg-white rounded-2xl p-6 space-y-2 border border-73a2ac">
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          {config.groupTitle === "เพิ่มค่าใช้จ่าย"
            ? "ข้อมูลค่าใช้จ่าย"
            : "ข้อมูลสุขภาพ"}
        </h2>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-700">ชื่อ:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="text-right text-sm border-none focus:ring-0 p-0 placeholder-gray-400"
            placeholder="เพิ่มชื่อ..."
          />
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-700">วัน:</span>
          <span className="text-sm text-gray-900">{formData.date}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-700">เวลา:</span>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="text-right text-sm border-none focus:ring-0 p-0 bg-transparent"
          />
        </div>

        {renderDynamicFields()}

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-700">โน้ต:</span>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="text-right text-sm border-none focus:ring-0 p-0 placeholder-gray-400"
            placeholder="เพิ่มโน้ต..."
          />
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-gray-700">รูป:</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">1...4 (รูป) อัปโหลด</span>
            <button className="flex items-center gap-1 text-sm text-blue-600">
              อัปโหลดไฟล์ <ArrowUpTrayIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-300 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-gray-800 font-medium py-3 px-6 rounded-full shadow-lg"
        >
          {saving ? "กำลังบันทึก..." : "บันทึก"}{" "}
          <CheckIcon className="w-5 h-5" />
        </button>
      </div>
      <Navigation />
    </div>
  );
};

export default DynamicEventFormPage;
