"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Mascota } from "@/lib/types";
import { ImageUpload } from "@/components/chat/ImageUpload";
import { PawPrint, Plus, Calendar, MessageSquare, AlertCircle, X, ShieldCheck } from "lucide-react";

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [sexo, setSexo] = useState("Macho");
  const [fechaNacimiento, setFechaNacimiento] = useState("2023-01-01");
  const [datosIdentificatorios, setDatosIdentificatorios] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMascotas = async () => {
    setLoading(true);
    try {
      const data = await api.getMascotas();
      setMascotas(data);
    } catch (e: any) {
      setErrorMsg(e.message || "Error al cargar mascotas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotas();
  }, []);

  const handleCreateMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !fechaNacimiento) {
      setErrorMsg("Nombre y fecha de nacimiento son obligatorios.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await api.createMascota({
        nombre: nombre.trim(),
        especie,
        sexo,
        fecha_nacimiento: fechaNacimiento,
        datos_identificatorios: datosIdentificatorios.trim(),
        imagen_url: imagenUrl,
      });
      setShowModal(false);
      // Reset form
      setNombre("");
      setDatosIdentificatorios("");
      setImagenUrl("");
      fetchMascotas();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al registrar mascota.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-primary" />
            Mis Mascotas
          </h2>
          <p className="text-xs text-slate-500">
            Administra a tus compañeros y mantén centralizado su expediente clínico y fotos en Cloudinary.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl shadow-sm text-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Mascota
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid de Mascotas */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Cargando mascotas...</div>
      ) : mascotas.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-text mb-1">Aún no tienes mascotas registradas</h3>
          <p className="text-xs text-slate-500 mb-6">
            Registra tu primer paciente para poder consultar el historial clínico y chatear con el asistente de IA.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark"
          >
            Registrar Mascota Ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascotas.map((pet) => (
            <div
              key={pet.id}
              className="bg-surface rounded-2xl border border-border hover:border-slate-300 shadow-sm transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 relative">
                  {pet.imagen_url ? (
                    <img
                      src={pet.imagen_url}
                      alt={pet.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <PawPrint className="w-12 h-12 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold">Sin imagen</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-text shadow-sm">
                    {pet.especie}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-lg text-text flex items-center justify-between">
                    <span>{pet.nombre}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {pet.sexo}
                    </span>
                  </h3>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Nacimiento: {pet.fecha_nacimiento}</span>
                  </p>

                  {pet.datos_identificatorios ? (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-border/50 line-clamp-2">
                      {pet.datos_identificatorios}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Sin datos identificatorios adicionales.</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <Link
                  href={`/dashboard/chat/${pet.id}`}
                  className="flex-1 py-2 px-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat con IA</span>
                </Link>

                <Link
                  href="/dashboard/historial"
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Historial
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registrar Mascota */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-border w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="font-extrabold text-lg text-text flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Registrar Nueva Mascota
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-text hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMascota} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Mascota *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Max, Luna, Toby"
                  className="w-full text-sm p-2.5 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Especie *</label>
                  <select
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sexo *</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  required
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Datos Identificatorios (Raza, color, microchip)
                </label>
                <textarea
                  value={datosIdentificatorios}
                  onChange={(e) => setDatosIdentificatorios(e.target.value)}
                  placeholder="Ej: Golden Retriever, dorado claro, microchip #9810982348"
                  rows={2}
                  className="w-full text-sm p-2.5 rounded-xl border border-border bg-slate-50 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Subida a Cloudinary */}
              <ImageUpload
                onImageUploaded={(url) => setImagenUrl(url)}
                defaultImageUrl={imagenUrl}
                label="Foto de la Mascota (Subida a Cloudinary)"
              />

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar Mascota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
