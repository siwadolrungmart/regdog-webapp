"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Menu, Bell, User, BarChart3, PlaySquare, Upload } from "lucide-react";
import Navigation from "../../components/navigation";
import { getDogById, getEvent } from "@/lib/api";
import Bar from "@/components/bar";

// ---------- Types ----------
type Dog = {
  id: number;
  name: string;
  avatarUrl?: string | null;
};

type DogEvent = {
  id: number;
  eventAt: string;
  eventType: { code: string; nameTh: string; category: string };
  walkEvent?: { distanceKm: number | null; durationMin: number | null } | null;
  playEvent?: { durationMin: number | null } | null;
  trainingEvent?: { durationMin: number | null } | null;
  symptomEvent?: { symptom: string } | null;
  vaccineEvent?: {} | null;
  medicationEvent?: {
    dosageAmount: number | null;
    dosageUnit: string | null;
  } | null;
  vetVisitEvent?: { reason: string | null } | null;
  weightEvent?: { weightKg: number } | null;
  expenseEvent?: { amount: number; currency: string | null } | null;
};

type WeeklyActivity = {
  id: number;
  title: string;
  time: string;
  eventAt: string;
};

type WeeklyExpense = {
  id: number;
  title: string;
  amount: number;
  dateLabel: string;
  eventAt: string;
};
function handleFeature(label: string) {
  switch (label) {
    case "สรุป":
      window.location.href = "/results";
      break;
    case "ออกกำลังกาย":
      window.location.href = "/exercise";
      break;
    default:
      alert("Feature coming soon!");
  }
}
// ---------- UI small components ----------

const FeatureCard = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div
    className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-white rounded-[22px] shadow-md border border-gray-100"
    onClick={() => handleFeature(label)}
  >
    <div className="w-14 h-14 rounded-full border-[2px] border-[#5C8A8A] flex items-center justify-center">
      <Icon className="w-6 h-6 text-[#5C8A8A]" />
    </div>
    <span className="text-xs font-medium text-gray-600">{label}</span>
  </div>
);

const ActivityCard = ({ title, time }: { title: string; time: string }) => (
  <div className="w-full px-3 py-2 bg-[#E9F6FF] rounded-xl border border-[#B6E2FF] flex justify-between items-center">
    <span className="text-[11px] text-slate-600 font-normal tracking-tight truncate">
      {title}
    </span>
    <span className="text-[11px] text-slate-600 font-normal tracking-tight">
      {time}
    </span>
  </div>
);

