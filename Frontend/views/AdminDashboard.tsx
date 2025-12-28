
import React from 'react';
import { Appointment, Company } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  appointments: Appointment[];
  companies: Company[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, companies, onUpdateStatus }) => {
  const stats = [
    { label: 'Visitas Pendentes', value: appointments.filter(a => a.status === 'PENDING').length, color: 'text-amber-500' },
    { label: 'Visitas Confirmadas', value: appointments.filter(a => a.status === 'CONFIRMED').length, color: 'text-blue-500' },
    { label: 'Empresas Ativas', value: companies.length, color: 'text-emerald-500' },
    { label: 'Total Mês', value: appointments.length, color: 'text-white' },
  ];

  const chartData = [
    { name: 'Seg', visitas: 3 },
    { name: 'Ter', visitas: 5 },
    { name: 'Qua', visitas: 2 },
    { name: 'Qui', visitas: 7 },
    { name: 'Sex', visitas: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PENDING': return 'bg-amber-500';
      case 'COMPLETED': return 'bg-emerald-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Olá, <span className="text-emerald-500">Administrador</span></h2>
          <p className="text-slate-400 mt-1">Veja o que está acontecendo hoje em SST.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 p-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20">
          <Icons.Plus />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg h-[400px]">
          <h3 className="text-lg font-bold mb-6">Volume de Visitas (Semana)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                cursor={{ fill: '#334155' }}
              />
              <Bar dataKey="visitas" fill="#10b981" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Column */}
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-bold mb-6">Gerenciar Agendamentos</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {appointments.map(app => (
              <div key={app.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-2xl transition-all border border-slate-700">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {app.time.split(':')[0]}h
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{app.companyName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{app.date}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                   <select 
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as Appointment['status'])}
                    className={`text-[10px] font-black rounded-lg px-2 py-1 bg-slate-800 border-none outline-none cursor-pointer uppercase tracking-tight
                      ${app.status === 'CONFIRMED' ? 'text-blue-500' : 
                        app.status === 'PENDING' ? 'text-amber-500' : 
                        app.status === 'COMPLETED' ? 'text-emerald-500' : 'text-red-500'}
                    `}
                   >
                     <option value="PENDING">Pendente</option>
                     <option value="CONFIRMED">Confirmado</option>
                     <option value="COMPLETED">Concluído</option>
                     <option value="CANCELLED">Cancelado</option>
                   </select>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
            Ver agenda completa
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
