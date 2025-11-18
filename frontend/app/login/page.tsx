"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "@/components/google-icon";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4 py-6 sm:py-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md">
        {/* Hero Image */}
        <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-black/10 shadow-sm bg-white/60 backdrop-blur">
          <Image
            src="/dog.png"
            alt="Cute dog illustration"
            width={1200}
            height={800}
            sizes="100vw"
            className="h-52 sm:h-60 w-full object-cover"
            priority
          />
          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-black" : "bg-black/40"}`}
              ></span>
            ))}
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1 mb-5 sm:mb-6">
          <p className="font-normal text-2xl font-anuphan">
            ยินดีต้อนรับสู่ RegDog
          </p>
          <h1 className="font-medium text-4xl font-anuphan">
            เข้าสู่บัญชีของคุณ
          </h1>
        </div>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);

            const result = await loginUser({ email, password });
            setLoading(false);

            if (result.status === 200 && result.data) {
              // บันทึก userId ลง localStorage
              localStorage.setItem("userId", result.data.id);
              localStorage.setItem("userEmail", result.data.email);
              router.push("/");
            } else {
              setError(result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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
                type={show ? "text" : "password"}
                placeholder="รหัสผ่าน"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label="toggle password"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="#"
                className="text-sm text-zinc-500 hover:text-zinc-700 font-anuphan"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-anuphan">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="rounded-full w-full h-12 text-base font-medium bg-ffeca5 text-black hover:bg-[#f9dc75] font-anuphan disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>

        {/* OR */}
        <div className="my-5 sm:my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-zinc-400 text-sm">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Google Sign-in */}
        <Button
          variant="outline"
          className="rounded-full w-full h-12 text-base bg-white"
        >
          <GoogleIcon className="mr-2 h-5 w-5" />
          Google
        </Button>

        {/* Footer */}
        <p className="mt-5 sm:mt-6 text-center text-sm text-zinc-500">
          คุณยังไม่มีบัญชีใช่ไหม?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-700 hover:underline"
          >
            สร้างบัญชีใหม่
          </Link>
        </p>
      </div>
    </div>
  );
}
