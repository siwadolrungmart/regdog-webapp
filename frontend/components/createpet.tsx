import { createDog } from "@/lib/api";
import { useState } from "react";

interface DogData {
  userId: number;
  name: string;
  gender: "MALE" | "FEMALE" | "UNKNOWN";
  breed?: string;
  birthDate?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerAddress?: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (dog: DogData) => void;
};

export function CreateDogModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<DogData>({
    userId: 1, // TODO: ดึงจาก auth จริง
    name: "",
    gender: "UNKNOWN",
    breed: "",
    birthDate: "",
    ownerName: "",
    ownerPhone: "",
    ownerAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createDog(form as any);
      if (res.status >= 200 && res.status < 300 && res.data) {
        onCreated(res.data); // ส่ง dog กลับไปให้ list
      } else {
        setError(res.error ?? "สร้างข้อมูลไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold mb-3">เพิ่มสุนัขตัวใหม่</h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block mb-1">ชื่อสุนัข</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">เพศ</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="MALE">ผู้</option>
              <option value="FEMALE">เมีย</option>
              <option value="UNKNOWN">ไม่ทราบ</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">สายพันธุ์</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">วันเกิด</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">ชื่อเจ้าของ</label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">เบอร์โทร</label>
            <input
              name="ownerPhone"
              value={form.ownerPhone}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">ที่อยู่</label>
            <textarea
              name="ownerAddress"
              value={form.ownerAddress}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              rows={2}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border text-sm"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#FFD774] text-sm font-medium text-gray-800"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
