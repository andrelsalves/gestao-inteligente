
import React, { useState } from 'react';
import { Appointment, User, UserRole, Company } from '../types';
import { Icons } from '../constants';

interface HistoryViewProps {
  appointments: Appointment[];
  companies: Company[];
  user: User;
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ appointments, companies, user, onDelete }) => {
  const [itemToDelete, setItemToDelete] = useState<Appointment | null>(null);
  const [itemForDetails, setItemForDetails] = useState<Appointment | null>(null);

  const filtered = user.role === UserRole.EMPRESA 
    ? appointments.filter(a => a.companyId === user.id)
    : appointments;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const selectedCompany = itemForDetails ? companies.find(c => c.id === itemForDetails.companyId) : null;

  return (
    <div className="space-y-8 animate-fadeIn relative min-h-[600px]">
      <header>
        <h2 className="text-3xl font-bold text-white">
          {user.role === UserRole.EMPRESA ? 'Meus Agendamentos' : 'Histórico Global'}
        </h2>
        <p className="text-slate-400 mt-1">Visualize e gerencie o histórico de visitas técnicas.</p>
      </header>

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/60 transition-all">
          <div className="bg-slate-800 w-full max-w-sm rounded-3xl border border-slate-700 p-8 shadow-2xl animate-popIn">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Excluir Agendamento?</h3>
            <p className="text-slate-400 text-center text-sm mb-8">
              Tem certeza que deseja remover a visita agendada para <strong>{itemToDelete.companyName}</strong> em {itemToDelete.date}? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {itemForDetails && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/60 transition-all">
          <div className="bg-slate-800 w-full max-w-lg rounded-3xl border border-slate-700 overflow-hidden shadow-2xl animate-popIn">
            <div className="p-8 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Detalhes da Visita</h3>
              <button onClick={() => setItemForDetails(null)} className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Data</p>
                  <p className="text-lg font-bold text-white">{itemForDetails.date}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Horário</p>
                  <p className="text-lg font-bold text-white">{itemForDetails.time}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Empresa Solicitante</p>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-lg font-bold text-emerald-500">{itemForDetails.companyName}</p>
                  {selectedCompany && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-300">CNPJ: <span className="text-white font-mono">{selectedCompany.cnpj}</span></p>
                      <p className="text-sm text-slate-300">Endereço: <span className="text-white">{selectedCompany.address}</span></p>
                      <p className="text-sm text-slate-300">Contato: <span className="text-white">{selectedCompany.phone}</span></p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Responsável Técnico</p>
                <div className="flex items-center gap-3 bg-slate-700/30 p-4 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 font-bold">CT</div>
                  <div>
                    <p className="text-sm font-bold text-white">Carlos Técnico (TR-998877)</p>
                    <p className="text-xs text-slate-500">Engenheiro de Segurança do Trabalho</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Descrição / Observações</p>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 italic text-slate-300 text-sm">
                  "{itemForDetails.description || 'Sem observações adicionais.'}"
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border shadow-sm ${getStatusStyle(itemForDetails.status)}`}>
                  Status: {itemForDetails.status}
                </span>
              </div>
            </div>
            <div className="p-6 bg-slate-900/30 border-t border-slate-700 flex justify-end">
              <button 
                onClick={() => setItemForDetails(null)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-xs">Data/Hora</th>
                <th className="px-6 py-4 text-xs">Empresa</th>
                <th className="px-6 py-4 text-xs">Descrição</th>
                <th className="px-6 py-4 text-xs">Status</th>
                <th className="px-6 py-4 text-xs text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-slate-700/30 transition-all group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-sm font-bold text-white">{app.date}</p>
                    <p className="text-xs text-slate-500 font-mono">{app.time}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors">{app.companyName}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-400 truncate max-w-[200px]">{app.description || '-'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setItemToDelete(app)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                        title="Excluir Agendamento"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                      <button 
                        onClick={() => setItemForDetails(app)}
                        className="text-emerald-500 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                        <Icons.History />
                      </div>
                      <p>Nenhum agendamento encontrado no seu histórico.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-popIn {
          animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default HistoryView;
