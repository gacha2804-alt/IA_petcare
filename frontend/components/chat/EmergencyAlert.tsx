"use client";

import React from "react";
import { AlertTriangle, PhoneCall, MapPin, ShieldAlert } from "lucide-react";

interface EmergencyAlertProps {
  petName?: string;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ petName = "tu mascota" }) => {
  return (
    <div className="my-4 rounded-2xl border-2 border-red-500 bg-red-50 p-5 shadow-md animate-pulse">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-full bg-red-600 text-white shrink-0 shadow-sm">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs uppercase px-2.5 py-0.5 rounded-full font-extrabold tracking-wide">
              URGENCIA VITAL DETECTADA
            </span>
          </div>
          <h4 className="text-red-950 font-black text-lg mt-1 mb-1">
            Atención Veterinaria Presencial Inmediata para {petName}
          </h4>
          <p className="text-red-900 text-sm leading-relaxed mb-4">
            Los signos descritos indican una situación de alto riesgo clínico. Por estricto protocolo de
            seguridad médica de PetCare, <strong>NO esperes un turno programado de cita</strong>. Acude de
            inmediato a una clínica de urgencias 24 horas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-red-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-900 bg-white/80 p-2.5 rounded-xl border border-red-200">
              <PhoneCall className="w-4 h-4 text-red-600 shrink-0" />
              <span>Línea Urgencias 24h: <strong>01-8000-PET-EMERG</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-900 bg-white/80 p-2.5 rounded-xl border border-red-200">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span>Sede 1 Norte o Sede 2 Sur (Admisión Inmediata)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
