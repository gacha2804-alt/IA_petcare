"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Cita, Sede } from "@/lib/types";
import { Calendar, MapPin, Clock, PawPrint, MessageSquare, AlertCircle, CheckCircle, Ban } from "lucide-react";

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filterSede, setFilterSede] = useState<number | "todas">("todas");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citasData, sedesData] = await Promise.all([
        api.getCitas(),
        api.getSedes(),
      ]);
      setCitas(citasData);
      setSedes(sedesData);
    } catch (e: any) {
      setFeedbackMsg({ text: e.message || "Error al cargar citas.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelCita = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita? El horario quedará liberado.")) return;

    setCancellingId(id);
    setFeedbackMsg(null);
    try {
      await api.cancelarCita(id);
      setFeedbackMsg({ text: "Cita cancelada exitosamente y horario liberado.", type: "success" });
      fetchData();
    } catch (e: any) {
      setFeedbackMsg({ text: e.message || "Error al cancelar cita.", type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredCitas = citas.filter((c) => {
    if (filterSede === "todas") return true;
    return c.id_sede === filterSede;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-accent-blue" />
            Citas y Agendas en Sedes
          </h2>
          <p className="text-xs text-slate-500">
            Horarios presenciales garantizados sin colisiones mediante transacciones con bloqueo de fila.
          </p>
        </div>

        <Link
          href="/dashboard/chat"
          className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl shadow-sm text-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          Agendar desde Chat con IA
        </Link>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMsg.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Sedes Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-accent-blue shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-text">Sede 1 - Norte</h4>
            <p className="text-xs text-slate-500">Av. Principal Norte #102-45 • +57 300 123 4567</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block border border-emerald-200">
              Agenda Abierta (09:00 - 17:00)
            </span>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-text">Sede 2 - Sur</h4>
            <p className="text-xs text-slate-500">Calle del Sol Sur #45-80 • +57 300 987 6543</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block border border-emerald-200">
              Agenda Abierta (09:00 - 17:00)
            </span>
          </div>
        </div>
      </div>

      {/* Filter by Sede */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600">Filtrar Sede:</span>
        <button
          onClick={() => setFilterSede("todas")}
          className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterSede === "todas"
              ? "bg-text text-white"
              : "bg-surface border border-border text-slate-600 hover:bg-slate-50"
          }`}
        >
          Todas
        </button>
        {sedes.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterSede(s.id)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterSede === s.id
                ? "bg-accent-blue text-white"
                : "bg-surface border border-border text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      {/* Citas List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Cargando citas...</div>
      ) : filteredCitas.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-accent-blue rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-text mb-1">No hay citas registradas</h3>
          <p className="text-xs text-slate-500 mb-6">
            Cuando la IA detecte que tu mascota requiere valoración presencial o cuando agendes un turno,
            aparecerá aquí.
          </p>
          <Link
            href="/dashboard/chat"
            className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark"
          >
            Ir al Chat con IA
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCitas.map((c) => {
            const isConfirmed = c.estado === "confirmada";
            return (
              <div
                key={c.id}
                className="bg-surface rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-accent-blue border border-blue-200">
                      {c.sede_nombre}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConfirmed
                          ? "bg-emerald-50 text-primary-dark border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {c.estado.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-text mb-1">{c.motivo_consulta}</h3>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3 bg-slate-50 p-3 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2">
                      <PawPrint className="w-3.5 h-3.5 text-primary" />
                      <span>
                        Paciente: <strong>{c.mascota_nombre}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                      <span>
                        Fecha: <strong>{c.fecha_cita}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        Hora: <strong>{c.hora_cita}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {isConfirmed && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      disabled={cancellingId === c.id}
                      onClick={() => handleCancelCita(c.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      {cancellingId === c.id ? "Cancelando..." : "Cancelar Cita"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
