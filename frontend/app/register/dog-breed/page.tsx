"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useDogRegistration } from "@/contexts/dog-registration-context";
import { createDog } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DogBreedPage() {
  const { dogData, updateDogData } = useDogRegistration();
  const [breed, setBreed] = useState(dogData.breed);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const breeds = [
    "โกลเด้น รีทรีฟเวอร์",
    "ชิสุ",
    "ปอมเมอเรเนียน",
    "พุดเดิ้ล",
    "ฮัสกี้",
    "บีเกิ้ล",
    "เช็พเพิร์ด",
    "อื่นๆ",
  ];

  const handleSubmit = async (skip: boolean) => {
    if (!skip) {
      updateDogData({ breed });
    }

    // ถ้าไม่มีข้อมูล hasDog หรือเลือกไม่มีสุนัข ให้ข้ามไปหน้าหลัก
    if (!dogData.hasDog) {
      router.push("/");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }

    setLoading(true);

    const dogPayload = {
      userId: parseInt(userId),
      name: dogData.name || "ไม่ระบุ",
      gender: dogData.gender || ("UNKNOWN" as "MALE" | "FEMALE" | "UNKNOWN"),
      breed: skip ? undefined : breed || undefined,
      birthDate: dogData.birthDate || undefined,
    };

    const result = await createDog(dogPayload as any);
    setLoading(false);

    if (result.status === 201) {
      router.push("/");
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="min-h-dvh w-full flex justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/register/dog-birthdate"
            className="inline-flex items-center text-zinc-700 hover:text-zinc-900"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>

        {/* Dog Illustration */}
        <div className="flex justify-center mb-8">
          <img src="/dogicon.png" alt="" className="w-32 sm:w-36 h-auto" />
        </div>

        {/* Title */}
        <h1 className="font-normal text-2xl font-anuphan tracking-tight text-center mb-8">
          สายพันธุ์สุนัขของคุณ
        </h1>

        {/* Form */}
        <div className="space-y-6">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-14 px-4 flex items-center justify-center bg-bce7f0 hover:bg-[#8ddbeb] rounded-full border border-73a2ac relative"
            >
              <div className="flex items-center gap-2 text-zinc-600">
                <span className="text-73a2ac">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11.25 16.25h1.5L12 17z" />
                    <path d="M16 14v.5" />
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
                    <path d="M8 14v.5" />
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                  </svg>
                </span>
                <span className={breed ? "text-black" : "text-73a2ac"}>
                  {breed || "สายพันธุ์"}
                </span>
              </div>
              <ChevronDown
                size={20}
                className={`text-73a2ac transition-transform absolute right-4 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg border-2 border-zinc-200 shadow-lg max-h-60 overflow-y-auto z-10">
                {breeds.map((breedOption) => (
                  <button
                    key={breedOption}
                    onClick={() => {
                      setBreed(breedOption);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0"
                  >
                    {breedOption}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-start justify-end" style={{ gap: "5px" }}>
            <Button
              variant="outline"
              className="text-base font-medium border border-ffeca5 hover:bg-ffeca5"
              style={{ width: "55px", height: "40px", borderRadius: "100px" }}
              onClick={async () => {
                await handleSubmit(true);
              }}
              disabled={loading}
            >
              ข้าม
            </Button>

            <Button
              className="text-base font-medium bg-ffeca5 text-black hover:bg-[#f9dc75] flex items-center gap-1"
              style={{ width: "82px", height: "40px", borderRadius: "100px" }}
              disabled={!breed || loading}
              onClick={async () => {
                await handleSubmit(false);
              }}
            >
              {loading ? "..." : "ต่อไป"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
