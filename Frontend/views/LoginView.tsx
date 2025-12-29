
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.EMPRESA);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-fill mock users based on selection for demo purposes if fields are empty
    // but in a real app we'd check credentials
    const isEmpresa = activeRole === UserRole.EMPRESA;
    
    const mockUser: User = {
      id: isEmpresa ? 'comp_user_1' : 'tech_user_1',
      name: isEmpresa ? 'João da Empresa S.A.' : 'Carlos Técnico',
      email: email || (isEmpresa ? 'cliente@empresa.com' : 'admin@sst.pro'),
      role: isEmpresa ? UserRole.EMPRESA : UserRole.TECNICO,
      companyName: isEmpresa ? 'Empresa S.A.' : undefined,
      registrationNumber: !isEmpresa ? 'TR-998877' : undefined,
      avatar: isEmpresa ? 'https://picsum.photos/seed/company/200' : 'https://picsum.photos/seed/tech/200'
    };
    
    onLogin(mockUser);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-[#1e293b] p-4 rounded-2xl mb-4 border border-slate-800">
            <Icons.Shield />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">SST <span className="text-emerald-500">Pro</span></h1>
          <div className="mt-8 w-16 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-emerald-500 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8 text-center animate-fadeIn">
        <div className="bg-[#1e293b] p-4 rounded-2xl mb-6 border border-slate-800 shadow-2xl">
          <Icons.Shield />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">SST Pro</h1>
        <p className="text-slate-400 text-sm font-medium">Gestão integrada de Segurança e Saúde Ocupacional</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-[#111111] border border-slate-800/50 rounded-[32px] p-10 shadow-2xl animate-fadeIn [animation-delay:200ms]">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Switcher Tabs */}
          <div className="flex p-1 bg-[#1a1a1a] rounded-2xl mb-8 border border-slate-800/50">
            <button
              type="button"
              onClick={() => setActiveRole(UserRole.EMPRESA)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeRole === UserRole.EMPRESA ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              EMPRESA
            </button>
            <button
              type="button"
              onClick={() => setActiveRole(UserRole.TECNICO)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeRole === UserRole.TECNICO ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              TÉCNICO
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block ml-1">E-mail corporativo</label>
            <input
              type="email"
              placeholder={activeRole === UserRole.EMPRESA ? "cliente@empresa.com.br" : "admin@sst.pro"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-slate-800 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block ml-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-slate-800 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
            />
            <div className="flex justify-end pt-1">
              <button type="button" className="text-emerald-500 text-[11px] font-bold hover:text-emerald-400 transition-colors uppercase tracking-wider">
                Esqueceu a senha?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] mt-4"
          >
            Entrar na plataforma
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-10 p-5 bg-[#0a0a0a] rounded-2xl border border-slate-800/50 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Ambiente de Demonstração:</p>
          <div className="space-y-2 text-[11px]">
            <p className="text-slate-400 font-medium">
              Use <span className="text-emerald-500 font-bold">admin@sst.pro</span> para visão completa
            </p>
            <p className="text-slate-400 font-medium">
              Use <span className="text-blue-400 font-bold">cliente@empresa.com</span> para visão empresa
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-8 font-medium">
          Protegido por criptografia de ponta a ponta.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
