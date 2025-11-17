"use client";

import { useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { ArrowDownToLine, Link, Share } from "lucide-react";
import Navigation from "@/components/navigation";
import Bar from "@/components/bar";

export default function QRPage() {
  const qrRef = useRef<HTMLDivElement>(null);

  // 👉 เก็บ URL ที่จะ encode ใน QR
  const [qrValue, setQrValue] = useState<string>("");

  useEffect(() => {
    // รันเฉพาะฝั่ง client อยู่แล้วเพราะ "use client"
    const petIdStr = localStorage.getItem("petId");
    if (!petIdStr) {
      // ไม่มี petId ก็ไม่ต้องทำอะไร หรือจะ set เป็นหน้า default ก็ได้
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // ปรับ path ได้ตาม route จริงของโปรเจ็กต์
    const url = `${origin}/profile/status/${petIdStr}`;
    setQrValue(url);
  }, []);

  const copyLink = async () => {
    if (!qrValue) return;
    await navigator.clipboard.writeText(qrValue);
    alert("คัดลอกลิงก์แล้ว");
  };

  const downloadQR = async () => {
    if (!qrRef.current) return;

    const dataUrl = await htmlToImage.toPng(qrRef.current);
    const link = document.createElement("a");
    link.download = "pet-qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  const shareLink = async () => {
    if (!qrValue) return;
    if (navigator.share) {
      try {
        await navigator.share({ url: qrValue });
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("เบราว์เซอร์นี้ยังไม่รองรับการแชร์ด้วย Web Share API");
    }
  };

  return (
    <div className="mobile flex flex-col items-center">
      <header className="relative flex justify-between items-center px-4 z-20 w-full">
        <Bar />
      </header>

      <h1 className="text-xl font-bold mb-2">คิวอาร์โค้ดติดตามสุนัข</h1>

      {/* QR Code */}
      <div
        ref={qrRef}
        className="bg-white p-6 rounded-3xl mb-4 shadow-sm flex justify-center"
      >
        {qrValue ? (
          <QRCode value={qrValue} size={260} />
        ) : (
          <span className="text-sm text-gray-400">
            กำลังสร้างคิวอาร์โค้ด...
          </span>
        )}
      </div>

      <p className="text-center text-gray-500 mb-6 text-sm">
        ใช้คิวอาร์โค้ดหรือลิงก์เพื่อให้ผู้ใช้สแกนดูข้อมูลสุนัข
      </p>

      {/* Actions */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={copyLink}
          disabled={!qrValue}
          className="flex flex-col items-center text-sm disabled:opacity-50"
        >
          <Link />
          คัดลอกลิงก์
        </button>
        <button
          onClick={shareLink}
          disabled={!qrValue}
          className="flex flex-col items-center text-sm disabled:opacity-50"
        >
          <Share />
          แชร์
        </button>
        <button
          onClick={downloadQR}
          disabled={!qrValue}
          className="flex flex-col items-center text-sm disabled:opacity-50"
        >
          <ArrowDownToLine />
          บันทึก
        </button>
      </div>

      {/* Edit QR Button */}
      <button className="px-10 py-2 rounded-full border border-yellow-400 text-gray-800 hover:bg-yellow-100 transition">
        แก้ไขคิวอาร์โค้ด
      </button>

      <Navigation />
    </div>
  );
}
