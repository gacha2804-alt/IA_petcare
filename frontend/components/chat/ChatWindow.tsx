"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mascota, ChatConversacion, ChatMensaje } from "@/lib/types";
import { api } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Send, ShieldAlert, Sparkles, ArrowLeft, RefreshCw, Calendar } from "lucide-react";
import Link from "next/link";

interface ChatWindowProps {
  mascota: Mascota;
}

const SUGGESTED_PROMPTS = [
  "Max vomitó hace unas horas y parece con poco apetito",
  "🚨 ¡Max tiene un sangrado abundante en la pata tras cortarse!",
  "Quisiera saber cuándo le toca su próximo refuerzo de vacuna",
  "¿Puedo darle una pastilla de paracetamol para su dolor?"
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ mascota }) => {
  const [conversacion, setConversacion] = useState<ChatConversacion | null>(null);
  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [inputTexto, setInputTexto] = useState<string>("");
  const [loadingConv, setLoadingConv] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function initConversation() {
      setLoadingConv(true);
      setErrorMsg(null);
      try {
        const conv = await api.createOrGetConversation(mascota.id);
        setConversacion(conv);
        setMensajes(conv.mensajes || []);
      } catch (e: any) {
        setErrorMsg(e.message || "Error al conectar con la conversación de la mascota.");
      } finally {
        setLoadingConv(false);
      }
    }
    initConversation();
  }, [mascota.id]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, sending]);

  const handleSendMessage = async (textToSend?: string) => {
    const texto = textToSend || inputTexto;
    if (!texto.trim() || sending || !conversacion) return;

    setInputTexto("");
    setSending(true);
    setErrorMsg(null);

    // Optimistic user message
    const tempUserMsg: ChatMensaje = {
      id: Date.now(),
      id_conversacion: conversacion.id,
      remitente: "usuario",
      contenido: texto.trim(),
      fecha_envio: new Date().toISOString(),
      contiene_informacion_clinica: true,
      es_orientacion_inicial: false,
    };
    setMensajes((prev) => [...prev, tempUserMsg]);

    try {
      const response = await api.sendMessage(conversacion.id, texto.trim());
      setMensajes((prev) => [...prev, response.mensaje_asistente]);

      if (response.urgencia_detectada) {
        setConversacion((prev) => (prev ? { ...prev, urgencia_detectada: true } : prev));
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error al obtener respuesta del asistente.");
    } finally {
      setSending(false);
    }
  };

  if (loadingConv) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-surface rounded-2xl border border-border min-h-[450px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text font-bold text-sm">Conectando asistente clínico con el expediente de {mascota.nombre}...</p>
        <p className="text-slate-400 text-xs mt-1">Cargando contexto médico y guardrails...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header del Chat */}
      <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chat"
            className="p-1.5 rounded-lg bg-white border border-border text-slate-600 hover:text-text transition-colors"
            title="Cambiar mascota"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {mascota.imagen_url ? (
            <img
              src={mascota.imagen_url}
              alt={mascota.nombre}
              className="w-10 h-10 rounded-full object-cover border border-primary/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-primary-dark font-black flex items-center justify-center">
              {mascota.nombre.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="font-extrabold text-text text-sm flex items-center gap-2">
              Consulta de {mascota.nombre}
              <span className="text-[10px] font-semibold bg-emerald-100 text-primary-dark px-2 py-0.5 rounded-full">
                {mascota.especie}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {mascota.sexo} • Nac: {mascota.fecha_nacimiento} • {mascota.datos_identificatorios || "Sin notas"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversacion?.urgencia_detectada && (
            <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-red-200 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              Alerta Activa
            </span>
          )}
          <Link
            href="/dashboard/citas"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-white text-slate-700 hover:bg-slate-100"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Mis Citas
          </Link>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-900 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {mensajes.map((m) => (
          <MessageBubble
            key={m.id}
            mensaje={m}
            mascotaId={mascota.id}
            mascotaNombre={mascota.nombre}
          />
        ))}

        {sending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompts Rápidos Sugeridos */}
      {mensajes.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Sugerencias de prueba:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-primary text-slate-700 transition-colors border border-slate-200 truncate max-w-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input de Envío */}
      <div className="p-3 bg-surface border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            disabled={sending}
            placeholder={`Describe los signos o consulta preventiva para ${mascota.nombre}...`}
            className="flex-1 bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !inputTexto.trim()}
            className={`p-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center ${
              sending || !inputTexto.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark text-white cursor-pointer"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          PetCare AI ofrece orientación preventiva y triaje. No sustituye un diagnóstico clínico presencial.
        </p>
      </div>
    </div>
  );
};
