"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useDogRegistration } from "@/contexts/dog-registration-context";
import { useRouter } from "next/navigation";

export default function DogNamePage() {
  const { dogData, updateDogData } = useDogRegistration();
  const [name, setName] = useState(dogData.name);
  const router = useRouter();

  const handleNext = (skip: boolean) => {
    if (!skip) {
      updateDogData({ name });
    }
    router.push("/register/dog-gender");
  };

  return (
    <div className="min-h-dvh w-full flex justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/register/dog-ownership"
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
          ชื่อสุนัขของคุณ
        </h1>

        {/* Form */}
        <div className="space-y-6">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
                <circle cx="11" cy="4" r="2" />
                <circle cx="18" cy="8" r="2" />
                <circle cx="20" cy="16" r="2" />
                <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
              </svg>
            </span>
            <Input
              type="text"
              placeholder="ชื่อ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-14 text-base"
            />
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
              disabled={!name}
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
