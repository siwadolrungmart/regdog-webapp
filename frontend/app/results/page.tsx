"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Bar from "@/components/bar";
import Navigation from "@/components/navigation";
import { getDogEventsByRange } from "@/lib/api";

// ---------- types ----------
type DogEvent = {
  id: number;
  eventAt: string;
  eventType: {
    id: number;
    code: string; // WALK / WEIGHT / ...
    nameTh: string;
    category: "ACTIVITY" | "HEALTH" | "EXPENSE";
  };
  walkEvent?: { distanceKm: number | null; durationMin: number | null } | null;
  weightEvent?: { weightKg: number } | null;
  expenseEvent?: { amount: number; currency: string | null } | null;
};

// helper คำนวณช่วงเวลา window ปัจจุบัน (ตาม period + rangeOffset)
function getWindow(period: "6weeks" | "6months", rangeOffset: number) {
  const now = new Date();

  if (period === "6weeks") {
    // ช่วงยาว 6 สัปดาห์ = 42 วัน
    const daysSpan = 7 * 6;

    const until = new Date(now);
    until.setDate(until.getDate() - rangeOffset * daysSpan);
    until.setHours(23, 59, 59, 999);

    const since = new Date(until);
    since.setDate(until.getDate() - daysSpan);
    since.setHours(0, 0, 0, 0);

    return { since, until };
  }

  // 6months
  const monthsSpan = 6;
  const until = new Date(now);
  until.setMonth(until.getMonth() - rangeOffset * monthsSpan);
  until.setHours(23, 59, 59, 999);

  const since = new Date(until);
  since.setMonth(until.getMonth() - monthsSpan);
  since.setHours(0, 0, 0, 0);

  return { since, until };
}

