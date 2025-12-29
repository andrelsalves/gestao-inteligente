
import React, { useState, useEffect } from 'react';
import { Company, User, UserRole } from '../types';
import { Icons } from '../constants';

interface CompaniesListViewProps {
  user: User;
  companies: Company[];
  onAddCompany: (company: Omit<Company, 'id'>) => void;
  onUpdateCompany: (id: string, data: Omit<Company, 'id'>) => void;
  onDeleteCompany: (id: string) => void;
}

const CompaniesListView: React.FC<CompaniesListViewProps> = ({ user, companies, onAddCompany, onUpdateCompany, onDeleteCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const isAdmin = user.role === UserRole.ADMIN;

  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    name: '',
    cnpj: '',
    contactEmail: '',
    phone: '',
    address: ''
  });

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData({ ...formData, cnpj: formatted });
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cnpj.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (editingId) {
      onUpdateCompany(editingId, formData);
    } else {
      onAddCompany(formData);
    }
    closeModal();
  };

  const openEditModal = (company: Company) => {
    if (!isAdmin) return;
    setEditingId(company.id);
    setFormData({
      name: company.name,
      cnpj: company.cnpj,
      contactEmail: company.contactEmail,
      phone: company.phone,
      address: company.address
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', cnpj: '', contactEmail: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {isAdmin ? 'Gerenciar Empresas' : 'Consulta de Clientes'}
          </h2>
          <p className="text-slate-400 mt-1">
            {isAdmin ? 'Controle total sobre o cadastro de empresas parceiras.' : 'Informações de contato e endereço para visitas.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Icons.Plus />
            Cadastrar Empresa
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          type="text" 
          placeholder="Buscar cliente por nome ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(company => (
          <div key={company.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-all group relative shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center text-emerald-500">
                <Icons.Buildings />
              </div>
              {isAdmin && (
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(company)}
                    className="text-slate-500 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-emerald-500/10"
                  >
                    <Icons.Edit />
                  </button>
                  <button 
                    onClick={() => onDeleteCompany(company.id)}
                    className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              )}
            </div>
            <h4 className="text-xl font-bold text-white group-hover:text-emerald-500 transition-colors">{company.name}</h4>
            <p className="text-sm text-slate-500 mt-1 font-mono">{company.cnpj}</p>
            
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-700">
               <div className="flex items-center gap-3 text-slate-400 text-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                 <span className="truncate">{company.contactEmail}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-400 text-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                 {company.phone}
               </div>
               <div className="flex items-start gap-3 text-slate-500 text-[11px] mt-2 italic">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {company.address}
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 animate-fadeIn">
          <div className="bg-slate-800 w-full max-w-lg rounded-3xl border border-slate-700 overflow-hidden shadow-2xl animate-popIn">
            <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-2xl font-bold text-white">{editingId ? 'Editar Empresa' : 'Nova Empresa'}</h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Razão Social</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">CNPJ</label>
                <input 
                  required
                  type="text" 
                  value={formData.cnpj}
                  onChange={handleCNPJChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email</label>
                  <input type="email" required value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Telefone</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Endereço</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none min-h-[80px]" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-slate-900 rounded-xl font-bold shadow-lg shadow-emerald-500/20">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesListView;
