// ===== Auth Types =====
export interface User {
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'ORGANIZER' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

// ===== Event Types =====
export type EventType = 'boda' | 'quinceañero' | 'empresarial' | 'social' | 'conferencia';
export type EventStatus = 'activo' | 'borrador' | 'completado' | 'cancelado';

export interface NexEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  capacity: number;
  budget: number;
  budgetUsed: number;
  status: EventStatus;
  location: string;
  description?: string;
  guestsConfirmed: number;
  guestsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  coverImage?: string;
}

// ===== Chronogram Types =====
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface ChronogramMilestone {
  id: string;
  label: string;
  period: string;
  tasks: ChronogramTask[];
}

export interface ChronogramTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string;
}

// ===== Venue Types =====
export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  category: string;
  amenities: string[];
  images: string[];
  availability: VenueAvailability[];
}

export interface VenueAvailability {
  date: string;
  available: boolean;
}

export interface VenueReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// ===== Guest Types =====
export type RSVPStatus = 'confirmado' | 'pendiente' | 'rechazado';
export type GuestGroup = 'familia' | 'amigos' | 'trabajo' | 'otros';
export type EntryStatus = 'ingresado' | 'pendiente' | 'no_asistira';

export interface Guest {
  id: string;
  eventId: string;      // vincula el invitado a un evento específico
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: RSVPStatus;
  group?: GuestGroup;   // clasificación del invitado
  invitationDate?: string; // fecha en que se envió la invitación
  table?: string;
  plusOne?: boolean;
  notes?: string;
  entryStatus?: EntryStatus; // estado de ingreso en puerta
  entryTime?: string;        // hora de ingreso en puerta
}

// Resumen del evento al que pertenece la lista de invitados
export interface GuestEventSummary {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface CreateEventRequest {
  name: string;
  type: string;
  eventDate: string;
  capacity: number;
  location: string;
  description: string;
  status: string;
  budget: number;
  coverImage?: string;
}
