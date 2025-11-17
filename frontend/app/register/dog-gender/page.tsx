"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useDogRegistration } from "@/contexts/dog-registration-context";

export default function DogGenderPage() {
  const { updateDogData } = useDogRegistration();
  const router = useRouter();

  const handleGenderSelect = (gender: "MALE" | "FEMALE") => {
    updateDogData({ gender });
    router.push("/register/dog-birthdate");
  };

  return (
    <div className="min-h-dvh w-full flex justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/register/dog-name"
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
          เพศสุนัขของคุณ
        </h1>

        {/* Gender Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGenderSelect("MALE")}
            className="rounded-full h-14 border border-73a2ac font-medium text-base transition-colors bg-white text-73a2ac hover:bg-zinc-50"
          >
            เพศผู้
          </button>

          <button
            onClick={() => handleGenderSelect("FEMALE")}
            className="rounded-full h-14 border border-73a2ac font-medium text-base transition-colors bg-bce7f0 text-black hover:bg-[#8ddbeb]"
          >
            เพศเมีย
          </button>
        </div>
      </div>
    </div>
  );
}
