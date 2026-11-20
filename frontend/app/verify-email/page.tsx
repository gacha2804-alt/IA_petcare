"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Estado = "cargando" | "exito" | "error";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [estado, setEstado] = useState<Estado>("cargando");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (!token) {
            setEstado("error");
            setMensaje("No se encontró el token de verificación en el enlace.");
            return;
        }

        const verificar = async () => {
            try {
                const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                const baseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");
                const res = await fetch(
                    `${baseUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
                );
                const data = await res.json();

                if (res.ok) {
                    setEstado("exito");
                    setMensaje(data.message || "✅ Correo verificado exitosamente.");
                    setTimeout(() => router.push("/login"), 3000);
                } else {
                    setEstado("error");
                    setMensaje(data.detail || "El enlace de verificación es inválido o ya fue usado.");
                }
            } catch {
                setEstado("error");
                setMensaje("No se pudo conectar con el servidor. Intenta de nuevo más tarde.");
            }
        };

        verificar();
    }, [token, router]);

    return (
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-10 shadow-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
                    <PawPrint className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-2xl text-text tracking-tight">PetCare</span>
            </div>

            {estado === "cargando" && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-14 h-14 text-primary animate-spin" />
                    <h2 className="text-xl font-black text-text">Verificando tu correo...</h2>
                    <p className="text-sm text-slate-500">Por favor espera un momento.</p>
                </div>
            )}

            {estado === "exito" && (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h2 className="text-xl font-black text-text">¡Cuenta verificada!</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{mensaje}</p>
                    <p className="text-xs text-slate-400">Serás redirigido al inicio de sesión en unos segundos...</p>
                    <Link href="/login" className="mt-2 inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
                        Ir al inicio de sesión
                    </Link>
                </div>
            )}

            {estado === "error" && (
                <div className="flex flex-col items-center gap-4">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <h2 className="text-xl font-black text-text">Error de verificación</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{mensaje}</p>
                    <div className="flex flex-col gap-2 w-full mt-2">
                        <Link href="/register" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all text-center">
                            Registrarme de nuevo
                        </Link>
                        <Link href="/login" className="inline-block border border-border text-text px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all text-center">
                            Ir al inicio de sesión
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-4">
            <Suspense fallback={
                <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-10 shadow-sm text-center flex flex-col items-center gap-4">
                    <Loader2 className="w-14 h-14 text-primary animate-spin" />
                    <h2 className="text-xl font-black text-text">Cargando verificación...</h2>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