// ---------- Bar Chart ----------
function BarChart({
  labels,
  amounts,
  colors,
}: {
  labels: string[];
  amounts: number[];
  colors: string[];
}) {
  const maxVal = Math.max(...amounts, 1);

  return (
    <div className="relative h-48 w-full flex flex-col justify-between">
      {/* เส้น grid */}
      <div className="absolute inset-0 flex flex-col justify-between py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-t border-dashed border-[#E5D9FF]" />
        ))}
      </div>

      {/* แท่งกราฟ */}
      <div className="relative z-10 flex justify-around items-end h-full">
        {labels.map((label, i) => {
          const amount = amounts[i] ?? 0;
          const height =
            amount === 0 ? 4 : Math.max((amount / maxVal) * 110, 20); // 20–110px

          return (
            <div key={i} className="flex flex-col items-center gap-1 w-10">
              <span className="text-[10px] text-[#F587B6] font-medium">
                {amount >= 1000
                  ? (amount / 1000).toFixed(1) + "k"
                  : amount || ""}
              </span>

              <div
                className="w-6 rounded-xl shadow"
                style={{
                  height: `${height}px`,
                  backgroundColor: colors[i % colors.length],
                }}
              />

              <span className="text-[11px] text-[#F5A8C5] font-medium">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- MAIN PAGE ----------
export default function SummaryPage() {
  const [tab, setTab] = useState<"expense" | "weight" | "walk">("expense");
  const [period, setPeriod] = useState<"6weeks" | "6months">("6weeks");

  // offset ของช่วง 6w / 6m
  // 0 = ช่วงล่าสุด, 1 = 6w/6m ก่อนหน้า, 2 = ก่อนหน้าไปอีก...
  const [rangeOffset, setRangeOffset] = useState(0);

  const [events, setEvents] = useState<DogEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // โหลด event ตามช่วง (period + rangeOffset)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const petIdStr = localStorage.getItem("petId");
        const dogId = petIdStr ? Number(petIdStr) : 0;
        if (!dogId) {
          setEvents([]);
          return;
        }

        const { since, until } = getWindow(period, rangeOffset);

        const res = await getDogEventsByRange({
          dogId,
          since: since.toISOString(),
          until: until.toISOString(),
        });

        if (res.status >= 200 && res.status < 300 && res.data?.items) {
          const all = res.data.items as DogEvent[];
          console.log("fetched events:", all);
          setEvents(all);
        } else {
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [period, rangeOffset]);

  // ------------ สรุป "ค่าใช้จ่าย" จาก events จริง ------------
  const expenseEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.expenseEvent &&
          (e.eventType?.category === "EXPENSE" ||
            e.eventType?.code === "EXPENSE" ||
            e.eventType.id === 9),
      ),
    [events],
  );

  console.log("expenseEvents:", expenseEvents);

  // 6 สัปดาห์ย้อนหลัง → สรุปเป็น 7 แท่งตามวันในสัปดาห์
  const weeklySummary = useMemo(() => {
    if (period !== "6weeks") return Array(7).fill(0);

    const amountsPerDay = Array(7).fill(0); // 0=อาทิตย์ ... 6=เสาร์
    expenseEvents.forEach((e) => {
      const d = new Date(e.eventAt);
      const idx = d.getDay();
      amountsPerDay[idx] += e.expenseEvent?.amount ?? 0;
    });

    return amountsPerDay;
  }, [expenseEvents, period]);

  // 6 เดือนย้อนหลัง → 6 แท่งตามเดือน
  const monthlySummary = useMemo(() => {
    if (period !== "6months") return Array(6).fill(0);

    const { since } = getWindow("6months", rangeOffset);
    const startMonth = new Date(since.getFullYear(), since.getMonth(), 1);
    const perMonth = Array(6).fill(0);

    expenseEvents.forEach((e) => {
      const d = new Date(e.eventAt);
      const diff =
        (d.getFullYear() - startMonth.getFullYear()) * 12 +
        (d.getMonth() - startMonth.getMonth());
      if (diff < 0 || diff > 5) return;
      perMonth[diff] += e.expenseEvent?.amount ?? 0;
    });

    return perMonth;
  }, [expenseEvents, period, rangeOffset]);

  // label แท่ง
  const weeklyLabels = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
    "เสาร์",
  ];

  const monthlyLabels = useMemo(() => {
    if (period !== "6months") return [];
    const { since } = getWindow("6months", rangeOffset);
    const start = new Date(since.getFullYear(), since.getMonth(), 1);

    const labels: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      labels.push(`${d.getMonth() + 1}/${d.getFullYear() + 543}`);
    }
    return labels;
  }, [period, rangeOffset]);

  const isWeekly = period === "6weeks";

  const chartLabels =
    tab === "expense" ? (isWeekly ? weeklyLabels : monthlyLabels) : [];
  const chartAmounts =
    tab === "expense" ? (isWeekly ? weeklySummary : monthlySummary) : [];
  const chartColors =
    tab === "expense"
      ? isWeekly
        ? [
            "#FF8B8B",
            "#FFD47A",
            "#FFB4F0",
            "#C5F59C",
            "#FFB37A",
            "#A6D3FF",
            "#D8B7FF",
          ]
        : ["#A6D3FF"]
      : ["#A6D3FF"];

  const totalAmount = chartAmounts.reduce((s, v) => s + v, 0);
  const totalExpense = expenseEvents.reduce(
    (sum, e) => sum + (e.expenseEvent?.amount ?? 0),
    0,
  );

  // label ช่วงเวลา
  const rangeLabel = useMemo(() => {
    const { since, until } = getWindow(period, rangeOffset);

    if (period === "6months") {
      const fmtMonth = (d: Date) =>
        d.toLocaleDateString("th-TH", {
          month: "short",
          year: "numeric",
        });
      return `${fmtMonth(since)} – ${fmtMonth(until)}`;
    }

    // 6weeks → แสดงช่วงวัน (วัน/เดือน/ปี)
    const fmt = (d: Date) =>
      d.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    return `${fmt(since)} – ${fmt(until)}`;
  }, [period, rangeOffset]);

  const listTitle =
    tab === "expense"
      ? isWeekly
        ? "แบ่งตามค่าใช้จ่ายรายวัน"
        : "แบ่งตามค่าใช้จ่ายรายเดือน"
      : "ยังไม่มีข้อมูลสรุปสำหรับแท็บนี้";

  const canGoNext = rangeOffset > 0; // ปุ่มขวา (เข้าใกล้ปัจจุบัน) กดได้เฉพาะเมื่อ offset > 0

  return (
    <div className="mobile relative">
      {/* top bar */}
      <header className="relative flex justify-between items-center px-4 z-20 w-full">
        <Bar />
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center gap-3">
          {["ค่าใช้จ่าย", "น้ำหนัก", "เดิน"].map((item, idx) => {
            const key = idx === 0 ? "expense" : idx === 1 ? "weight" : "walk";

            return (
              <button
                key={idx}
                onClick={() => setTab(key as any)}
                className={`px-4 py-1 rounded-full text-sm border ${
                  tab === key
                    ? "bg-[#AEE1FF] border-[#82CFFD] text-[#1A4B5A]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Period toggle */}
        <button
          className="w-full bg-[#FFE89A] rounded-xl py-2 text-center text-gray-700 font-medium text-sm flex justify-center items-center gap-2"
          onClick={() => {
            setPeriod((prev) => (prev === "6weeks" ? "6months" : "6weeks"));
            setRangeOffset(0); // เปลี่ยนโหมด → กลับมาช่วงล่าสุดเสมอ
          }}
        >
          {period === "6weeks" ? "6 สัปดาห์ย้อนหลัง" : "6 เดือนย้อนหลัง"} ▼
        </button>

        {/* Total box */}
        <div className="w-full bg-[#D9F4FF] text-center py-6 rounded-xl shadow text-3xl font-bold text-[#2B4A5A]">
          {tab === "expense" ? totalExpense.toLocaleString() : "-"} ฿
          <p className="text-sm font-medium text-[#57727E] mt-1">
            {tab === "expense"
              ? "ค่าใช้จ่ายทั้งหมด"
              : tab === "weight"
                ? "สรุปน้ำหนัก (ทำเพิ่มทีหลัง)"
                : "สรุปการเดิน (ทำเพิ่มทีหลัง)"}
          </p>
        </div>

        {/* Range label + ปุ่มเลื่อนช่วง */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => setRangeOffset((o) => o + 1)} // ย้อนกลับไปช่วงเก่ากว่า
            className="p-1 rounded-full hover:bg-gray-100 active:scale-95 transition disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>

          <span className="text-xs font-medium text-gray-700 text-center">
            {rangeLabel}
          </span>

          <button
            onClick={
              () => setRangeOffset((o) => Math.max(0, o - 1)) // กลับเข้ามาใกล้ปัจจุบัน
            }
            disabled={!canGoNext}
            className="p-1 rounded-full hover:bg-gray-100 active:scale-95 transition disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Chart */}
        <div className="p-3 bg-white border-[3px] border-[#E5D9FF] rounded-3xl shadow-sm min-h-[222px] flex flex-col justify-center items-center">
          {loading ? (
            <div className="text-xs text-gray-400">กำลังโหลดข้อมูล...</div>
          ) : tab !== "expense" ? (
            <div className="text-xs text-gray-400">
              ตอนนี้สรุปเฉพาะแท็บค่าใช้จ่ายก่อน
            </div>
          ) : chartAmounts.every((v) => v === 0) ? (
            <div className="text-xs text-gray-400">
              ยังไม่มีข้อมูลค่าใช้จ่ายในช่วงนี้
            </div>
          ) : (
            <BarChart
              labels={chartLabels}
              amounts={chartAmounts}
              colors={chartColors}
            />
          )}
        </div>

        {/* List ข้างล่าง */}
        <section>
          <h3 className="text-sm font-semibold text-gray-800">{listTitle}</h3>

          {tab !== "expense" ? (
            <p className="mt-3 text-xs text-gray-400">
              เดี๋ยวค่อยเพิ่มสรุปของแท็บนี้ทีหลัง
              ตอนนี้ดึงค่าใช้จ่ายขึ้นมาก่อนนะ
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {chartLabels.map((label, i) => {
                const amount = chartAmounts[i] ?? 0;
                const percent =
                  totalAmount > 0
                    ? Math.round((amount / totalAmount) * 100)
                    : 0;

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-xl shadow border border-gray-100"
                  >
                    <span className="text-gray-600">
                      {label} — {amount.toLocaleString()} บาท
                    </span>
                    <span className="text-gray-400">{percent}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Navigation />
    </div>
  );
}
