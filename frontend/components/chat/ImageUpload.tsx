"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { UploadCloud, CheckCircle2, AlertCircle, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  defaultImageUrl?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  defaultImageUrl,
  label = "Foto de la mascota (Cloudinary)"
}) => {
  const [preview, setPreview] = useState<string | null>(defaultImageUrl || null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Previsualización local inmediata
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    setErrorMsg(null);

    try {
      const res = await api.uploadImage(file);
      setPreview(res.secure_url);
      onImageUploaded(res.secure_url);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al subir imagen a Cloudinary.");
      setPreview(defaultImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageUploaded("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      {errorMsg && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {preview ? (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-primary/30 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors"
            title="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs font-bold">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <span>Subiendo a Cloudinary...</span>
            </div>
          )}
          {!uploading && (
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Alojada en Cloudinary CDN</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/40"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-primary shadow-sm border border-border">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-text mb-0.5">Haz clic para subir una foto</p>
          <p className="text-[11px] text-slate-400">JPG, PNG o WEBP (máx. 5 MB) a Cloudinary</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
