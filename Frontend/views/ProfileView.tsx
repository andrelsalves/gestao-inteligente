
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<User>({ ...user });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto w-full space-y-8 animate-fadeIn py-8 text-center">
      <header className="flex items-center justify-center relative mb-8">
        <h2 className="text-xl font-bold">Perfil do {user.role === UserRole.EMPRESA ? 'Usuário' : 'Técnico'}</h2>
      </header>

      <div className="relative inline-block">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-emerald-500 p-1 bg-slate-800">
          <img 
            src={isEditing ? editData.avatar : user.avatar || `https://picsum.photos/seed/${user.id}/200`} 
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {!isEditing && (
          <div className="absolute bottom-1 right-1 bg-emerald-500 p-2.5 rounded-full shadow-lg border-4 border-slate-900">
            <Icons.Shield />
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 text-left bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">URL da Foto</label>
            <input 
              type="text"
              value={editData.avatar || ''}
              onChange={e => setEditData({...editData, avatar: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
            <input 
              type="text"
              value={editData.name}
              onChange={e => setEditData({...editData, name: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email</label>
            <input 
              type="email"
              value={editData.email}
              onChange={e => setEditData({...editData, email: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          {user.role === UserRole.TECNICO && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Número de Registro</label>
              <input 
                type="text"
                value={editData.registrationNumber || ''}
                onChange={e => setEditData({...editData, registrationNumber: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleCancel}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold transition-all text-sm shadow-lg shadow-emerald-500/20"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-left max-w-sm mx-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nome</p>
            <p className="text-2xl font-bold text-white">{user.name}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
            <p className="text-lg text-slate-300">{user.email}</p>
          </div>

          {user.registrationNumber && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Número de Registro</p>
              <p className="text-lg text-slate-300 font-mono tracking-wider">{user.registrationNumber}</p>
            </div>
          )}

          {user.companyName && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Empresa Vinculada</p>
              <p className="text-lg text-slate-300">{user.companyName}</p>
            </div>
          )}
          
          <div className="pt-6 space-y-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
            >
              Editar Perfil
            </button>
            <button 
              onClick={onLogout}
              className="w-full py-4 bg-slate-800/50 hover:bg-slate-800 text-red-400 font-bold border border-slate-700/50 rounded-2xl transition-all active:scale-95"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
