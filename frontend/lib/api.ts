import {
  Usuario,
  Mascota,
  Sede,
  Disponibilidad,
  Cita,
  ChatConversacion,
  ChatBotResponse,
  HistorialClinico
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("petcare_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("petcare_token", token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("petcare_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("petcare_token");
      localStorage.removeItem("petcare_user");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Ocurrió un error en la solicitud";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // --- Auth ---
  async login(correo_electronico: string, password: string):Promise<{ access_token: string; usuario: Usuario }> {
    const data = await this.request<{ access_token: string; usuario: Usuario }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo_electronico, password }),
    });
    this.setToken(data.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("petcare_user", JSON.stringify(data.usuario));
    }
    return data;
  }

  async register(data: { nombre: string; apellido: string; correo_electronico: string; password: string; telefono?: string }): Promise<{ access_token: string; usuario: Usuario }> {
    const res = await this.request<{ access_token: string; usuario: Usuario }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("petcare_user", JSON.stringify(res.usuario));
    }
    return res;
  }

  async getMe(): Promise<Usuario> {
    return this.request<Usuario>("/auth/me");
  }

  // --- Mascotas ---
  async getMascotas(): Promise<Mascota[]> {
    return this.request<Mascota[]>("/mascotas");
  }

  async getMascota(id: number): Promise<Mascota> {
    return this.request<Mascota>(`/mascotas/${id}`);
  }

  async createMascota(data: {
    nombre: string;
    especie: string;
    sexo: string;
    fecha_nacimiento: string;
    datos_identificatorios?: string;
    imagen_url?: string;
  }): Promise<Mascota> {
    return this.request<Mascota>("/mascotas", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --- Agenda y Citas ---
  async getSedes(): Promise<Sede[]> {
    return this.request<Sede[]>("/agenda/sedes");
  }

  async getDisponibilidad(sedeId: number, fecha?: string): Promise<Disponibilidad[]> {
    const query = new URLSearchParams({ sede_id: sedeId.toString() });
    if (fecha) query.append("fecha", fecha);
    return this.request<Disponibilidad[]>(`/agenda/disponibilidad?${query.toString()}`);
  }

  async getCitas(): Promise<Cita[]> {
    return this.request<Cita[]>("/citas");
  }

  async createCita(data: {
    id_mascota: number;
    id_sede: number;
    id_disponibilidad: number;
    motivo_consulta: string;
  }): Promise<Cita> {
    return this.request<Cita>("/citas", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async cancelarCita(citaId: number): Promise<Cita> {
    return this.request<Cita>(`/citas/${citaId}/cancelar`, {
      method: "PUT",
    });
  }

  // --- Chat Inteligente Gemini ---
  async createOrGetConversation(id_mascota: number): Promise<ChatConversacion> {
    return this.request<ChatConversacion>("/chat/conversaciones", {
      method: "POST",
      body: JSON.stringify({ id_mascota }),
    });
  }

  async getConversation(id: number): Promise<ChatConversacion> {
    return this.request<ChatConversacion>(`/chat/conversaciones/${id}`);
  }

  async sendMessage(conversacionId: number, contenido: string): Promise<ChatBotResponse> {
    return this.request<ChatBotResponse>(`/chat/conversaciones/${conversacionId}/mensajes`, {
      method: "POST",
      body: JSON.stringify({ contenido }),
    });
  }

  // --- Historial Clínico ---
  async getHistorial(mascotaId: number): Promise<HistorialClinico> {
    return this.request<HistorialClinico>(`/historial/${mascotaId}`);
  }

  // --- Cloudinary ---
  async uploadImage(file: File): Promise<{ secure_url: string; public_id: string; provider: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ secure_url: string; public_id: string; provider: string }>("/cloudinary/upload", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiService();
