
export enum UserRole {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  EMPRESA = 'EMPRESA'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationNumber?: string;
  companyName?: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  companyId: string;
  companyName: string;
  technicianId: string;
  date: string; // ISO format
  time: string; // HH:mm format
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  contactEmail: string;
  phone: string;
  address: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
