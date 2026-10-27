"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Mascota, Cita } from "@/lib/types";
import { PawPrint, Calendar, MessageSquare, Plus, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";

export default function DashboardPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [petsData, citasData] = await Promise.all([
          api.getMascotas(),
          api.getCitas(),
        ]);
        setMascotas(petsData);
        setCitas(citasData);
      } catch (e) {
        console.error("Error cargando dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Sistema PetCare Activo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            ¡Hola! Bienvenido a tu Centro de Salud Preventiva
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Monitorea el bienestar de tus mascotas, consulta disponibilidad en las 2 sedes y recibe orientación
            clínica inmediata asistida por Inteligencia Artificial.
          </p>
        </div>

        <Link
          href="/dashboard/chat"
          className="bg-white hover:bg-emerald-50 text-primary-dark font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consultar Asistente IA</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center font-bold">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Mascotas Registradas</p>
            <p className="text-2xl font-black text-text">{loading ? "..." : mascotas.length}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-accent-blue flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Citas Presenciales</p>
            <p className="text-2xl font-black text-text">{loading ? "..." : citas.length}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sedes Habilitadas</p>
            <p className="text-2xl font-black text-text">2 Sedes</p>
          </div>
        </div>
      </div>

      {/* Grid: Mis Mascotas & Próximas Citas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mascotas */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-text flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-primary" />
              Tus Mascotas
            </h3>
            <Link
              href="/dashboard/mascotas"
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Cargando mascotas...</div>
          ) : mascotas.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
              No tienes mascotas registradas aún.
              <div className="mt-3">
                <Link
                  href="/dashboard/mascotas"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Registrar Mascota
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {mascotas.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-slate-300 transition-all bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    {pet.imagen_url ? (
                      <img
                        src={pet.imagen_url}
                        alt={pet.nombre}
                        className="w-11 h-11 rounded-full object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-primary font-bold flex items-center justify-center text-sm">
                        {pet.nombre.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-text">{pet.nombre}</h4>
                      <p className="text-xs text-slate-500">
                        {pet.especie} • {pet.sexo} • Nac: {pet.fecha_nacimiento}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/chat/${pet.id}`}
                    className="p-2 bg-white text-primary border border-border rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
                    title={`Abrir Chat con IA para ${pet.nombre}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Citas */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-text flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-blue" />
              Próximas Citas
            </h3>
            <Link
              href="/dashboard/citas"
              className="text-xs font-bold text-accent-blue hover:underline transition-colors flex items-center gap-1"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
              No tienes citas programadas.
              <p className="text-[11px] text-slate-400 mt-1">
                Puedes agendar una desde el Chat Inteligente o en el panel de Citas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {citas.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-border bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-accent-blue tracking-wide bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {c.sede_nombre}
                    </span>
                    <h4 className="font-bold text-sm text-text mt-1">{c.motivo_consulta}</h4>
                    <p className="text-xs text-slate-500">
                      Paciente: <strong>{c.mascota_nombre}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-primary-dark text-xs block">
                      {c.fecha_cita}
                    </span>
                    <span className="text-xs font-bold text-slate-600 block">{c.hora_cita}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                      {c.estado.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
