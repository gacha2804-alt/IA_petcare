"use client";

import React from "react";
import { ChatMensaje } from "@/lib/types";
import { Bot, User, ShieldCheck } from "lucide-react";
import { AppointmentCard } from "./AppointmentCard";
import { EmergencyAlert } from "./EmergencyAlert";

interface MessageBubbleProps {
  mensaje: ChatMensaje;
  mascotaId: number;
  mascotaNombre: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  mensaje,
  mascotaId,
  mascotaNombre,
}) => {
  const isUser = mensaje.remitente === "usuario";

  // Parsear metadatos JSON si existen
  let widgetData: any = null;
  if (mensaje.metadatos_json) {
    try {
      widgetData = JSON.parse(mensaje.metadatos_json);
    } catch {
      widgetData = null;
    }
  }

  const isEmergency = mensaje.contenido.includes("🚨") || mensaje.contenido.includes("ALERTA DE EMERGENCIA");

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm ${
          isUser ? "bg-accent-blue" : "bg-primary"
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1.5 mb-1 px-1">
          <span className="text-[11px] font-bold text-slate-500">
            {isUser ? "Tú" : "Asistente Clínico PetCare"}
          </span>
          {!isUser && (
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-primary-dark rounded font-semibold flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> IA Triaje
            </span>
          )}
          <span className="text-[10px] text-slate-400">
            {new Date(mensaje.fecha_envio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-accent-blue text-white rounded-tr-none"
              : isEmergency
              ? "bg-red-50 text-red-950 border border-red-200 rounded-tl-none font-medium"
              : "bg-surface text-text border border-border rounded-tl-none"
          }`}
        >
          {/* Texto con formato simple de saltos de línea y negritas */}
          <div className="whitespace-pre-line space-y-1">
            {mensaje.contenido.split("\n\n").map((parrafo, idx) => (
              <p key={idx}>{parrafo}</p>
            ))}
          </div>

          {/* Banner de Emergencia integrado si la IA detectó urgencia */}
          {isEmergency && <EmergencyAlert petName={mascotaNombre} />}

          {/* Widget de Agendamiento si procede (HU-13 a HU-17) */}
          {widgetData && widgetData.tipo === "agendamiento" && !isEmergency && (
            <AppointmentCard
              mascotaId={mascotaId}
              mascotaNombre={mascotaNombre}
              defaultMotivo="Valoración recomendada en triaje"
            />
          )}
        </div>
      </div>
    </div>
  );
};
