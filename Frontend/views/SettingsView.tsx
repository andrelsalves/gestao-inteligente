
import React, { useState } from 'react';

const SettingsView: React.FC = () => {
  const [permissions, setPermissions] = useState({
    autoApprove: true,
    emailNotifications: true,
    emailReminder24h: true,
    smsNotifications: false,
    allowSupportChat: true,
    dataSharing: false,
  });

  const toggle = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'Notificações',
      desc: 'Configure como o sistema avisa técnicos e empresas.',
      items: [
        { 
          key: 'emailNotifications', 
          label: 'Notificações por Email', 
          desc: 'Habilita o envio de comunicações oficiais por correio eletrônico.' 
        },
        { 
          key: 'emailReminder24h', 
          label: 'Lembrete de 24 horas', 
          desc: 'Enviar um email de lembrete 24 horas antes da visita técnica.',
          parent: 'emailNotifications' 
        },
        { 
          key: 'smsNotifications', 
          label: 'Alertas SMS (Beta)', 
          desc: 'Envio de lembretes via mensagem de texto para o celular do técnico.' 
        },
      ]
    },
    {
      title: 'Fluxo de Trabalho',
      desc: 'Regras de negócio para o processo de agendamento.',
      items: [
        { key: 'autoApprove', label: 'Aprovação Automática', desc: 'Agendamentos em horários livres são confirmados imediatamente.' },
        { key: 'allowSupportChat', label: 'Chat de Suporte IA', desc: 'Habilita o assistente inteligente para dúvidas sobre NRs.' },
      ]
    },
    {
      title: 'Segurança e Privacidade',
      desc: 'Gerencie permissões de dados e acessos externos.',
      items: [
        { key: 'dataSharing', label: 'Compartilhamento de Métricas', desc: 'Enviar relatórios anônimos de conformidade para rede parceira.' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-10 animate-fadeIn pb-12">
      <div>
        <h2 className="text-3xl font-bold">Configurações de Permissões</h2>
        <p className="text-slate-400 mt-1">Personalize o comportamento do sistema para toda a organização.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="text-xl font-bold">{section.title}</h3>
              <p className="text-sm text-slate-500">{section.desc}</p>
            </div>

            <div className="grid gap-4 mt-6">
              {section.items.map(item => {
                // Check if this is a sub-option and if its parent is disabled
                const isSubOption = 'parent' in item;
                const parentEnabled = isSubOption ? permissions[item.parent as keyof typeof permissions] : true;

                if (isSubOption && !parentEnabled) return null;

                return (
                  <div 
                    key={item.key} 
                    onClick={() => toggle(item.key as keyof typeof permissions)}
                    className={`flex items-center justify-between p-6 bg-slate-800 rounded-3xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group shadow-lg
                      ${isSubOption ? 'ml-8 bg-slate-800/50 scale-[0.98]' : ''}
                    `}
                  >
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        {isSubOption && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M9 18l6-6-6-6"/></svg>
                        )}
                        <p className="font-bold text-white group-hover:text-emerald-500 transition-colors">{item.label}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    
                    <div className={`w-14 h-8 rounded-full transition-all relative ${permissions[item.key as keyof typeof permissions] ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${permissions[item.key as keyof typeof permissions] ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-700 flex justify-end gap-4">
        <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all">Descartar</button>
        <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
