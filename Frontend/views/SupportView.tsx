
import React, { useState, useRef, useEffect } from 'react';
import { askSupport } from '../services/geminiService';
import { Icons } from '../constants';
import { User, UserRole } from '../types';

interface Message {
  text: string;
  sender: 'USER' | 'AI';
  timestamp: Date;
}

interface SupportViewProps {
  user: User;
}

const SupportView: React.FC<SupportViewProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: `Olá ${user.name}! Sou o assistente de suporte SST Pro. Como posso ajudar você hoje com dúvidas técnicas ou normas regulamentadoras?`, 
      sender: 'AI', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form state for Company Support
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { text: input, sender: 'USER', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await askSupport(input);
    
    const aiMsg: Message = { text: response, sender: 'AI', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSent(false), 3000);
    }, 1200);
  };

  // UI for EMPRESA (Company)
  if (user.role === UserRole.EMPRESA) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-8 animate-fadeIn py-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Central de Atendimento</h2>
          <p className="text-slate-400 mt-1">Sua solicitação será encaminhada diretamente para nossa equipe técnica.</p>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 relative overflow-hidden">
          {isSent && (
            <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Solicitação Enviada!</h3>
              <p className="text-slate-300 text-sm mt-2">Em breve um técnico entrará em contato.</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Assunto</label>
              <input 
                required
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Ex: Dúvida sobre NR-12 ou Agendamento"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mensagem Detalhada</label>
              <textarea 
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Descreva aqui sua dúvida ou solicitação..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all min-h-[150px] resize-none"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3
                ${isSubmitting ? 'bg-slate-700 text-slate-500' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'}
              `}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-slate-500 border-t-emerald-500 rounded-full animate-spin" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50 flex items-center gap-6">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Prefere falar por telefone?</p>
            <p className="text-xs text-slate-500">0800 123 4567 • Atendimento em horário comercial</p>
          </div>
        </div>
      </div>
    );
  }

  // UI for ADMIN/TECNICO (Intelligent Support)
  return (
    <div className="h-full flex flex-col space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Suporte Técnico Inteligente</h2>
          <p className="text-slate-400">Tire suas dúvidas sobre NRs e procedimentos em tempo real.</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                m.sender === 'USER' 
                  ? 'bg-emerald-500 text-slate-900 font-medium rounded-tr-none' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-2 opacity-50 ${m.sender === 'USER' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida sobre normas ou visitas..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 p-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SupportView;
