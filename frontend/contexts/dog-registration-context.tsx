"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DogRegistrationData {
  hasDog: boolean | null;
  name: string;
  gender: "MALE" | "FEMALE" | "UNKNOWN" | null;
  birthDate: string;
  breed: string;
}

interface DogRegistrationContextType {
  dogData: DogRegistrationData;
  updateDogData: (data: Partial<DogRegistrationData>) => void;
  resetDogData: () => void;
}

const initialData: DogRegistrationData = {
  hasDog: null,
  name: "",
  gender: null,
  birthDate: "",
  breed: "",
};

const DogRegistrationContext = createContext<
  DogRegistrationContextType | undefined
>(undefined);

export function DogRegistrationProvider({ children }: { children: ReactNode }) {
  const [dogData, setDogData] = useState<DogRegistrationData>(initialData);

  const updateDogData = (data: Partial<DogRegistrationData>) => {
    setDogData((prev) => ({ ...prev, ...data }));
  };

  const resetDogData = () => {
    setDogData(initialData);
  };

  return (
    <DogRegistrationContext.Provider
      value={{ dogData, updateDogData, resetDogData }}
    >
      {children}
    </DogRegistrationContext.Provider>
  );
}

export function useDogRegistration() {
  const context = useContext(DogRegistrationContext);
  if (!context) {
    throw new Error(
      "useDogRegistration must be used within DogRegistrationProvider",
    );
  }
  return context;
}
