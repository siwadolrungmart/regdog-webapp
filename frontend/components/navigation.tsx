"use client";
import React from "react";
import { QrCode, Dog, CalendarPlus2, MapPinned, Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const Navigation = () => {
  const Router = useRouter();
  const pathname = usePathname();
  console.log("Current pathname:", pathname);
  const navigationItems = [
    { icon: QrCode, label: "คิวอาร์โค้ด", pathname: "/qrcode" },
    { icon: CalendarPlus2, label: "ปฏิทิน", pathname: "/calendar" },
    { icon: Home, label: "หน้าแรก", pathname: "/home" },
    { icon: MapPinned, label: "สถานที่", pathname: "/places" },
    { icon: Dog, label: "โปรไฟล์", pathname: "/profile" },
  ];
  return (
    <nav className="flex justify-between items-center flex-row w-fit h-[62px] bg-blue-200 rounded-full fixed self-center bottom-[20px] px-3 gap-1 z-10">
      {navigationItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            Router.push(item.pathname);
          }}
          className={`flex items-center w-[74px] h-[40px] cursor-pointer hover:bg-ffeca5 rounded-full
            ${item.pathname === pathname ? "flex-row bg-ffeca5 justify-evenly" : "flex-col justify-center"}`}
        >
          <div className="text-black ">
            <item.icon />
          </div>
          <span className="text-black font-anuphan text-[10px]">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
