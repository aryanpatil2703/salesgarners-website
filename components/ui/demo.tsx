"use client";

import { AIChatCard } from "@/components/ui/ai-chat-card";

export default function AIChatCardDemo() {
  return (
    <div className="flex w-full justify-center py-8">
      <div className="w-full max-w-[480px]">
        <AIChatCard className="min-h-[600px] h-[640px]" />
      </div>
    </div>
  );
}

