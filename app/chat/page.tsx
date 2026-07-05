"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatShell from "@/components/ChatShell";
import { PersonaId } from "@/lib/personas/types";

function ChatPageInner() {
  const params = useSearchParams();
  const requested = params.get("persona");
  const initialPersona: PersonaId = requested === "piyush" ? "piyush" : "hitesh";
  return <ChatShell initialPersona={initialPersona} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
