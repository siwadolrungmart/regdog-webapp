"use client";

import React, { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import Bar from "@/components/bar";
import { getUserById, updateUser } from "@/lib/api"; // 👈 API จริง

// ----------------------
// Reusable Components
// ----------------------

interface ProfileInfoRowProps {
  label: string;
  value: string;
}

const ProfileInfoRow = ({ label, value }: ProfileInfoRowProps) => (
  <div className="py-3">
    <div className="flex justify-between items-start">
      <span className="text-slate-500">{label}:</span>
      <span className="text-black text-right ml-2">{value}</span>
    </div>
    <hr className="mt-3 border-slate-200" />
  </div>
);

interface ProfileInputRowProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInputRow = ({
  label,
  name,
  value,
  onChange,
}: ProfileInputRowProps) => (
  <div className="py-2">
    <label className="text-slate-500 text-sm font-medium mb-1 block">
      {label}:
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-700"
    />
  </div>
);

// ----------------------
// Main Component
// ----------------------

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [originalData, setOriginalData] = useState(profileData);

  // -----------------------------
  // 1) FETCH FROM localStorage + API
  // -----------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userIdStr = localStorage.getItem("userId");
        if (!userIdStr) {
          console.warn("No userId found in localStorage");
          setLoading(false);
          return;
        }

        const userId = Number(userIdStr);

        const res = await getUserById(userId);

        if (res?.data) {
          const u = res.data;

          const mapped = {
            name: u.name ?? "",
            phone: u.phone ?? "",
            address: u.address ?? "",
            bio: u.bio ?? "",
          };

          setProfileData(mapped);
          setOriginalData(mapped);
        }
      } catch (err) {
        console.error("Load user error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // -----------------------------
  // Change handlers
  // -----------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setOriginalData(profileData);
    setIsEditing(true);
  };

  // -----------------------------
  // SAVE → Update API
  // -----------------------------
  const handleSaveClick = async () => {
    try {
      const userIdStr = localStorage.getItem("userId");
      if (!userIdStr) {
        alert("ไม่พบ userId ใน localStorage");
        return;
      }

      const userId = Number(userIdStr);

      const body = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
      };

      await updateUser(userId, body);

      setOriginalData(profileData);
      setIsEditing(false);
    } catch (err) {
      console.error("Save user error:", err);
      alert("บันทึกไม่สำเร็จ");
    }
  };

  const handleCancelClick = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  // -----------------------------
  // UI
  // -----------------------------

  if (loading)
    return (
      <div className="mobile flex items-center justify-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );

  return (
    <div className="mobile pb-20">
      {/* Top Nav */}
      <header className="relative flex justify-between items-center px-4 z-20">
        <Bar />
      </header>

      {/* Profile Header */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <img
          src="https://placehold.co/120x120/EBF8FF/3182CE?text=User"
          alt="User"
          className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
        />
        <h1 className="text-3xl font-semibold text-slate-700 mt-4">
          {profileData.name}
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-4">
        <h2 className="text-lg font-semibold text-black mb-2">ข้อมูลส่วนตัว</h2>

        {isEditing ? (
          <>
            <ProfileInputRow
              label="ชื่อ"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
            />
            <ProfileInputRow
              label="เบอร์โทรติดต่อ"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
            />
            <ProfileInputRow
              label="ที่อยู่"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
            />
          </>
        ) : (
          <>
            <ProfileInfoRow label="ชื่อ" value={profileData.name} />
            <ProfileInfoRow label="เบอร์โทร" value={profileData.phone} />
            <ProfileInfoRow label="ที่อยู่" value={profileData.address} />
          </>
        )}

        {/* Bio */}
        <div className="mt-4">
          <label className="text-slate-500 mb-1 block">เกี่ยวกับฉัน (Bio):</label>
          <textarea
            name="bio"
            className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm"
            value={profileData.bio}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="เพิ่มคำอธิบาย..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-5">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelClick}
                className="px-5 py-2 bg-slate-200 rounded-full"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveClick}
                className="px-5 py-2 bg-green-500 text-white rounded-full"
              >
                บันทึก
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="px-5 py-2 bg-sky-500 text-white rounded-full"
            >
              แก้ไขโปรไฟล์
            </button>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}