
import React, { useState } from 'react';
import { Company } from '../types';
import { Icons } from '../constants';

interface CompaniesListViewProps {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}

const CompaniesListView: React.FC<CompaniesListViewProps> = ({ companies, setCompanies }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Empresas Cadastradas</h2>
          <p className="text-slate-400 mt-1">Gerencie os clientes ativos no sistema.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all">
          <Icons.Plus />
          Cadastrar Empresa
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nome ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(company => (
          <div key={company.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-all group cursor-pointer shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center text-emerald-500">
                <Icons.Buildings />
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </div>
            <h4 className="text-xl font-bold text-white group-hover:text-emerald-500 transition-colors">{company.name}</h4>
            <p className="text-sm text-slate-500 mt-1 font-mono">{company.cnpj}</p>
            
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-700">
               <div className="flex items-center gap-3 text-slate-400 text-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                 {company.contactEmail}
               </div>
               <div className="flex items-center gap-3 text-slate-400 text-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                 {company.phone}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesListView;
