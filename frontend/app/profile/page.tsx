"use client";

import Bar from "@/components/bar";
import Navigation from "@/components/navigation";
import { getDogById, updateDog } from "@/lib/api";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface DogData {
  userId?: number;
  name?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  breed?: string;
  birthDate?: string | null; // ใช้ string จาก API เช่น "2025-11-14"
  microchipNumber?: string;
  pedigreeFileUrl?: string;
  chronicDiseases?: string;
  avatarUrl?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  extraDescription?: string;
  lostStatus?: "UNKNOWN" | "NORMAL" | "LOST" | "FOUND";
}

export default function PetProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลสุนัขจาก API ตาม petId ใน localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petIdStr = localStorage.getItem("petId");
        const petId = petIdStr ? Number(petIdStr) : 0;
        if (!petId) {
          setError("ไม่พบรหัสสุนัข (petId) ในระบบ");
          setLoading(false);
          return;
        }

        const response = await getDogById(petId);

        if (response.data) {
          const dog = response.data;

          setData({
            userId: dog.userId,
            name: dog.name,
            gender: dog.gender,
            breed: dog.breed ?? "",
            // ถ้า backend ส่ง ISO string มาอยู่แล้ว ก็เก็บเป็น string ตรง ๆ
            birthDate: dog.birthDate ?? null,
            microchipNumber: dog.microchipNumber ?? "",
            pedigreeFileUrl: dog.pedigreeFileUrl ?? "",
            chronicDiseases: dog.chronicDiseases ?? "",
            avatarUrl: dog.avatarUrl ?? "",
            ownerName: dog.ownerName ?? "",
            ownerPhone: dog.ownerPhone ?? "",
            ownerAddress: dog.ownerAddress ?? "",
            extraDescription: dog.extraDescription ?? "",
            lostStatus: ["UNKNOWN", "NORMAL", "LOST", "FOUND"].includes(
              dog.lostStatus as any,
            )
              ? (dog.lostStatus as DogData["lostStatus"])
              : "NORMAL",
          });
        } else {
          setError("ไม่พบข้อมูลสุนัข");
        }
      } catch (err) {
        console.error("Error fetching dog data:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setData((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev,
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    // ถ้าจะ reset จริง ๆ ให้ refetch อีกครั้ง หรือเก็บ snapshot ก่อนแก้ไว้ต่างหาก
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data) {
      const petIdStr = localStorage.getItem("petId");
      const petId = petIdStr ? Number(petIdStr) : 0;
      if (petId) {
        // เตรียม body: ตัดค่าที่เป็น "" ให้เป็น undefined (ไม่อัปเดต)
        const body: DogData = {
          name: data.name || undefined,
          gender: data.gender,
          breed: data.breed || undefined,
          birthDate: data.birthDate || undefined,
          microchipNumber: data.microchipNumber || undefined,
          pedigreeFileUrl: data.pedigreeFileUrl || undefined,
          chronicDiseases: data.chronicDiseases || undefined,
          ownerName: data.ownerName || undefined,
          ownerPhone: data.ownerPhone || undefined,
          ownerAddress: data.ownerAddress || undefined,
          extraDescription: data.extraDescription || undefined,
          lostStatus: data.lostStatus,
        };

        try {
          await updateDog(petId, body);
          // ถ้า backend คืน dog ใหม่กลับมา จะเอามา setData อีกทีก็ได้
        } catch (err) {
          console.error("Error updating dog:", err);
        }
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="mobile w-full flex flex-col items-center">

      <header className="flex justify-between items-center px-4 z-20 w-full">
        <Bar />
      </header>

      <div className="flex flex-col items-center w-full rounded-[15px] px-2.5 py-4">
        {/* avatar */}
        <div className="relative w-fit">
          <div className="w-28 h-28 bg-gray-50 rounded-full border-2 border-73a2ac"></div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-1 h-8 w-8 rounded-full bg-white border-2 border-73a2ac flex items-center justify-center hover:bg-[#ffe7a3] transition-colors"
          >
            <Pencil className="h-4 w-4 text-73a2ac" />
          </button>
        </div>

        {/* content */}
        <div className="w-full">
          <h1 className="text-center text-2xl font-semibold text-73a2ac">
            {data?.name ?? "กำลังโหลด..."}
          </h1>

          <div className="mt-6 rounded-2xl border border-[#cde4f2] px-4 py-4 min-h-[120px]">
            {loading && (
              <p className="text-center text-sm text-gray-500">
                กำลังโหลดข้อมูล...
              </p>
            )}

            {error && !loading && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            {!loading && !error && data && (
              <>
                {!isEditing ? (
                  <ProfileView data={data} />
                ) : (
                  <ProfileForm
                    data={data}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}

/* ---------- View mode ---------- */

function ProfileView({ data }: { data: DogData }) {
  const row = (label: string, value: string) => (
    <div className="flex gap-2.5 text-sm text-slate-700 border-b border-[#D9D9D9] font-anuphan text-[16px]">
      <span className="text-73a2ac">{label} :</span>
      <span className="text-black">{value || "-"}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-[15px]">
      <p className="text-center text-[16px] text-black font-anuphan">
        ข้อมูลส่วนตัวสุนัข
      </p>
      {row("ชื่อ", data.name ?? "")}
      {row(
        "เพศ",
        data.gender === "MALE"
          ? "เพศผู้"
          : data.gender === "FEMALE"
            ? "เพศเมีย"
            : "ไม่ระบุ",
      )}
      {row("สายพันธุ์", data.breed ?? "")}
      {row("วันเกิด", formatDateThai(data.birthDate))}
      {row("อายุ", calculateAge(data.birthDate))}
      {row("เลขไมโครชิพ", data.microchipNumber ?? "")}
      {row("ใบเพ็ดดีกรี", data.pedigreeFileUrl ?? "")}
      {row("โรคประจำตัว", data.chronicDiseases ?? "")}
    </div>
  );
}

/* ---------- Edit mode ---------- */

type ProfileFormProps = {
  data: DogData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

function ProfileForm({ data, onChange, onCancel, onSubmit }: ProfileFormProps) {
  const fieldClass =
    "w-full rounded-xl border border-[#cde4f2] bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ffd56a]";

  return (
    <form className="flex flex-col gap-2.5 text-sm" onSubmit={onSubmit}>
      <p className="text-center text-[16px] text-black font-anuphan">
        ข้อมูลส่วนตัวสุนัข
      </p>

      <FormRow label="ชื่อ">
        <input
          className={fieldClass}
          name="name"
          value={data.name ?? ""}
          onChange={onChange}
        />
      </FormRow>

      <FormRow label="เพศ (MALE/FEMALE/UNKNOWN)">
        <input
          className={fieldClass}
          name="gender"
          value={data.gender ?? ""}
          onChange={onChange}
        />
      </FormRow>

      <FormRow label="สายพันธุ์">
        <input
          className={fieldClass}
          name="breed"
          value={data.breed ?? ""}
          onChange={onChange}
        />
      </FormRow>

      <FormRow label="วันเกิด">
        <input
          type="date"
          className={fieldClass}
          name="birthDate"
          value={data.birthDate ?? ""}
          onChange={onChange}
        />
      </FormRow>

      <FormRow label="เลขไมโครชิพ">
        <input
          className={fieldClass}
          name="microchipNumber"
          value={data.microchipNumber ?? ""}
          onChange={onChange}
        />
      </FormRow>

      <FormRow label="ใบเพ็ดดีกรี (URL)">
        <input
          className={fieldClass}
          name="pedigreeFileUrl"
          value={data.pedigreeFileUrl ?? ""}
          onChange={onChange}
          placeholder="วางลิงก์ไฟล์ หรือเว้นว่าง"
        />
      </FormRow>

      <FormRow label="โรคประจำตัว">
        <textarea
          className={fieldClass}
          name="chronicDiseases"
          value={data.chronicDiseases ?? ""}
          onChange={onChange}
          rows={2}
        />
      </FormRow>

      <div className="mt-2 flex justify-end gap-3 font-anuphan">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[#ffd56a] px-5 py-2 text-sm text-slate-700 bg-white hover:bg-[#fff5d7] transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#ffd56a] px-6 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-[#ffce4a] transition-colors"
        >
          บันทึก ✓
        </button>
      </div>
    </form>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center gap-1">
      <span className="font-anuphan text-[16px] text-nowrap text-[#23a0a0]">
        {label}:
      </span>
      {children}
    </div>
  );
}

/* ---------- utils ---------- */

function formatDateThai(date: string | Date | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function calculateAge(birthDate: string | Date | null | undefined): string {
  if (!birthDate) return "";
  const d = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  if (isNaN(d.getTime())) return "";

  const today = new Date();

  let years = today.getFullYear() - d.getFullYear();
  let months = today.getMonth() - d.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < d.getDate())) {
    years--;
    months += 12;
  }

  return `${years} ปี ${months} เดือน`;
}
