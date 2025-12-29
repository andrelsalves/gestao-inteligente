
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSocialLogin = (role: UserRole) => {
    // Mock user based on role selection
    const mockUser: User = {
      id: role === UserRole.EMPRESA ? 'comp_user_1' : 'tech_user_1',
      name: role === UserRole.EMPRESA ? 'João da Empresa S.A.' : 'Carlos Técnico',
      email: role === UserRole.EMPRESA ? 'joao@empresa.com' : 'carlos@sstpro.com',
      role: role,
      companyName: role === UserRole.EMPRESA ? 'Empresa S.A.' : undefined,
      registrationNumber: role !== UserRole.EMPRESA ? 'TR-998877' : undefined,
      avatar: role === UserRole.EMPRESA ? 'https://picsum.photos/seed/company/200' : 'https://picsum.photos/seed/tech/200'
    };
    onLogin(mockUser);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <Icons.Shield />
        <h1 className="text-4xl font-bold mt-4 tracking-tight">SST <span className="text-emerald-500">Pro</span></h1>
        <p className="text-slate-400 mt-2 font-light">Gestão Inteligente</p>
        <div className="mt-12 w-12 h-1 bg-emerald-500 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-white animate-ping" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col justify-between p-8 pb-12">
      <div className="flex flex-col items-center mt-12">
        <div className="scale-125"><Icons.Shield /></div>
        <h1 className="text-4xl font-bold mt-4">SST <span className="text-emerald-500">Pro</span></h1>
      </div>

      <div className="flex flex-col gap-6 items-center text-center">
        <h2 className="text-2xl font-bold leading-tight">
          Gestão integrada de Segurança e Saúde Ocupacional.
        </h2>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => handleSocialLogin(UserRole.EMPRESA)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Entrar como Empresa
          </button>
          
          <button 
            onClick={() => handleSocialLogin(UserRole.TECNICO)}
            className="w-full border-2 border-slate-700 hover:border-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all"
          >
            Entrar como Técnico
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Já tenho uma conta? <button className="text-emerald-500 font-semibold underline">Entrar</button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
