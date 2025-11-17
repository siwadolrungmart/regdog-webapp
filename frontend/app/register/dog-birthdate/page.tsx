"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { useDogRegistration } from "@/contexts/dog-registration-context";
import { useRouter } from "next/navigation";

export default function DogBirthdatePage() {
  const { dogData, updateDogData } = useDogRegistration();
  const [birthdate, setBirthdate] = useState(dogData.birthDate);
  const router = useRouter();

  const handleNext = (skip: boolean) => {
    if (!skip) {
      updateDogData({ birthDate: birthdate });
    }
    router.push("/register/dog-breed");
  };

  return (
    <div className="min-h-dvh w-full flex  justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/register/dog-gender"
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
          วันเกิดสุนัขของคุณ
        </h1>

        {/* Form */}
        <div className="space-y-6">
          <div className="relative">
            <Input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="h-14 text-base pr-10"
              placeholder="MM/DD/YYYY"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Calendar size={20} />
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-start justify-end" style={{ gap: "5px" }}>
            <Button
              variant="outline"
              className="text-base font-medium border border-ffeca5 hover:bg-ffeca5"
              style={{ width: "55px", height: "40px", borderRadius: "100px" }}
              onClick={() => handleNext(true)}
            >
              ข้าม
            </Button>

            <Button
              className="text-base font-medium bg-ffeca5 text-black hover:bg-[#f9dc75] flex items-center gap-1"
              style={{ width: "82px", height: "40px", borderRadius: "100px" }}
              disabled={!birthdate}
              onClick={() => handleNext(false)}
            >
              ต่อไป
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
