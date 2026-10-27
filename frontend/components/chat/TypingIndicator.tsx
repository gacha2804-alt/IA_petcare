"use client";

import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4 items-center">
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold shadow-sm">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
        <span className="text-xs text-slate-500 mr-2 font-medium">
          PetCare IA está analizando con guardrails veterinarios...
        </span>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        <div
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};
