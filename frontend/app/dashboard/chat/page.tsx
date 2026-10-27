"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Mascota } from "@/lib/types";
import { PetSelector } from "@/components/chat/PetSelector";
import { MessageSquare, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";

export default function ChatIndexPage() {
  const router = useRouter();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const data = await api.getMascotas();
        setMascotas(data);
      } catch (e) {
        console.error("Error al cargar mascotas:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  const handleSelectPet = (pet: Mascota) => {
    router.push(`/dashboard/chat/${pet.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Informative Header Banner */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-text tracking-tight flex items-center gap-2">
                Asistente Clínico Inteligente PetCare
                <span className="text-xs bg-emerald-100 text-primary-dark px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Triaje veterinario preventivo, detección de signos de alarma y agendamiento interactivo en 2 sedes.
              </p>
            </div>
          </div>
        </div>

        {/* Guardrails Notice */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-start gap-2 text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">1. Emergencias Primero</span>
              <span>Si hay sangrado abundante o asfixia, te alertará para acudir de inmediato sin agendar.</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">2. Cuidado Seguro</span>
              <span>Prohíbe diagnósticos definitivos, recetas humanas (paracetamol) e inducción del vómito.</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2 text-blue-950">
            <Sparkles className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">3. Agendamiento en Chat</span>
              <span>Si amerita valoración presencial, te despliega slots reales en Sede 1 Norte y Sede 2 Sur.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Obligatorio (RF-09) */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
        <PetSelector
          mascotas={mascotas}
          onSelectPet={handleSelectPet}
          loading={loading}
        />
      </div>
    </div>
  );
}
