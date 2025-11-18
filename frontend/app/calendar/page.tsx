// app/calendar/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Navigation from "../../components/navigation";
import Link from "next/link";
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  BellAlertIcon,
  UsersIcon,
  CalendarDaysIcon as CalendarIcon,
} from "@heroicons/react/24/outline";
import { getDogEvents } from "@/lib/api";
import Bar from "@/components/bar";

// ---------- types ----------
type ApiEventItem = {
  id: number;
  dogId: number;
  eventTypeId: number;
  eventAt: string;
  note?: string | null;
  imageUrl?: string | null;
  eventType?: {
    id: number;
    code: string; // WALK / PLAY ...
    nameTh: string;
    category: "ACTIVITY" | "HEALTH" | "EXPENSE";
  };
  walkEvent?: {
    eventId: number;
    distanceKm: number | null;
    durationMin: number | null;
  } | null;
  playEvent?: { eventId: number; durationMin: number | null } | null;
  trainingEvent?: { eventId: number; durationMin: number | null } | null;
  symptomEvent?: {
    eventId: number;
    symptom: string;
    severity: number | null;
    sinceWhen: string | null;
  } | null;
  vaccineEvent?: any | null;
  medicationEvent?: any | null;
  vetVisitEvent?: any | null;
  weightEvent?: { eventId: number; weightKg: number } | null;
  expenseEvent?: {
    eventId: number;
    amount: number;
    currency: string | null;
  } | null;
};

type Event = {
  id: number;
  title: string;
  time: string;
  icon: React.ReactNode;
  alert?: boolean;
};

// ---------- helpers ----------
const getISODateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatTimeThai = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getIconForEvent = (
  eventType?: ApiEventItem["eventType"],
): React.ReactNode => {
  if (!eventType) return <CalendarIcon className="w-5 h-5" />;

  switch (eventType.code) {
    case "SYMPTOM":
      return <PencilSquareIcon className="w-5 h-5" />;
    case "TRAINING":
      return <UsersIcon className="w-5 h-5" />;
    case "WALK":
      return <ClipboardDocumentListIcon className="w-5 h-5" />;
    case "PLAY":
      return <ClipboardDocumentListIcon className="w-5 h-5" />;
    default:
      return <CalendarIcon className="w-5 h-5" />;
  }
};

// group จาก items จริง
const groupEventsByDate = (items: ApiEventItem[]): Record<string, Event[]> => {
  const result: Record<string, Event[]> = {};

  for (const item of items) {
    const key = getISODateString(new Date(item.eventAt));

    let title = item.eventType?.nameTh ?? item.eventType?.code ?? "กิจกรรม";

    switch (item.eventType?.code) {
      case "WALK": {
        const dist = item.walkEvent?.distanceKm ?? 0;
        const dur = item.walkEvent?.durationMin ?? 0;
        title = `เดิน ${dist} กม. (${dur} นาที)`;
        break;
      }
      case "PLAY": {
        const dur = item.playEvent?.durationMin ?? 0;
        title = `เวลาเล่น ${dur} นาที`;
        break;
      }
      case "TRAINING": {
        const dur = item.trainingEvent?.durationMin ?? 0;
        title = `ฝึก ${dur} นาที`;
        break;
      }
      case "SYMPTOM": {
        const symptom = item.symptomEvent?.symptom || "อาการ";
        title = `อาการ: ${symptom}`;
        break;
      }
      case "WEIGHT": {
        const w = item.weightEvent?.weightKg;
        title = w ? `ชั่งน้ำหนัก ${w.toFixed(1)} กก.` : "ชั่งน้ำหนัก";
        break;
      }
      case "EXPENSE": {
        const amount = item.expenseEvent?.amount;
        title = amount ? `ค่าใช้จ่าย ${amount} บาท` : "ค่าใช้จ่าย";
        break;
      }
    }

    const ev: Event = {
      id: item.id,
      title,
      time: formatTimeThai(item.eventAt),
      icon: getIconForEvent(item.eventType),
      alert: item.eventType?.category === "HEALTH",
    };

    if (!result[key]) result[key] = [];
    result[key].push(ev);
  }

  return result;
};

