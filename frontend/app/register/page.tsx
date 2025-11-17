"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-dvh w-full flex justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center relative mb-8 sm:mb-10">
          <Link
            href="/login"
            className="absolute left-0 inline-flex items-center text-zinc-700 hover:text-zinc-900"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-medium text-[16px] leading-[100%] tracking-[0] text-center font-anuphan">
            สร้างบัญชีใหม่
          </h1>
        </div>

        {/* Titles */}
        <div className="space-y-1 mb-6 sm:mb-8">
          <p className="font-normal text-[24px] leading-[100%] tracking-[0] align-middle font-anuphan">
            ยินดีต้อนรับสู่ RegDog
          </p>
          <h2 className="font-medium text-[32px] leading-[100%] tracking-[0] align-middle font-anuphan">
            สร้างบัญชีของคุณ
          </h2>
        </div>

        {/* Form */}
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            // ตรวจสอบรหัสผ่านตรงกันหรือไม่
            if (password !== confirmPassword) {
              setError("รหัสผ่านไม่ตรงกัน");
              return;
            }

            // ตรวจสอบความยาวรหัสผ่าน
            if (password.length < 6) {
              setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
              return;
            }

            setLoading(true);
            const result = await registerUser({ email, password });
            setLoading(false);

            if (result.status === 201 && result.data) {
              // บันทึก userId
              localStorage.setItem("userId", result.data.id);
              localStorage.setItem("userEmail", result.data.email);
              router.push("/register/dog-ownership");
            } else {
              setError(
                result.error || result.data?.message || "เกิดข้อผิดพลาด",
              );
            }
          }}
        >
          <div className="space-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={18} />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="อีเมล"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="รหัสผ่าน"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </span>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-anuphan">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="rounded-full w-full h-12 text-base font-medium bg-ffeca5 text-black hover:bg-[#f9dc75] mt-6 disabled:opacity-50"
          >
            {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          คุณมีบัญชีอยู่แล้วใช่ไหม?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-700 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
