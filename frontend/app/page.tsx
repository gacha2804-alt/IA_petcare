import Link from "next/link";
import { PawPrint, ShieldCheck, Calendar, Sparkles, MessageSquare, ArrowRight, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-text tracking-tight">PetCare</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-primary tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Preventivo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-primary transition-colors px-3 py-2 rounded-xl"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              Ingresar al Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-primary-dark text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Asistente Clínico Gemini 2.5 Flash + Guardrails Veterinarios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-text tracking-tight leading-tight">
            Cuidado Preventivo Inteligente para tu Mascota en{" "}
            <span className="text-primary underline decoration-primary/30">Nuestras 2 Sedes</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Centraliza su historial médico, controla vacunas y desparasitaciones, y realiza triaje preventivo con IA
            capaz de alertar emergencias y agendar valoraciones presenciales en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard/chat"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Probar Chat Asistente con IA
            </Link>
            <Link
              href="/dashboard/citas"
              className="w-full sm:w-auto bg-surface hover:bg-slate-50 text-text font-bold px-6 py-3.5 rounded-2xl border border-border transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4 text-accent-blue" />
              Ver Disponibilidad de Sedes
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-primary flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-text mb-2">Guardrails Clínicos Estrictos</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detección prioritaria de emergencias vitales (hemorragias, asfixia), prohibición de diagnósticos
              definitivos y fármacos humanos como paracetamol o ibuprofeno.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-accent-blue flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-text mb-2">Agendamiento Atómico</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reserva directa desde el chat o panel en Sede 1 Norte y Sede 2 Sur, con bloqueo de filas en PostgreSQL
              para evitar solapamientos y turnos duplicados.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-text mb-2">Historial y Cloudinary</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Almacenamiento CDN para fotos de pacientes y documentos clínicos en Cloudinary, garantizando acceso
              rápido y seguro.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 text-center text-xs text-slate-500">
        <p>© 2026 PetCare — Plataforma Web para el Cuidado Preventivo de Mascotas. Sede 1 Norte & Sede 2 Sur.</p>
      </footer>
    </div>
  );
}
