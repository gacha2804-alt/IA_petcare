"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Usuario } from "@/lib/types";
import { LogOut, User, Bell, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Leer usuario de localStorage o API
    const stored = localStorage.getItem("petcare_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      api.getMe()
        .then((u) => {
          setUser(u);
          localStorage.setItem("petcare_user", JSON.stringify(u));
        })
        .catch(() => {
          // Si no está autenticado, usar usuario tutor por defecto para testing local
          const testTutor: Usuario = {
            id: 1,
            nombre: "Carlos",
            apellido: "Mendoza",
            correo_electronico: "tutor@petcare.com",
            roles: ["propietario"],
            fecha_registro: new Date().toISOString()
          };
          setUser(testTutor);
        });
    }
  }, []);

  const handleLogout = () => {
    api.clearToken();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-text">
          Portal de Salud Preventiva
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Conexión Segura
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-text leading-tight">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {user.roles?.[0] ? user.roles[0].toUpperCase() : "PROPIETARIO"} • {user.correo_electronico}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.nombre.charAt(0)}
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl border border-border text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-xl"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
};
