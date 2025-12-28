
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Appointment, Company } from './types';
import LoginView from './views/LoginView';
import SchedulingView from './views/SchedulingView';
import AdminDashboard from './views/AdminDashboard';
import ProfileView from './views/ProfileView';
import SupportView from './views/SupportView';
import SettingsView from './views/SettingsView';
import HistoryView from './views/HistoryView';
import CompaniesListView from './views/CompaniesListView';
import { Icons } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      companyId: 'comp1',
      companyName: 'Tech Solutions Ltda',
      technicianId: 'tech1',
      date: '2024-09-15',
      time: '09:00',
      status: 'COMPLETED',
      description: 'Inspeção de rotina NR-12'
    },
    {
      id: '2',
      companyId: 'comp2',
      companyName: 'Metalúrgica Silva',
      technicianId: 'tech1',
      date: '2024-10-20',
      time: '14:00',
      status: 'CONFIRMED',
      description: 'Renovação de PPRA/PCMSO'
    }
  ]);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 'comp1',
      name: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      contactEmail: 'contato@techsolutions.com',
      phone: '(11) 98888-7777',
      address: 'Av. Paulista, 1000 - São Paulo, SP'
    },
    {
      id: 'comp2',
      name: 'Metalúrgica Silva',
      cnpj: '98.765.432/0001-21',
      contactEmail: 'rh@metasilva.com.br',
      phone: '(11) 97777-6666',
      address: 'Rua das Indústrias, 50 - Diadema, SP'
    }
  ]);

  const [notifications, setNotifications] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (notifications) {
      const timer = setTimeout(() => setNotifications(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentView(u.role === UserRole.EMPRESA ? 'SCHEDULING' : 'DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('LOGIN');
  };

  const addAppointment = (newApp: Omit<Appointment, 'id' | 'status'>) => {
    const appointment: Appointment = {
      ...newApp,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING'
    };
    setAppointments(prev => [appointment, ...prev]);
    setNotifications({ 
      message: `Agendamento realizado com sucesso para ${newApp.date}! Um e-mail foi enviado ao técnico responsável.`, 
      type: 'success' 
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setNotifications({ 
      message: 'Agendamento removido com sucesso.', 
      type: 'success' 
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    setNotifications({ 
      message: `Status do agendamento atualizado para ${status}.`, 
      type: 'success' 
    });
  };

  const renderView = () => {
    if (!user) return <LoginView onLogin={handleLogin} />;

    switch (currentView) {
      case 'DASHBOARD':
        return user.role === UserRole.EMPRESA ? 
          <SchedulingView user={user} onSchedule={addAppointment} /> : 
          <AdminDashboard appointments={appointments} companies={companies} onUpdateStatus={updateAppointmentStatus} />;
      case 'SCHEDULING':
        return <SchedulingView user={user} onSchedule={addAppointment} />;
      case 'HISTORY':
        return <HistoryView appointments={appointments} companies={companies} user={user} onDelete={deleteAppointment} />;
      case 'COMPANIES':
        return <CompaniesListView companies={companies} setCompanies={setCompanies} />;
      case 'SUPPORT':
        return <SupportView />;
      case 'SETTINGS':
        return <SettingsView />;
      case 'PROFILE':
        return <ProfileView user={user} onLogout={handleLogout} />;
      default:
        return <AdminDashboard appointments={appointments} companies={companies} onUpdateStatus={updateAppointmentStatus} />;
    }
  };

  const menuItems = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.EMPRESA) {
      return [
        { id: 'SCHEDULING', label: 'Agendar', icon: <Icons.Calendar /> },
        { id: 'HISTORY', label: 'Meus Agendamentos', icon: <Icons.History /> },
        { id: 'PROFILE', label: 'Meu Perfil', icon: <Icons.User /> },
      ];
    }
    return [
      { id: 'DASHBOARD', label: 'Painel', icon: <Icons.Dashboard /> },
      { id: 'HISTORY', label: 'Histórico', icon: <Icons.History /> },
      { id: 'COMPANIES', label: 'Empresas', icon: <Icons.Buildings /> },
      { id: 'SUPPORT', label: 'Suporte', icon: <Icons.Support /> },
      { id: 'SETTINGS', label: 'Ajustes', icon: <Icons.Settings /> },
      { id: 'PROFILE', label: 'Perfil', icon: <Icons.User /> },
    ];
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto md:max-w-none md:flex-row bg-[#0f172a]">
      {/* Notifications */}
      {notifications && (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 p-4 rounded-xl shadow-2xl z-[100] transition-all transform animate-bounce ${notifications.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <p className="font-semibold text-sm">{notifications.message}</p>
        </div>
      )}

      {/* Desktop Sidebar */}
      {user && (
        <aside className="hidden md:flex flex-col w-64 bg-[#1e293b] border-r border-slate-700 h-screen sticky top-0 p-6">
          <div className="flex items-center gap-2 mb-10">
            <Icons.Shield />
            <h1 className="text-2xl font-bold text-white">SST <span className="text-emerald-500">Pro</span></h1>
          </div>
          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id ? 'bg-emerald-500/10 text-emerald-500 font-semibold' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-700 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={user.avatar || `https://picsum.photos/seed/${user.id}/40`} className="w-10 h-10 rounded-full border-2 border-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-white truncate w-32">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 text-sm hover:text-red-400 transition-colors">Sair da conta</button>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {user && (
        <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-slate-700 sticky top-0 z-40">
           <div className="flex items-center gap-2">
            <div className="scale-50 origin-left"><Icons.Shield /></div>
            <h1 className="text-lg font-bold text-white">SST <span className="text-emerald-500">Pro</span></h1>
          </div>
          <button onClick={() => setCurrentView('PROFILE')} className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500 transition-all active:scale-95">
             <img src={user.avatar || `https://picsum.photos/seed/${user.id}/40`} className="w-full h-full object-cover" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {renderView()}
      </main>

      {/* Mobile Bottom Nav */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b]/90 backdrop-blur-md border-t border-slate-700 px-6 py-3 flex justify-between items-center z-40">
          {menuItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${currentView === item.id ? 'text-emerald-500' : 'text-slate-400'}`}
            >
              <span className="scale-90">{item.icon}</span>
              <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
