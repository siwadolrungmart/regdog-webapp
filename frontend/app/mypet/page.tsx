"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Card from "@/components/card";
import Bar from "@/components/bar";
import Navigation from "@/components/navigation";
import { getDogs } from "@/lib/api";
import { CreateDogModal } from "@/components/createpet";

type Dog = {
  id: number;
  name: string;
  date: string;
  age: string;
  breed: string;
  weight: string;
  image: string;
};

export default function DogsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = 1;
  const pageSize = 10;
  const userId = 1;
  const [showCreate, setShowCreate] = useState(false);

  // เวลาเพิ่มสำเร็จให้ดันเข้า list หรือ refetch เอาก็ได้
  console.log("dog list: ", dogs);
  useEffect(() => {
    async function fetchDogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDogs(userId, page, pageSize);
        console.log(res)
        console.log("fetch dogs response: ", res);
        if (res.status >= 200 && res.status < 300 && res.data) {
          // Map backend items to local Dog type and provide fallbacks for missing fields
          const mapped: Dog[] = res.data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            date: item.date,
            age: item.age,
            breed: item.breed,
            weight: item.weight,
            image: item.image,
          }));
          setDogs(mapped);
        } else {
          setError(res.error ?? "โหลดข้อมูลไม่สำเร็จ");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, [userId, page, pageSize]);
  const handleCreated = (newDog: any) => {
    setDogs((prev) => [newDog, ...prev]);
    setShowCreate(false);
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center relative overflow-hidden px-2.5">
      {/* Header */}
      <Bar />

      {/* Dog cards list */}
      <div className="flex flex-col gap-6 mt-2 w-full">
        {loading && (
          <p className="text-center text-sm text-gray-500">กำลังโหลด...</p>
        )}
        {error && !loading && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && dogs.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            ยังไม่มีสุนัขในระบบ
          </p>
        )}
        {!loading &&
          !error &&
          dogs.length > 0 &&
          dogs.map((dog) => <Card key={dog.id} dog={dog} />)}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-10 right-6 h-14 w-14 flex items-center justify-center bg-[#FFD774] rounded-xl shadow-md"
      >
        <Plus className="h-6 w-6 text-black" />
      </button>

      {/* Popup create dog */}
      <CreateDogModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      <Navigation />
    </div>
  );
}
