"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Mascota } from "@/lib/types";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PetChatPage() {
  const params = useParams();
  const router = useRouter();
  const mascotaIdStr = params?.mascotaId as string;
  const mascotaId = parseInt(mascotaIdStr, 10);

  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(mascotaId)) {
      setErrorMsg("Identificador de mascota inválido.");
      setLoading(false);
      return;
    }

    async function loadMascota() {
      try {
        const pet = await api.getMascota(mascotaId);
        setMascota(pet);
      } catch (e: any) {
        setErrorMsg(e.message || "No se pudo cargar la información de la mascota.");
      } finally {
        setLoading(false);
      }
    }
    loadMascota();
  }, [mascotaId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-bold text-text">Cargando expediente de la mascota...</p>
      </div>
    );
  }

  if (errorMsg || !mascota) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-8 max-w-md mx-auto text-center shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-base text-text mb-2">Mascota no encontrada</h3>
        <p className="text-xs text-slate-500 mb-6">
          {errorMsg || "Debes seleccionar una mascota válida antes de iniciar la interacción con la IA."}
        </p>
        <Link
          href="/dashboard/chat"
          className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Selección de Mascota
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ChatWindow mascota={mascota} />
    </div>
  );
}