// กราฟแท่งใช้ style กำหนดความสูง + สีพาสเทล
const BarChartPlaceholder = ({
  days,
  barHeights,
  colors,
  labels,
}: {
  days: string[];
  barHeights: number[];
  colors: string[];
  labels: string[];
}) => {
  return (
    <div className="h-44 w-full flex flex-col justify-between relative">
      {/* เส้นกริดด้านหลัง (แบบจุด ๆ) */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between py-5">
        <div className="h-px border-t border-dashed border-[#E5D9FF]" />
        <div className="h-px border-t border-dashed border-[#E5D9FF]" />
        <div className="h-px border-t border-dashed border-[#E5D9FF]" />
        <div className="h-px border-t border-dashed border-[#E5D9FF]" />
      </div>

      <div className="flex justify-around items-end h-full px-3 relative z-10">
        {days.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-1 w-10">
            {/* label จำนวนด้านบน */}
            <span className="text-[10px] text-[#F587B6] font-medium">
              {labels[index]}
            </span>
            {/* แท่งกราฟ */}
            <div
              className={`${colors[index]} w-6 rounded-[10px] shadow-sm`}
              style={{ height: `${barHeights[index]}px` }}
            />
            {/* label วันด้านล่าง */}
            <span className="mt-1 text-[11px] text-[#F5A8C5] font-medium">
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ใช้ข้อมูลจริงมาสร้างกราฟค่าใช้จ่าย
const WeeklyExpenseChart = ({ expenses }: { expenses: WeeklyExpense[] }) => {
  const days = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];

  const amountsPerDay = Array(7).fill(0);
  expenses.forEach((exp) => {
    const d = new Date(exp.eventAt);
    const dayIndex = d.getDay(); // 0 = อาทิตย์
    amountsPerDay[dayIndex] += exp.amount;
  });

  const maxAmount = Math.max(...amountsPerDay, 1);

  // scale ความสูง 0–110px
  const barHeights = amountsPerDay.map((amount) => {
    if (amount === 0) return 4; // แท่งเล็ก ๆ
    const maxHeightPx = 110;
    const minHeightPx = 20;
    const ratio = amount / maxAmount;
    return Math.round(minHeightPx + ratio * (maxHeightPx - minHeightPx));
  });

  const formatK = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + " k";
    if (num === 0) return "";
    return num.toString();
  };

  const labels = amountsPerDay.map(formatK);

  const colors = [
    "bg-[#FF8B8B]",
    "bg-[#FFD47A]",
    "bg-[#FFB4F0]",
    "bg-[#C5F59C]",
    "bg-[#FFB37A]",
    "bg-[#A6D3FF]",
    "bg-[#D8B7FF]",
  ];

  return (
    <BarChartPlaceholder
      days={days}
      barHeights={barHeights}
      colors={colors}
      labels={labels}
    />
  );
};

// ---------- Main Page ----------
export default function HomePage() {
  const [dog, setDog] = useState<Dog | null>(null);
  const [loadingDog, setLoadingDog] = useState(true);

  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivity[]>(
    [],
  );
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [weeklyExpenses, setWeeklyExpenses] = useState<WeeklyExpense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const dailyActivities = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // หาวันอาทิตย์ของสัปดาห์นี้
    const sunday = new Date(today);
    sunday.setDate(sunday.getDate() - sunday.getDay()); // 0 = Sunday

    // สร้าง 7 วัน (อาทิตย์ → เสาร์)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);

      const key = d.toISOString();

      const itemsForDay = weeklyActivities.filter((act) => {
        const ad = new Date(act.eventAt);
        ad.setHours(0, 0, 0, 0);
        return ad.getTime() === d.getTime();
      });

      const label = d.toLocaleDateString("th-TH", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      return { dateKey: key, label, items: itemsForDay };
    });
  }, [weeklyActivities]);
  useEffect(() => {
    if (dailyActivities.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const index = dailyActivities.findIndex((d) => {
      const target = new Date(d.dateKey);
      return target.getTime() === today.getTime();
    });

    if (index >= 0) {
      setActiveDayIndex(index);
    }
  }, [dailyActivities]);

  const safeIndex = Math.min(activeDayIndex, dailyActivities.length - 1);
  const currentDay = dailyActivities[safeIndex];
  // helper time → "HH:mm น."
  const formatTimeThai = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return (
      d.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " น."
    );
  };

  const mapEventToActivity = (e: DogEvent): WeeklyActivity => {
    const time = formatTimeThai(e.eventAt);
    const code = e.eventType?.code;

    switch (code) {
      case "WALK":
        return {
          id: e.id,
          title: `เดิน ${e.walkEvent?.distanceKm ?? ""} กม.`,
          time,
          eventAt: e.eventAt,
        };
      case "PLAY":
        return { id: e.id, title: "เวลาเล่น", time, eventAt: e.eventAt };
      case "TRAINING":
        return { id: e.id, title: "ฝึก", time, eventAt: e.eventAt };
      case "SYMPTOM":
        return {
          id: e.id,
          title: e.symptomEvent?.symptom || "อาการ",
          time,
          eventAt: e.eventAt,
        };
      case "VACCINE":
        return { id: e.id, title: "วัคซีน", time, eventAt: e.eventAt };
      case "MEDICATION":
        return { id: e.id, title: "ให้ยา", time, eventAt: e.eventAt };
      case "VET_VISIT":
        return {
          id: e.id,
          title: e.vetVisitEvent?.reason || "พบสัตว์แพทย์",
          time,
          eventAt: e.eventAt,
        };
      case "WEIGHT":
        return {
          id: e.id,
          title: `ชั่งน้ำหนัก ${e.weightEvent?.weightKg ?? ""} กก.`,
          time,
          eventAt: e.eventAt,
        };
      case "EXPENSE":
        return {
          id: e.id,
          title: `ค่าใช้จ่าย ${e.expenseEvent?.amount ?? ""} ${
            e.expenseEvent?.currency || ""
          }`,
          time,
          eventAt: e.eventAt,
        };
      default:
        return {
          id: e.id,
          title: e.eventType?.nameTh || "กิจกรรม",
          time,
          eventAt: e.eventAt,
        };
    }
  };

  const fetchWeeklyEvents = async (dogId: number) => {
    try {
      setLoadingEvents(true);

      const now = new Date();
      // today 00:00
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // หา "วันอาทิตย์" ของสัปดาห์นี้
      const since = new Date(today);
      since.setDate(today.getDate() - today.getDay()); // 0 = อาทิตย์

      // until = เสาร์ ของสัปดาห์นี้ (สุดวัน)
      const until = new Date(since);
      until.setDate(since.getDate() + 7); // ไปอาทิตย์ถัดไป
      until.setMilliseconds(-1); // 23:59:59.999 ของเสาร์

      const res = await getEvent({
        dogId,
        since: since.toISOString(),
        until: until.toISOString(),
      });

      if (res.data?.items) {
        const events: DogEvent[] = res.data.items;
        const activities = events
          .sort(
            (a, b) =>
              new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime(),
          )
          .map(mapEventToActivity);

        setWeeklyActivities(activities);
      } else {
        setWeeklyActivities([]);
      }
    } catch (err) {
      console.error("getEvent error:", err);
      setWeeklyActivities([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchWeeklyExpenses = async (dogId: number) => {
    try {
      setLoadingExpenses(true);

      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const since = new Date(today);
      since.setDate(today.getDate() - today.getDay()); // อาทิตย์

      const until = new Date(since);
      until.setDate(since.getDate() + 7);
      until.setMilliseconds(-1);

      const res = await getEvent({
        dogId,
        since: since.toISOString(),
        until: until.toISOString(),
      });

      if (res.data?.items) {
        const events: DogEvent[] = res.data.items;

        const expenseEvents = events.filter(
          (e) => e.eventType?.category === "EXPENSE" && e.expenseEvent,
        );

        const expenses: WeeklyExpense[] = expenseEvents.map((e) => {
          const d = new Date(e.eventAt);
          const dateLabel = d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
          });

          return {
            id: e.id,
            title: e.eventType?.nameTh || "ค่าใช้จ่าย",
            amount: e.expenseEvent?.amount ?? 0,
            dateLabel,
            eventAt: e.eventAt,
          };
        });

        setWeeklyExpenses(expenses);
      } else {
        setWeeklyExpenses([]);
      }
    } catch (err) {
      console.error("fetchWeeklyExpenses error:", err);
      setWeeklyExpenses([]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  // โหลดข้อมูลสุนัข + event
  useEffect(() => {
    const fetchDog = async () => {
      try {
        const petIdStr = localStorage.getItem("petId");
        const petId = petIdStr ? Number(petIdStr) : 0;
        if (!petId) {
          setLoadingDog(false);
          return;
        }
        const res = await getDogById(petId);
        if (res.data) setDog(res.data);

        await fetchWeeklyEvents(petId);
        await fetchWeeklyExpenses(petId);
      } catch (e) {
        console.error("Error loading dog:", e);
      } finally {
        setLoadingDog(false);
      }
    };

    fetchDog();
  }, []);

  // เลือก date label ให้ header กิจกรรม (ใช้วันที่ event แรก)
  const firstActivityDateLabel =
    weeklyActivities.length > 0
      ? new Date(
          (weeklyExpenses[0]?.eventAt ?? weeklyActivities[0]?.time) &&
            weeklyExpenses[0]?.eventAt,
        ).toLocaleDateString("th-TH", {
          weekday: "long",
          day: "numeric",
          month: "short",
        })
      : "";

  return (
    <div className="mobile">
      {/* Top Nav */}
      <header className="relative flex justify-between items-center px-4 z-20">
        <Bar />
      </header>

      {/* Main content */}
      <main className="relative flex-1 overflow-y-auto px-4 pt-2 pb-24 space-y-6 z-10">
        {/* โปรไฟล์สุนัข */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg overflow-hidden border-4 border-white">
            {dog?.avatarUrl ? (
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
          {loadingDog ? (
            <div className="text-sm text-slate-400">
              กำลังโหลดข้อมูลสุนัข...
            </div>
          ) : (
            <div className="text-2xl font-semibold text-[#4A8A8A]">
              {dog?.name || "Snow white"}
            </div>
          )}
        </div>

        {/* ค่าใช้จ่ายประจำสัปดาห์ */}
        <section>
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-sm font-semibold text-slate-800">
              ค่าใช้จ่ายประจำสัปดาห์
            </span>
            <button className="text-[11px] text-sky-500 font-medium">
              ดูทั้งหมด &gt;
            </button>
          </div>

          <div className="p-4 bg-white rounded-[26px] border-[3px] border-[#E5D9FF] shadow-sm min-h-[214px] flex items-center justify-center">
            {loadingExpenses ? (
              <div className=" text-gray-400 text-xs">
                กำลังโหลดค่าใช้จ่าย...
              </div>
            ) : weeklyExpenses.length === 0 ? (
              <div className=" text-gray-400 text-xs">
                ยังไม่มีค่าใช้จ่ายในสัปดาห์นี้
              </div>
            ) : (
              <WeeklyExpenseChart expenses={weeklyExpenses} />
            )}
          </div>
        </section>

        {/* ฟีเจอร์ */}
        <section>
          <span className="text-sm font-semibold text-slate-800">ฟีเจอร์</span>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <FeatureCard icon={BarChart3} label="สรุป" />
            <FeatureCard icon={PlaySquare} label="ออกกำลังกาย" />
            <FeatureCard icon={Upload} label="ส่งออก" />
          </div>
        </section>

        {/* กิจกรรมประจำสัปดาห์ */}
        <section>
          <span className="text-sm font-semibold text-slate-800">
            กิจกรรมประจำสัปดาห์
          </span>

          <div className="mt-2 p-3 bg-white rounded-[26px] border-[3px] border-[#E5D9FF] shadow-sm min-h-[266px]">
            {/* header ของการ์ดกิจกรรม */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-slate-700">
                {`วัน${currentDay?.label ?? ""}`}
              </span>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                {/* ปุ่มย้อนวันก่อนหน้า */}
                <button
                  disabled={safeIndex === 0}
                  onClick={() => setActiveDayIndex((i) => Math.max(i - 1, 0))}
                  className={`px-1 ${safeIndex === 0 ? "opacity-30" : "hover:text-slate-600"}`}
                >
                  &lt;
                </button>

                <button
                  disabled={safeIndex === dailyActivities.length - 1}
                  onClick={() =>
                    setActiveDayIndex((i) =>
                      Math.min(i + 1, dailyActivities.length - 1),
                    )
                  }
                  className={`px-1 ${
                    safeIndex === dailyActivities.length - 1
                      ? "opacity-30"
                      : "hover:text-slate-600"
                  }`}
                >
                  &gt;
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {loadingEvents ? (
                <div className="w-full h-20 flex items-center justify-center text-gray-400 text-xs">
                  กำลังโหลดกิจกรรม...
                </div>
              ) : currentDay.items.length > 0 ? (
                currentDay.items.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    title={activity.title}
                    time={activity.time}
                  />
                ))
              ) : (
                <div className="w-full h-20 flex items-center justify-center text-gray-400 text-xs">
                  ไม่มีกิจกรรมสำหรับวันนี้
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <footer className="fixed bottom-6 left-0 right-0 w-full max-w-md mx-auto z-30 flex justify-center">
        <Navigation />
      </footer>
    </div>
  );
}
