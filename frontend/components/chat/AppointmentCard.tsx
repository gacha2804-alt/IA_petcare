"use client";

import React, { useState, useEffect } from "react";
import { Sede, Disponibilidad, Cita } from "@/lib/types";
import { api } from "@/lib/api";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface AppointmentCardProps {
  mascotaId: number;
  mascotaNombre: string;
  defaultMotivo?: string;
  onAppointmentBooked?: (cita: Cita) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  mascotaId,
  mascotaNombre,
  defaultMotivo = "Valoración presencial recomendada en triaje",
  onAppointmentBooked,
}) => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [selectedSedeId, setSelectedSedeId] = useState<number>(1);
  const [selectedFecha, setSelectedFecha] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [slots, setSlots] = useState<Disponibilidad[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState<string>(defaultMotivo);

  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [booking, setBooking] = useState<boolean>(false);
  const [confirmedCita, setConfirmedCita] = useState<Cita | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar sedes al montar
  useEffect(() => {
    async function loadSedes() {
      try {
        const data = await api.getSedes();
        setSedes(data);
        if (data.length > 0) {
          setSelectedSedeId(data[0].id);
        }
      } catch (e: any) {
        console.error("Error cargando sedes:", e);
      }
    }
    loadSedes();
  }, []);

  // Cargar disponibilidad en tiempo real cuando cambia sede o fecha
  useEffect(() => {
    async function loadDisponibilidad() {
      if (!selectedSedeId || !selectedFecha) return;
      setLoadingSlots(true);
      setErrorMsg(null);
      setSelectedSlotId(null);
      try {
        const data = await api.getDisponibilidad(selectedSedeId, selectedFecha);
        setSlots(data);
      } catch (e: any) {
        setErrorMsg("No fue posible consultar los horarios en este momento.");
      } finally {
        setLoadingSlots(false);
      }
    }
    loadDisponibilidad();
  }, [selectedSedeId, selectedFecha]);

  const handleBook = async () => {
    if (!selectedSlotId) {
      setErrorMsg("Por favor selecciona un horario disponible.");
      return;
    }
    if (!motivo.trim()) {
      setErrorMsg("El motivo de consulta es obligatorio.");
      return;
    }

    setBooking(true);
    setErrorMsg(null);

    try {
      const cita = await api.createCita({
        id_mascota: mascotaId,
        id_sede: selectedSedeId,
        id_disponibilidad: selectedSlotId,
        motivo_consulta: motivo.trim(),
      });
      setConfirmedCita(cita);
      if (onAppointmentBooked) {
        onAppointmentBooked(cita);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error al apartar la cita. El horario pudo haber sido ocupado.");
    } finally {
      setBooking(false);
    }
  };

  if (confirmedCita) {
    return (
      <div className="mt-4 rounded-2xl bg-emerald-50 border-2 border-primary p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3 text-primary-dark">
          <div className="p-2 rounded-full bg-primary text-white">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base">¡Cita Confirmada con Éxito!</h4>
            <p className="text-xs text-slate-600">
              Registrada en el sistema de PetCare #{confirmedCita.id}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-emerald-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Paciente:</span>
            <span className="font-bold text-text">{confirmedCita.mascota_nombre || mascotaNombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Sede:</span>
            <span className="font-bold text-text">{confirmedCita.sede_nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Fecha y Hora:</span>
            <span className="font-bold text-primary-dark">
              {confirmedCita.fecha_cita} a las {confirmedCita.hora_cita}
            </span>
          </div>
          <div className="flex justify-between border-t pt-1 border-slate-100">
            <span className="text-slate-500 font-medium">Motivo:</span>
            <span className="font-semibold text-slate-700">{confirmedCita.motivo_consulta}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl bg-surface border-2 border-emerald-200 p-5 shadow-md max-w-lg">
      <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-primary-dark">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">
            Agendar Valoración Presencial para {mascotaNombre}
          </h4>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-primary border border-emerald-200">
          Enlace Directo
        </span>
      </div>

      {errorMsg && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selector de Sedes (Sede 1 vs Sede 2) */}
      <div className="mb-3">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-accent-blue" />
          Selecciona la Sede (RF-14):
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sedes.map((s) => {
            const isSelected = selectedSedeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSedeId(s.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-left ${
                  isSelected
                    ? "bg-accent-blue text-white border-accent-blue shadow-sm"
                    : "bg-slate-50 text-slate-700 border-border hover:bg-slate-100"
                }`}
              >
                <div className="font-bold">{s.nombre}</div>
                <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                  {s.direccion}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Fecha */}
      <div className="mb-3">
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Fecha de la Cita:
        </label>
        <input
          type="date"
          value={selectedFecha}
          onChange={(e) => setSelectedFecha(e.target.value)}
          className="w-full text-xs p-2 rounded-xl border border-border bg-slate-50 text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Selector de Slots en Tiempo Real */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary" />
          Horarios Disponibles (Tiempo Real):
        </label>

        {loadingSlots ? (
          <div className="py-4 text-center text-xs text-slate-500">
            <span className="inline-block animate-spin mr-2">⏳</span>
            Consultando disponibilidad en la base de datos...
          </div>
        ) : slots.length === 0 ? (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 text-center">
            No hay turnos libres en esta fecha. Selecciona otro día o la otra sede.
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-border">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    isSelected
                      ? "bg-primary text-white shadow-sm scale-105"
                      : "bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200"
                  }`}
                >
                  {slot.hora_inicio}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivo de consulta */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Motivo / Síntomas observados (Validación Obligatoria):
        </label>
        <input
          type="text"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej: Cojera en pata derecha desde ayer"
          className="w-full text-xs p-2 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Botón de Confirmación Atómica */}
      <button
        type="button"
        disabled={booking || !selectedSlotId || loadingSlots}
        onClick={handleBook}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
          booking || !selectedSlotId || loadingSlots
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark text-white cursor-pointer"
        }`}
      >
        {booking ? (
          <>
            <span className="animate-spin">🔄</span> Confirmando reserva atómica...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Confirmar Reserva en {sedes.find((s) => s.id === selectedSedeId)?.nombre || "Sede"}
          </>
        )}
      </button>
      <p className="text-[10px] text-slate-400 text-center mt-2">
        La reserva se realiza mediante transacción atómica segura con bloqueo de fila.
      </p>
    </div>
  );
};
