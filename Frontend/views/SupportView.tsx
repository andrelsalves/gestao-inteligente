
import React, { useState, useRef, useEffect } from 'react';
import { askSupport } from '../services/geminiService';
import { Icons } from '../constants';

interface Message {
  text: string;
  sender: 'USER' | 'AI';
  timestamp: Date;
}

const SupportView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Sou o assistente de suporte SST Pro. Como posso ajudar você hoje com dúvidas técnicas ou normas regulamentadoras?", sender: 'AI', timestamp: new Date() }
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

  return (
    <div className="h-full flex flex-col space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold">Suporte Técnico Inteligente</h2>
        <p className="text-slate-400">Tire suas dúvidas sobre NRs e procedimentos em tempo real.</p>
      </div>

      <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                m.sender === 'USER' 
                  ? 'bg-emerald-500 text-slate-900 font-medium rounded-tr-none' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{m.text}</p>
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
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 p-3 rounded-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
