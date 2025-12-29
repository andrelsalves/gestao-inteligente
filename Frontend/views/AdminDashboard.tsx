
import React, { useState, useMemo } from 'react';
import { Appointment, Company, User, UserRole } from '../types';
import { Icons } from '../constants';
import DashboardStats from '../components/DashboardStats';
import DashboardChart from '../components/DashboardChart';
import DashboardAppointments from '../components/DashboardAppointments';

interface AdminDashboardProps {
  user: User;
  appointments: Appointment[];
  companies: Company[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  pendingAlerts: string[];
  onClearAlerts: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, appointments, companies, onUpdateStatus, pendingAlerts, onClearAlerts }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Filtragem de dados por LGPD e Segurança
  const isTech = user.role === UserRole.TECNICO;
  
  const filteredAppointments = useMemo(() => {
    if (isTech) return appointments.filter(a => a.technicianId === user.id);
    return appointments;
  }, [appointments, user.id, isTech]);

  const stats = useMemo(() => [
    { 
      label: isTech ? 'Minhas Pendentes' : 'Visitas Pendentes', 
      value: filteredAppointments.filter(a => a.status === 'PENDING').length, 
      color: 'text-amber-500' 
    },
    { 
      label: isTech ? 'Confirmadas p/ Mim' : 'Visitas Confirmadas', 
      value: filteredAppointments.filter(a => a.status === 'CONFIRMED').length, 
      color: 'text-blue-500' 
    },
    { 
      label: isTech ? 'Clientes Visitados' : 'Empresas Ativas', 
      value: isTech ? [...new Set(filteredAppointments.map(a => a.companyId))].length : companies.length, 
      color: 'text-emerald-500' 
    },
    { 
      label: 'Total no Mês', 
      value: filteredAppointments.length, 
      color: 'text-white' 
    },
  ], [isTech, filteredAppointments, companies.length]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center relative">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Olá, <span className="text-emerald-500">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400 mt-1">
            {isTech ? 'Aqui está sua agenda de visitas técnica personalizada.' : 'Painel de controle global do sistema SST.'}
          </p>
        </div>
        
        {user.role === UserRole.ADMIN && (
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 p-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 relative"
            >
              <Icons.Bell />
              {pendingAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                  {pendingAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl z-50 p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white">Notificações</h4>
                  <button onClick={onClearAlerts} className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider hover:text-emerald-400">Limpar tudo</button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {pendingAlerts.length > 0 ? pendingAlerts.map((alert, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/50 rounded-xl text-xs text-slate-300 border-l-4 border-emerald-500">
                      {alert}
                    </div>
                  )) : (
                    <p className="text-slate-500 text-center text-sm py-4 italic">Sem novas notificações.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart data={filteredAppointments} />
        </div>
        <div>
          <DashboardAppointments appointments={filteredAppointments} onUpdateStatus={onUpdateStatus} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
