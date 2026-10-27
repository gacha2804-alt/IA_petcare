"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { PawPrint, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("tutor@petcare.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.login(email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  const setTestRole = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-sm">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
            <PawPrint className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-text tracking-tight">PetCare</span>
        </div>

        <h2 className="text-xl font-black text-center text-text mb-1">Iniciar Sesión</h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          Ingresa para gestionar la salud preventiva de tus mascotas
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-primary" /> Correo Electrónico:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full p-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-primary" /> Contraseña:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin">🔄 Autenticando...</span>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Cuentas de Prueba Preconfiguradas (Seed Data) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-accent-blue" /> Cuentas de Prueba (1-Clic):
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setTestRole("tutor@petcare.com", "password123")}
              className="p-2 rounded-xl border border-border bg-slate-50 hover:bg-emerald-50 hover:border-primary text-left transition-colors font-medium text-slate-700"
            >
              <div className="font-bold text-primary">Tutor (Carlos)</div>
              <div className="text-[10px] text-slate-400">Dueño de Max</div>
            </button>

            <button
              type="button"
              onClick={() => setTestRole("veterinaria@petcare.com", "password123")}
              className="p-2 rounded-xl border border-border bg-slate-50 hover:bg-blue-50 hover:border-accent-blue text-left transition-colors font-medium text-slate-700"
            >
              <div className="font-bold text-accent-blue">Veterinaria</div>
              <div className="text-[10px] text-slate-400">Dra. Laura</div>
            </button>

            <button
              type="button"
              onClick={() => setTestRole("clinica@petcare.com", "password123")}
              className="p-2 rounded-xl border border-border bg-slate-50 hover:bg-purple-50 hover:border-purple-500 text-left transition-colors font-medium text-slate-700"
            >
              <div className="font-bold text-purple-600">Personal Clínica</div>
              <div className="text-[10px] text-slate-400">Andrés Torres</div>
            </button>

            <button
              type="button"
              onClick={() => setTestRole("admin@petcare.com", "admin123")}
              className="p-2 rounded-xl border border-border bg-slate-50 hover:bg-slate-200 text-left transition-colors font-medium text-slate-700"
            >
              <div className="font-bold text-slate-800">Administrador</div>
              <div className="text-[10px] text-slate-400">Acceso Total</div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
