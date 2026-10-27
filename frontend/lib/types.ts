export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono?: string;
  roles: string[];
  fecha_registro: string;
}

export interface Mascota {
  id: number;
  id_propietario: number;
  nombre: string;
  especie: string;
  sexo: string;
  fecha_nacimiento: string;
  datos_identificatorios?: string;
  imagen_url?: string;
  fecha_registro: string;
}

export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  activa: boolean;
  es_una_de_dos_sedes: boolean;
}

export interface Disponibilidad {
  id: number;
  id_agenda: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  ocupado: boolean;
}

export interface Cita {
  id: number;
  id_mascota: number;
  id_propietario: number;
  id_sede: number;
  id_veterinario?: number;
  id_agenda: number;
  id_disponibilidad: number;
  fecha_cita: string;
  hora_cita: string;
  motivo_consulta: string;
  estado: string;
  fecha_solicitud: string;
  fecha_confirmacion?: string;
  sede_nombre?: string;
  mascota_nombre?: string;
}

export interface ChatMensaje {
  id: number;
  id_conversacion: number;
  remitente: "usuario" | "asistente" | "sistema";
  contenido: string;
  fecha_envio: string;
  contiene_informacion_clinica: boolean;
  es_orientacion_inicial: boolean;
  metadatos_json?: string;
}

export interface ChatConversacion {
  id: number;
  id_usuario: number;
  id_mascota: number;
  id_cita?: number;
  fecha_inicio: string;
  fecha_ultima_actividad: string;
  estado: string;
  urgencia_detectada: boolean;
  clasificacion_urgencia?: string;
  derivacion_requerida: boolean;
  mensajes: ChatMensaje[];
}

export interface ChatBotResponse {
  mensaje_asistente: ChatMensaje;
  urgencia_detectada: boolean;
  clasificacion_urgencia?: string;
  recomienda_valoracion: boolean;
  widget_agendamiento?: {
    tipo: string;
    id_mascota: number;
    nombre_mascota: string;
    sedes_disponibles: { id: number; nombre: string }[];
  } | null;
}

export interface Vacuna {
  id: number;
  id_mascota: number;
  nombre_vacuna: string;
  fecha_aplicacion: string;
  fecha_proxima_recomendada?: string;
  lote?: string;
  dosis?: string;
}

export interface Desparasitacion {
  id: number;
  id_mascota: number;
  tipo_tratamiento: string;
  producto: string;
  fecha_tratamiento: string;
  fecha_proxima_recomendada?: string;
}

export interface ConsultaVeterinaria {
  id: number;
  id_historial: number;
  id_mascota: number;
  id_veterinario: number;
  id_sede?: number;
  fecha_consulta: string;
  motivo_consulta: string;
  diagnostico_registrado: string;
  observaciones?: string;
}

export interface HistorialClinico {
  id: number;
  id_mascota: number;
  id_propietario: number;
  fecha_creacion: string;
  observaciones_generales?: string;
  consultas: ConsultaVeterinaria[];
  vacunas: Vacuna[];
  desparasitaciones: Desparasitacion[];
}
