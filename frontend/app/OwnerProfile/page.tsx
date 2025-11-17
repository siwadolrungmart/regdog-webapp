"use client"; // <-- เพิ่มบรรทัดนี้ที่ด้านบนสุด

import React, { useState } from 'react'; // Import useState
import Navigation from '@/components/navigation';
// --- Icon Components (using inline SVG) ---
// We use inline SVGs so this file is self-contained.
// These are based on the 'lucide-react' icon library.

const Menu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const Bell = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const QrCode = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16h.01" />
    <path d="M16 12h.01" />
    <path d="M21 12h.01" />
  </svg>
);

const CalendarDays = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const Home = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MapPin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CircleUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );

// --- Define Props Interface for ProfileInfoRow ---
interface ProfileInfoRowProps {
  label: string;
  value: string;
}

// --- Reusable Profile Info Row Component ---
const ProfileInfoRow = ({ label, value }: ProfileInfoRowProps) => (
  <div className="py-3">
    <div className="flex justify-between items-start">
      <span className="text-slate-500">{label}:</span>
      <span className="text-black text-right ml-2">{value}</span>
    </div>
    <hr className="mt-3 border-slate-200" />
  </div>
);

// --- NEW: Reusable Profile Input Row Component ---
interface ProfileInputRowProps {
  label: string;
  name: string; // 'name' attribute for the input
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileInputRow = ({ label, name, value, onChange }: ProfileInputRowProps) => (
  <div className="py-2">
    <label className="text-slate-500 text-sm font-medium mb-1 block">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-700"
    />
  </div>
);


// --- Main App Component ---
export default function App() {
  
  // --- State Management ---
  const [isEditing, setIsEditing] = useState(false);
  
  const initialData = {
    name: "นายศิวดล รังมาตย์",
    phone: "0630214568",
    address: "22/2 ถ.เทศบาลอาชา ซ.เทศบาลอาชา6 ต.ตลาด อ.เมือง จ.มหาสารคาม",
    bio: ""
  };

  const [profileData, setProfileData] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);

  // --- Event Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setOriginalData(profileData); // Save current state as original before editing
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // In a real app, you would save profileData to your backend API here
    console.log("Saving data:", profileData);
    setIsEditing(false);
    // Set original data to new saved data
    setOriginalData(profileData);
  };

  const handleCancelClick = () => {
    setProfileData(originalData); // Revert to original data
    setIsEditing(false);
  };


  return (
    // Main container
    <div className="font-sans relative min-h-screen w-full bg-white overflow-hidden">
      
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-100 rounded-full opacity-30 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-pink-100 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Content Area */}
      <div className="relative z-10 max-w-md mx-auto pb-28">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 pt-10">
          <button className="text-slate-700">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button className="text-slate-700">
              <Bell className="w-6 h-6" />
            </button>
            <button className="text-slate-700">
              <User className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Profile Header */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <img
            src="https://placehold.co/120x120/EBF8FF/3182CE?text=User&font=sans"
            alt="User profile picture"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://placehold.co/120x120?text=User'; }}
          />
          <h1 className="text-3xl font-semibold text-slate-700 mt-4">
            {/* Display name from state */}
            {profileData.name}
          </h1>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mx-4">
          
          {/* User Info Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2">ข้อมูลส่วนตัว</h2>

            {isEditing ? (
              // --- EDITING MODE ---
              <>
                <ProfileInputRow label="ชื่อ" name="name" value={profileData.name} onChange={handleInputChange} />
                <ProfileInputRow label="เบอร์โทรติดต่อ" name="phone" value={profileData.phone} onChange={handleInputChange} />
                <ProfileInputRow label="ที่อยู่" name="address" value={profileData.address} onChange={handleInputChange} />
              </>
            ) : (
              // --- DISPLAY MODE ---
              <>
                <ProfileInfoRow label="ชื่อ" value={profileData.name} />
                <ProfileInfoRow label="เบอร์โทรติดต่อ" value={profileData.phone} />
                <ProfileInfoRow label="ที่อยู่" value={profileData.address} />
              </>
            )}
          </div>

          {/* Additional Info Section (Optional: Can be for a user bio) */}
          <div className="mb-4">
            <label className="text-slate-500 mb-2 block">เกี่ยวกับฉัน (Bio):</label>
            <textarea
              name="bio" // Add name attribute
              className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400"
              placeholder="เพิ่มคำอธิบายเกี่ยวกับตัวคุณ..."
              value={profileData.bio} // Link to state
              onChange={handleInputChange} // Link to handler
              readOnly={!isEditing} // Make it read-only if NOT editing
            />
          </div>
          
          {/* Edit/Save/Cancel Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            {isEditing ? (
              // --- Show Save/Cancel ---
              <>
                <button
                  onClick={handleCancelClick}
                  className="flex items-center justify-center px-5 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-full shadow-md hover:bg-slate-300 transition-colors"
                >
                  <span>ยกเลิก</span>
                </button>
                <button
                  onClick={handleSaveClick}
                  className="flex items-center justify-center px-5 py-2.5 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition-colors"
                >
                  <span>บันทึก</span>
                </button>
              </>
            ) : (
              // --- Show Edit Button ---
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-full shadow-md hover:bg-sky-600 transition-colors"
              >
                <span>แก้ไขโปรไฟล์</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Navigation Bar */}
        <footer className="fixed bottom-6 left-0 right-0 w-full max-w-md mx-auto z-30 flex justify-center">
            <Navigation />
        </footer>
    </div>
  );
}