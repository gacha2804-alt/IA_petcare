import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetCare — Plataforma para el Cuidado Preventivo de Mascotas",
  description: "Gestión clínica centralizada, citas veterinarias en 2 sedes y triaje inteligente asistido por Gemini con guardrails de seguridad.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-bg text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
