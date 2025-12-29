
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
import { initialAppointments, initialCompanies, mockUsers } from './data/mockDb';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');
  
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  
  const technicians = useMemo(() => mockUsers.filter(u => u.role === UserRole.TECNICO), []);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('sst_pro_settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
      }
    }
    return {
      autoApprove: false,
      emailNotifications: true,
      emailReminder24h: true,
      smsNotifications: false,
      allowSupportChat: true,
      dataSharing: false,
    };
  });

  const [notifications, setNotifications] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [pendingAlerts, setPendingAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (notifications) {
      const timer = setTimeout(() => setNotifications(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleLogin = (u: User) => {
    setUser(u);
    // Redirecionamento inicial baseado no papel
    if (u.role === UserRole.EMPRESA) setCurrentView('SCHEDULING');
    else setCurrentView('DASHBOARD');
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
    setPendingAlerts(prev => [`Novo agendamento: ${newApp.companyName}`, ...prev]);
    setNotifications({ message: `Solicitação enviada com sucesso!`, type: 'success' });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setNotifications({ message: 'Agendamento removido.', type: 'success' });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    setNotifications({ message: `Status atualizado.`, type: 'success' });
  };

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('sst_pro_settings', JSON.stringify(newSettings));
  };

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = { ...company, id: Math.random().toString(36).substr(2, 9) };
    setCompanies(prev => [...prev, newCompany]);
    setNotifications({ message: 'Empresa cadastrada!', type: 'success' });
  };

  const updateCompany = (id: string, data: Omit<Company, 'id'>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...data, id } : c));
    setNotifications({ message: 'Empresa atualizada!', type: 'success' });
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    setNotifications({ message: 'Empresa removida.', type: 'success' });
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setNotifications({ message: 'Perfil atualizado!', type: 'success' });
  };

  const renderView = () => {
    if (!user) return <LoginView onLogin={handleLogin} />;

    switch (currentView) {
      case 'DASHBOARD':
        return user.role === UserRole.EMPRESA ? 
          <SchedulingView user={user} appointments={appointments} onSchedule={addAppointment} /> : 
          <AdminDashboard 
            user={user}
            appointments={appointments} 
            companies={companies} 
            onUpdateStatus={updateAppointmentStatus} 
            pendingAlerts={pendingAlerts}
            onClearAlerts={() => setPendingAlerts([])}
          />;
      case 'SCHEDULING':
        return <SchedulingView user={user} appointments={appointments} onSchedule={addAppointment} />;
      case 'HISTORY':
        return <HistoryView appointments={appointments} companies={companies} technicians={technicians} user={user} onDelete={deleteAppointment} />;
      case 'COMPANIES':
        return <CompaniesListView user={user} companies={companies} onAddCompany={addCompany} onUpdateCompany={updateCompany} onDeleteCompany={deleteCompany} />;
      case 'SUPPORT':
        return <SupportView user={user} />;
      case 'SETTINGS':
        return user.role === UserRole.ADMIN ? 
          <SettingsView settings={settings} onUpdateSettings={updateSettings} onNavigate={(view) => setCurrentView(view)} /> :
          <AdminDashboard user={user} appointments={appointments} companies={companies} onUpdateStatus={updateAppointmentStatus} pendingAlerts={pendingAlerts} onClearAlerts={() => setPendingAlerts([])} />;
      case 'PROFILE':
        return <ProfileView user={user} onLogout={handleLogout} onUpdateProfile={updateUserProfile} />;
      default:
        return <AdminDashboard user={user} appointments={appointments} companies={companies} onUpdateStatus={updateAppointmentStatus} pendingAlerts={pendingAlerts} onClearAlerts={() => setPendingAlerts([])} />;
    }
  };

  const menuItems = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.EMPRESA) {
      return [
        { id: 'SCHEDULING', label: 'Agendar', icon: <Icons.Calendar /> },
        { id: 'HISTORY', label: 'Meus Agendamentos', icon: <Icons.History /> },
        { id: 'SUPPORT', label: 'Suporte', icon: <Icons.Support /> },
        { id: 'PROFILE', label: 'Meu Perfil', icon: <Icons.User /> },
      ];
    }
    
    const items = [
      { id: 'DASHBOARD', label: user.role === UserRole.ADMIN ? 'Painel' : 'Minha Agenda', icon: <Icons.Dashboard /> },
      { id: 'HISTORY', label: user.role === UserRole.ADMIN ? 'Histórico' : 'Minhas Visitas', icon: <Icons.History /> },
      { id: 'COMPANIES', label: user.role === UserRole.ADMIN ? 'Empresas' : 'Clientes', icon: <Icons.Buildings /> },
      { id: 'SUPPORT', label: 'Suporte IA', icon: <Icons.Support /> },
    ];

    if (user.role === UserRole.ADMIN) {
      items.push({ id: 'SETTINGS', label: 'Ajustes', icon: <Icons.Settings /> });
    }

    items.push({ id: 'PROFILE', label: 'Perfil', icon: <Icons.User /> });
    return items;
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto md:max-w-none md:flex-row bg-[#0f172a]">
      {notifications && (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 p-4 rounded-xl shadow-2xl z-[100] transition-all transform animate-bounce ${notifications.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <p className="font-semibold text-sm">{notifications.message}</p>
        </div>
      )}

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
              <img src={user.avatar || `https://picsum.photos/seed/${user.id}/40`} className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover" />
              <div>
                <p className="text-sm font-semibold text-white truncate w-32">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 text-sm hover:text-red-400 transition-colors">Sair da conta</button>
          </div>
        </aside>
      )}

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

      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {renderView()}
      </main>

      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b]/90 backdrop-blur-md border-t border-slate-700 px-6 py-3 flex justify-between items-center z-40 overflow-x-auto no-scrollbar">
          <div className="flex justify-between items-center w-full min-w-max gap-8 px-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${currentView === item.id ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <span className="scale-75">{item.icon}</span>
                <span className="text-[9px] font-medium uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
