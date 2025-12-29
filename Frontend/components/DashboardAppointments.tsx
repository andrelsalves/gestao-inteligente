
import React from 'react';
import { Appointment } from '../types';

interface DashboardAppointmentsProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

const statusInfo: Record<Appointment['status'], { label: string; description: string; color: string }> = {
  PENDING: { 
    label: 'Pendente', 
    description: 'Pendente - Aguardando confirmação do técnico', 
    color: 'text-amber-500 border-amber-500/30' 
  },
  CONFIRMED: { 
    label: 'Confirmado', 
    description: 'Confirmado - Visita agendada e técnico escalado', 
    color: 'text-blue-500 border-blue-500/30' 
  },
  COMPLETED: { 
    label: 'Concluído', 
    description: 'Concluído - Visita realizada e relatório emitido', 
    color: 'text-emerald-500 border-emerald-500/30' 
  },
  CANCELLED: { 
    label: 'Cancelado', 
    description: 'Cancelado - Agendamento removido', 
    color: 'text-red-500 border-red-500/30' 
  },
};

const DashboardAppointments: React.FC<DashboardAppointmentsProps> = ({ appointments, onUpdateStatus }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold mb-6 text-white">Controle de Agendamentos</h3>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {appointments.length > 0 ? appointments.map(app => (
          <div key={app.id} className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-2xl border border-slate-700 transition-all hover:border-slate-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{app.date.split('-')[2]}</span>
                <span className="text-sm font-black text-white">{app.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{app.companyName}</p>
                <div className="relative inline-block group">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border cursor-help ${statusInfo[app.status].color}`}>
                    {statusInfo[app.status].label}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 animate-fadeIn">
                    <div className="bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg border border-slate-700 shadow-2xl whitespace-nowrap font-medium">
                      {statusInfo[app.status].description}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-700/50">
              {app.status === 'PENDING' && (
                <button 
                  onClick={() => onUpdateStatus(app.id, 'CONFIRMED')}
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider"
                >
                  Confirmar
                </button>
              )}
              {app.status === 'CONFIRMED' && (
                <button 
                  onClick={() => onUpdateStatus(app.id, 'COMPLETED')}
                  className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider"
                >
                  Concluir
                </button>
              )}
              {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                <button 
                  onClick={() => onUpdateStatus(app.id, 'CANCELLED')}
                  className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider"
                >
                  Cancelar
                </button>
              )}
              {app.status === 'CANCELLED' && (
                <button 
                  onClick={() => onUpdateStatus(app.id, 'PENDING')}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider"
                >
                  Reabrir
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p className="text-sm italic">Nenhum agendamento ativo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAppointments;