// ---------- main component ----------
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date()); // 👈 เปลี่ยนให้เป็น "วันนี้" ไม่ fix เม.ย. 2025
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 // ลบท่อน useEffect เดิมออก แล้วใช้แบบนี้แทน

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const petIdStr = localStorage.getItem("petId");
      const petId = petIdStr ? Number(petIdStr) : undefined;
      if (!petId) {
        setEventsByDate({});
        return;
      }

      // ใช้เดือนของ selectedDate ในการกำหนดช่วง
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth  = new Date(year, month + 1, 0);

      const since = new Date(firstDayOfMonth);
      since.setHours(0, 0, 0, 0);

      const until = new Date(lastDayOfMonth);
      until.setHours(23, 59, 59, 999);

      // ตรงนี้สำคัญ: getDogEvents ต้องรองรับ object แบบนี้
      const res = await getDogEvents({
        dogId: petId,
        since: since.toISOString(),
        until: until.toISOString(),
        page: 1,
        pageSize: 200,
      });

      if (res.status >= 200 && res.status < 300 && res.data?.items) {
        const grouped = groupEventsByDate(res.data.items as ApiEventItem[]);
        setEventsByDate(grouped);
        console.log("eventsByDate", grouped);
      } else {
        setError(res.error ?? "โหลดข้อมูลไม่สำเร็จ");
      }
    } catch (e) {
      console.error(e);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, [selectedDate]); // 👈 เปลี่ยน dependency เป็น selectedDate

  const thaiWeekdays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const thaiLocale = "th-TH";

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const selectedDay = selectedDate.getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // ใช้ค่า getDay() ตรง ๆ เพราะหัวตารางเริ่ม อา.
  const daysFromPrevMonth = firstDayOfMonth;

  const prevMonthDays: number[] = [];
  for (let i = 0; i < daysFromPrevMonth; i++) {
    prevMonthDays.push(daysInPrevMonth - daysFromPrevMonth + i + 1);
  }

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = 42;
  const nextMonthDaysCount = totalCells - (daysFromPrevMonth + daysInMonth);
  const nextMonthDays = Array.from(
    { length: nextMonthDaysCount },
    (_, i) => i + 1,
  );

  const handlePrevMonth = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(1);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth(), day),
    );
  };

  const selectedDateKey = getISODateString(selectedDate);
  const eventsForSelectedDay = eventsByDate[selectedDateKey] || [];

  return (
    <div className="mobile mobile flex flex-col items-center">
      {/* header */}
      <header className="relative flex justify-between items-center px-4 z-20 w-full">
        <Bar />
      </header>

      {/* main */}
      <main className="relative z-10 p-4 w-full">
        <div className="w-full bg-white rounded-2xl shadow-lg p-4">
          {/* month header */}
          <div className="flex justify-between items-center mb-4 px-2">
            <button
              onClick={handlePrevMonth}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-base font-medium text-gray-700">
                {selectedDate.toLocaleDateString(thaiLocale, { month: "long" })}
              </span>
              <span className="text-base font-medium text-gray-700">
                {selectedDate.toLocaleDateString(thaiLocale, {
                  year: "numeric",
                })}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* calendar grid */}
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {thaiWeekdays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-700 w-10 h-10 flex justify-center items-center"
              >
                {day}
              </div>
            ))}

            {prevMonthDays.map((day) => (
              <div
                key={`prev-${day}`}
                className="text-center text-sm text-gray-300 w-10 h-10 flex justify-center items-center rounded-full"
              >
                {day}
              </div>
            ))}

            {currentMonthDays.map((day) => {
              const isSelected = day === selectedDay;
              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`text-center text-sm w-10 h-10 flex justify-center items-center rounded-full cursor-pointer transition-colors
                    ${
                      isSelected
                        ? "bg-rose-200 text-white font-bold"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {day}
                </div>
              );
            })}

            {nextMonthDays.map((day) => (
              <div
                key={`next-${day}`}
                className="text-center text-sm text-gray-300 w-10 h-10 flex justify-center items-center rounded-full"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* events list */}
        <div className="flex flex-col mt-6 space-y-3 max-h-[600px] overflow-y-auto">
          {loading && (
            <div className="text-center text-gray-500 pt-4">
              กำลังโหลดนัดหมาย...
            </div>
          )}

          {error && !loading && (
            <div className="text-center text-red-500 pt-4">{error}</div>
          )}

          {!loading && !error && eventsForSelectedDay.length > 0
            ? eventsForSelectedDay.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg p-3 h-14"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex justify-center items-center text-blue-600">
                      {event.icon}
                    </div>
                    <span className="text-sm text-gray-700">{event.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{event.time}</span>
                    {event.alert && (
                      <BellAlertIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
              ))
            : !loading &&
              !error && (
                <div className="text-center text-gray-500 pt-4">
                  ไม่มีนัดหมายสำหรับวันนี้
                </div>
              )}
        </div>
      </main>

      {/* add button + bottom nav */}
      <Link
        href={`/new-event?date=${getISODateString(selectedDate)}`}
        className="fixed bottom-24 right-[35%] transform -translate-x-1/2 w-14 h-14 bg-amber-300 hover:bg-amber-400 rounded-2xl shadow-lg flex justify-center items-center text-gray-800 z-20"
      >
        <PlusIcon className="w-8 h-8" />
      </Link>

      <Navigation />
    </div>
  );
};

export default CalendarPage;
