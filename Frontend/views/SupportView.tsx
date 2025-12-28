
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

  const handleEmailTechnician = () => {
    const subject = encodeURIComponent(`Suporte SST Pro - Dúvida de ${user.companyName || user.name}`);
    const body = encodeURIComponent(`Olá técnico responsável,\n\nGostaria de suporte para a seguinte questão:\n\n[Descreva sua dúvida aqui]\n\nAtenciosamente,\n${user.name}`);
    window.location.href = `mailto:suporte@sstpro.com.br?subject=${subject}&body=${body}`;
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Suporte Técnico Inteligente</h2>
          <p className="text-slate-400">Tire suas dúvidas sobre NRs e procedimentos em tempo real.</p>
        </div>
        
        {user.role === UserRole.EMPRESA && (
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white uppercase tracking-wider">A IA não resolveu?</p>
              <p className="text-[10px] text-slate-500">Fale com o técnico responsável.</p>
            </div>
            <button 
              onClick={handleEmailTechnician}
              className="bg-slate-700 hover:bg-slate-600 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-500/20 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Enviar E-mail
            </button>
          </div>
        )}
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
