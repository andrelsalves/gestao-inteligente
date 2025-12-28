
import React from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-md mx-auto w-full space-y-12 animate-fadeIn py-8 text-center">
      <header className="flex items-center justify-center relative mb-12">
        <button className="absolute left-0 p-2 hover:bg-slate-800 rounded-full transition-colors">
          <Icons.ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">Perfil do {user.role === UserRole.EMPRESA ? 'Usuário' : 'Técnico'}</h2>
      </header>

      <div className="relative inline-block">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-500 p-1">
          <img 
            src={user.avatar || `https://picsum.photos/seed/${user.id}/200`} 
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-2 right-2 bg-emerald-500 p-3 rounded-full shadow-lg border-4 border-slate-900">
          <Icons.Shield />
        </div>
      </div>

      <div className="space-y-6 text-left max-w-sm mx-auto">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nome</p>
          <p className="text-2xl font-bold text-white">{user.name}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
          <p className="text-lg text-slate-300">{user.email}</p>
        </div>

        {user.registrationNumber && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Número de Registro</p>
            <p className="text-lg text-slate-300 font-mono tracking-wider">{user.registrationNumber}</p>
          </div>
        )}

        {user.companyName && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Empresa Vinculada</p>
            <p className="text-lg text-slate-300">{user.companyName}</p>
          </div>
        )}
      </div>

      <div className="pt-12 space-y-4">
        <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/10">
          Editar Perfil
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 rounded-2xl transition-all"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
