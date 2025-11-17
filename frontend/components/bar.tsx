"use client";
import { Bell, Menu, User } from "lucide-react";
import React from "react";

const Bar = () => {
  return (
    <header className="flex justify-between items-center p-4 pt-10 z-20 w-full">
      <button className="p-2">
        <Menu
          className="w-6 h-6 text-gray-700"
          onClick={() => (window.location.href = "/mypet")}
        />
      </button>
      <div className="flex items-center gap-4">
        {/* <button className="p-2">
          <Bell className="w-6 h-6 text-gray-700" />
        </button> */}
        <button className="p-2">
          <User className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default Bar;
