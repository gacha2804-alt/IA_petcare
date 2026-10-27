"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint,
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Panel General",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Mis Mascotas",
      href: "/dashboard/mascotas",
      icon: PawPrint,
    },
    {
      name: "Historial Clínico",
      href: "/dashboard/historial",
      icon: FileText,
    },
    {
      name: "Citas y Sedes",
      href: "/dashboard/citas",
      icon: Calendar,
    },
    {
      name: "Chat con IA",
      href: "/dashboard/chat",
      icon: MessageSquare,
      badge: "Gemini 2.5",
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-text tracking-tight">PetCare</span>
            <span className="block text-[10px] uppercase font-bold text-primary tracking-widest">
              Cuidado Preventivo
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-0.5 ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-primary-dark"
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-border text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-accent-blue" />
          <span>Sedes Habilitadas:</span>
        </div>
        <div className="space-y-1 pl-1 text-[10px]">
          <p>• Sede 1 - Norte (09:00 - 17:00)</p>
          <p>• Sede 2 - Sur (09:00 - 17:00)</p>
        </div>
        <div className="pt-2 border-t border-slate-200 flex items-center gap-1 text-[10px] text-primary-dark font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Guardrails Clínicos Activos</span>
        </div>
      </div>
    </aside>
  );
};
