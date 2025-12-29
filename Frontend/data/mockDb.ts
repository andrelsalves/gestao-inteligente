
import { User, UserRole, Company, Appointment } from '../types';

/**
 * TABELA: users
 * Representa a estrutura futura de autenticação.
 * Senhas estão em texto puro apenas para fins de simulação de frontend.
 */
export const mockUsers: (User & { password?: string })[] = [
  {
    id: 'admin_1',
    name: 'Administrador SST',
    email: 'admin@sst.pro',
    password: 'admin',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200'
  },
  {
    id: 'tech_1',
    name: 'Carlos Técnico',
    email: 'carlos@sst.pro',
    password: '123',
    role: UserRole.TECNICO,
    registrationNumber: 'TR-998877',
    avatar: 'https://picsum.photos/seed/tech1/200'
  },
  {
    id: 'tech_2',
    name: 'Ana Segurança',
    email: 'ana@sst.pro',
    password: '123',
    role: UserRole.TECNICO,
    registrationNumber: 'TR-112233',
    avatar: 'https://picsum.photos/seed/tech2/200'
  },
  {
    id: 'comp_1',
    name: 'João Diretor',
    email: 'cliente@empresa.com',
    password: '123',
    role: UserRole.EMPRESA,
    companyName: 'Tech Solutions Ltda',
    avatar: 'https://picsum.photos/seed/company1/200'
  }
];

/**
 * TABELA: companies
 */
export const initialCompanies: Company[] = [
  {
    id: 'comp_1',
    name: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    contactEmail: 'contato@techsolutions.com',
    phone: '(11) 98888-7777',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  {
    id: 'comp_2',
    name: 'Metalúrgica Silva',
    cnpj: '98.765.432/0001-21',
    contactEmail: 'rh@metasilva.com.br',
    phone: '(11) 97777-6666',
    address: 'Rua das Indústrias, 50 - Diadema, SP'
  }
];

/**
 * TABELA: appointments
 */
export const initialAppointments: Appointment[] = [
  {
    id: '1',
    companyId: 'comp_1',
    companyName: 'Tech Solutions Ltda',
    technicianId: 'tech_1',
    date: '2024-09-15',
    time: '09:00',
    status: 'COMPLETED',
    description: 'Inspeção de rotina NR-12'
  },
  {
    id: '2',
    companyId: 'comp_2',
    companyName: 'Metalúrgica Silva',
    technicianId: 'tech_2',
    date: '2024-10-20',
    time: '14:00',
    status: 'CONFIRMED',
    description: 'Renovação de PGR/PCMSO'
  }
];
