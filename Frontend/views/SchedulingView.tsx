
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Appointment } from '../types';
import { Icons } from '../constants';
import Calendar from '../components/Calendar';

interface SchedulingViewProps {
  user: User;
  appointments: Appointment[];
  onSchedule: (app: Omit<Appointment, 'id' | 'status'>) => void;
}

const VISIT_REASONS = [
  'Renovação de PGR/PCMSO',
  'Inspeção de Segurança',
  'Treinamentos',
  'Nova Avaliação de Riscos',
  'Outros'
];

const SchedulingView: React.FC<SchedulingViewProps> = ({ user, appointments, onSchedule }) => {
  const [viewDate, setViewDate] = useState(new Date(2024, 8, 1)); // Sept 2024
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvailability = (day: number) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
    if (isWeekend) return 'NONE';
    
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const appsOnDay = appointments.filter(a => a.date === dateStr && a.status !== 'CANCELLED');
    
    if (appsOnDay.length >= 6) return 'NONE';
    if (appsOnDay.length >= 3) return 'LIMITED';
    return 'FULL';
  };

  const allTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const availableTimes = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    const bookedTimes = appointments
      .filter(a => a.date === dateStr && a.status !== 'CANCELLED')
      .map(a => a.time);
    
    return allTimes.filter(t => !bookedTimes.includes(t));
  }, [selectedDay, viewDate, appointments]);

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime || !selectedReason) return;
    const finalDescription = `${selectedReason}${description ? ' - ' + description.trim() : ''}`;
    
    onSchedule({
      companyId: user.id,
      companyName: user.companyName || user.name,
      technicianId: 'tech_1', // Atribuição inicial para o técnico Carlos (Simulado)
      date: `${viewDate.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`,
      time: selectedTime,
      description: finalDescription
    });
    setSelectedDay(null);
    setSelectedTime(null);
    setSelectedReason(null);
    setDescription('');
  };

  const month = viewDate.getMonth();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn pb-12">
      <header>
        <h2 className="text-2xl font-bold text-white">Agendar Visita Técnica</h2>
        <p className="text-slate-400 text-sm">Empresa: <span className="text-emerald-500 font-semibold">{user.companyName || user.name}</span></p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1">
          <Calendar 
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setSelectedTime(null);
            }}
            getAvailability={getAvailability}
          />
        </div>

        <div className={`w-full lg:w-72 bg-[#1e293b] rounded-3xl p-6 shadow-xl border border-slate-700/50 self-stretch transition-all duration-500 ${selectedDay ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <h3 className="text-md font-bold flex items-center gap-2 text-white mb-4">
            <Icons.Calendar />
            Horários {selectedDay ? `(Dia ${selectedDay})` : ''}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto max-h-[300px] lg:max-h-none pr-1 custom-scrollbar">
            {availableTimes.length > 0 ? availableTimes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border active:scale-95
                  ${selectedTime === t ? 'bg-emerald-500 border-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 
                    'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                `}
              >
                {t}
              </button>
            )) : (
              <p className="col-span-2 lg:col-span-1 text-center py-8 text-slate-500 text-xs italic">
                {selectedDay ? 'Indisponível neste dia' : 'Selecione um dia'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Motivo da Visita com Dropdown */}
        <div className={`space-y-4 transition-all duration-500 ${selectedTime ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none'}`}>
          <h3 className="text-lg font-bold text-white">Qual o motivo da visita?</h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-left transition-all hover:border-slate-500 active:scale-[0.99]
                ${selectedReason ? 'text-emerald-500 border-emerald-500/30' : 'text-slate-400'}
              `}
            >
              <span className="font-semibold">{selectedReason || 'Selecione uma opção...'}</span>
              <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-popIn">
                {VISIT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setSelectedReason(reason);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-4 text-left text-sm font-medium transition-all hover:bg-emerald-500 hover:text-slate-900 border-b border-slate-700/50 last:border-none
                      ${selectedReason === reason ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-300'}
                    `}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className={`space-y-4 transition-all duration-500 ${selectedReason ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none'}`}>
          <h3 className="text-lg font-bold text-white">Observações Adicionais</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva detalhes ou necessidades específicas para esta visita..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all min-h-[120px] resize-none"
          />
        </div>
      </div>

      <div className="fixed bottom-24 left-4 right-4 lg:static lg:mt-12 flex flex-col gap-4 z-40 lg:max-w-md lg:ml-auto">
        {selectedTime && selectedReason && (
          <div className="bg-emerald-500 text-slate-900 p-4 rounded-3xl flex items-center justify-between border border-emerald-400 shadow-2xl animate-popIn">
            <div className="flex-1">
              <p className="font-black text-lg leading-tight">
                {selectedDay} de {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][viewDate.getMonth()]} às {selectedTime}
              </p>
              <p className="text-sm font-bold opacity-80 truncate max-w-[250px]">
                Motivo: {selectedReason}
              </p>
            </div>
            <div className="bg-slate-900/10 p-2 rounded-xl">
               <Icons.Calendar />
            </div>
          </div>
        )}
        
        <button 
          disabled={!selectedTime || !selectedReason}
          onClick={handleConfirm}
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-95
            ${(selectedTime && selectedReason) ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-emerald-500/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
          `}
        >
          Confirmar Agendamento
        </button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        @keyframes popIn {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-popIn { animation: popIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SchedulingView;
