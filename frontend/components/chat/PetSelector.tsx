"use client";

import React from "react";
import Link from "next/link";
import { Mascota } from "@/lib/types";
import { MessageSquare, Plus, PawPrint, Calendar, ShieldCheck } from "lucide-react";

interface PetSelectorProps {
  mascotas: Mascota[];
  selectedPetId?: number;
  onSelectPet: (mascota: Mascota) => void;
  loading?: boolean;
}

export const PetSelector: React.FC<PetSelectorProps> = ({
  mascotas,
  selectedPetId,
  onSelectPet,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3 text-text font-medium">Cargando mascotas...</span>
      </div>
    );
  }

  if (mascotas.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-8 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <PawPrint className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-text mb-2">No tienes mascotas registradas</h3>
        <p className="text-slate-600 mb-6 text-sm">
          Para iniciar una conversación con el Asistente Clínico Inteligente, primero debes registrar a tu mascota.
        </p>
        <Link
          href="/dashboard/mascotas"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Registrar Mascota
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text">Selecciona tu Paciente</h2>
          <p className="text-xs text-slate-500">
            Regla de Seguridad PetCare: Todo triaje debe vincularse al historial de una mascota activa.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-primary-dark border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Triaje Clínico Seguro
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mascotas.map((pet) => {
          const isSelected = selectedPetId === pet.id;
          return (
            <div
              key={pet.id}
              onClick={() => onSelectPet(pet)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 bg-surface flex flex-col justify-between ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : "border-border hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {pet.imagen_url ? (
                  <img
                    src={pet.imagen_url}
                    alt={pet.nombre}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                    {pet.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-text text-base flex items-center gap-1.5">
                    {pet.nombre}
                    <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {pet.especie}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <span>Sexo: {pet.sexo}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>Nac: {pet.fecha_nacimiento}</span>
                  </p>
                </div>
              </div>

              {pet.datos_identificatorios && (
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg mb-3">
                  {pet.datos_identificatorios}
                </p>
              )}

              <button
                type="button"
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {isSelected ? "Mascota en Consulta" : "Iniciar Consulta con IA"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
