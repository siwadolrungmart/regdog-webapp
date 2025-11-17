import React from "react";
import {
  Calendar,
  Clock,
  PawPrint,
  Scale,
  ArrowRight,
  Cat,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Dog = {
  id: number;
  name: string;
  date: string;
  age: string;
  breed: string;
  weight: string;
  image: string;
};

const Card = ({ dog }: { dog: Dog }) => {
  const router = useRouter();

  const petId = dog.id;

  function handlePage() {
    localStorage.setItem("petId", petId.toString());
    router.push("/home");
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 flex gap-4 border border-[#D1EBF5]">
      {/* Dog image */}
      <div className="w-60 h-full rounded-2xl overflow-hidden bg-green-50 flex justify-center items-center border border-[#D1EBF5]">
        <Cat />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between w-full">
        <h2 className="text-lg font-semibold">{dog.name}</h2>

        <div className="text-sm text-gray-700 space-y-1 mt-1">
          <InfoRow icon={<Calendar />} label="Date" value={dog.date} />
          <InfoRow icon={<Clock />} label="Age" value={dog.age} />
          <InfoRow icon={<PawPrint />} label="Breed" value={dog.breed} />
          <InfoRow icon={<Scale />} label="Weight" value={dog.weight} />
        </div>

        {/* Button */}
        <div className="mt-2 flex justify-end">
          <button
            className="flex items-center gap-1 bg-[#FFD774] px-4 py-1.5 rounded-full font-medium text-gray-800"
            onClick={() => handlePage()}
          >
            ต่อไป <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-black">{icon}</span>
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default Card;
