"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Mascota, HistorialClinico } from "@/lib/types";
import { FileText, PawPrint, Calendar, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

export default function HistorialPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [historial, setHistorial] = useState<HistorialClinico | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  useEffect(() => {
    async function loadPets() {
      try {
        const pets = await api.getMascotas();
        setMascotas(pets);
        if (pets.length > 0) {
          setSelectedPetId(pets[0].id);
        }
      } catch (e) {
        console.error("Error al cargar mascotas:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  useEffect(() => {
    if (!selectedPetId) return;
    const currentId = selectedPetId;

    async function fetchHistorial(id: number) {
      setLoadingHistorial(true);
      try {
        const data = await api.getHistorial(id);
        setHistorial(data);
      } catch (e) {
        console.error("Error al cargar historial:", e);
      } finally {
        setLoadingHistorial(false);
      }
    }
    fetchHistorial(currentId);
  }, [selectedPetId]);

  const currentPet = mascotas.find((p) => p.id === selectedPetId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Historial Clínico Consolidado
          </h2>
          <p className="text-xs text-slate-500">
            Registro unificado de consultas, vacunas y desparasitaciones registradas en Sede 1 y Sede 2.
          </p>
        </div>

        {/* Pet Switcher */}
        {mascotas.length > 0 && (
          <div className="flex items-center gap-2 bg-surface border border-border p-1.5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-500 pl-2">Mascota:</span>
            <select
              value={selectedPetId || ""}
              onChange={(e) => setSelectedPetId(parseInt(e.target.value, 10))}
              className="text-xs font-bold bg-slate-50 border border-border rounded-xl px-3 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {mascotas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.especie})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Cargando expediente...</div>
      ) : !currentPet ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm">
          <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-extrabold text-base text-text mb-1">No hay mascotas para mostrar</h3>
          <p className="text-xs text-slate-500">Registra una mascota primero en la sección de Mis Mascotas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pet Info Banner */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {currentPet.imagen_url ? (
                <img
                  src={currentPet.imagen_url}
                  alt={currentPet.nombre}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-primary font-black flex items-center justify-center text-xl">
                  {currentPet.nombre.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-text flex items-center gap-2">
                  {currentPet.nombre}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-primary-dark border border-emerald-200">
                    {currentPet.especie} • {currentPet.sexo}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fecha de nacimiento: {currentPet.fecha_nacimiento} • {currentPet.datos_identificatorios}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Acceso Protegido por Propietario</span>
            </div>
          </div>

          {loadingHistorial ? (
            <div className="p-12 text-center text-xs text-slate-400">Consultando registros clínicos...</div>
          ) : (
            <div className="space-y-6">
              {/* Tabla de Vacunas (RF-06) */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <h4 className="font-extrabold text-base text-text mb-1 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-primary" />
                  Esquema de Vacunación (RF-06)
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Historial de inmunizaciones aplicadas y cálculo de fechas para próximos refuerzos.
                </p>

                {historial?.vacunas && historial.vacunas.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Vacuna</th>
                          <th className="py-2.5 px-3">Aplicación</th>
                          <th className="py-2.5 px-3">Próximo Refuerzo</th>
                          <th className="py-2.5 px-3">Lote</th>
                          <th className="py-2.5 px-3">Dosis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-text">
                        {historial.vacunas.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-bold text-primary-dark">{v.nombre_vacuna}</td>
                            <td className="py-3 px-3 text-slate-600">{v.fecha_aplicacion}</td>
                            <td className="py-3 px-3 font-semibold text-emerald-600">
                              {v.fecha_proxima_recomendada || "N/A"}
                            </td>
                            <td className="py-3 px-3 text-slate-500">{v.lote || "—"}</td>
                            <td className="py-3 px-3 text-slate-500">{v.dosis || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No se registran vacunas previas para este paciente.
                  </div>
                )}
              </div>

              {/* Tabla de Desparasitaciones (RF-07) */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <h4 className="font-extrabold text-base text-text mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                  Control de Desparasitaciones (RF-07)
                </h4>
                <p className="text-xs text-slate-500 mb-4">Tratamientos preventivos internos y externos.</p>

                {historial?.desparasitaciones && historial.desparasitaciones.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Tipo</th>
                          <th className="py-2.5 px-3">Producto</th>
                          <th className="py-2.5 px-3">Fecha Tratamiento</th>
                          <th className="py-2.5 px-3">Próxima Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-text">
                        {historial.desparasitaciones.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-bold text-accent-blue">{d.tipo_tratamiento}</td>
                            <td className="py-3 px-3 font-semibold text-text">{d.producto}</td>
                            <td className="py-3 px-3 text-slate-600">{d.fecha_tratamiento}</td>
                            <td className="py-3 px-3 font-semibold text-emerald-600">
                              {d.fecha_proxima_recomendada || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No se registran desparasitaciones para este paciente.
                  </div>
                )}
              </div>

              {/* Consultas Veterinarias (RF-04) */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <h4 className="font-extrabold text-base text-text mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Consultas y Diagnósticos Clínicos (RF-04)
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Registros formales asentados por profesionales veterinarios autorizados.
                </p>

                {historial?.consultas && historial.consultas.length > 0 ? (
                  <div className="space-y-3">
                    {historial.consultas.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-text">Motivo: {c.motivo_consulta}</span>
                          <span className="text-slate-400">{c.fecha_consulta}</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>Diagnóstico:</strong> {c.diagnostico_registrado}
                        </p>
                        {c.observaciones && (
                          <p className="text-xs text-slate-500">
                            <strong>Observaciones:</strong> {c.observaciones}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No se registran consultas clínicas previas.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
