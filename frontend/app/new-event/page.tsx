// app/new-event/page.tsx
import { Suspense } from "react";
import NewEventPageClient from "./NewEventPageClient";

export default function NewEventPage() {
  return (
    <Suspense
      fallback={
        <div className="mobile px-4 py-6 text-sm text-gray-500">
          กำลังโหลด...
        </div>
      }
    >
      <NewEventPageClient />
    </Suspense>
  );
}