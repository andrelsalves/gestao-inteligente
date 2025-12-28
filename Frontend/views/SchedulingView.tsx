
import React, { useState, useMemo } from 'react';
import { User, Appointment } from '../types';
import { Icons, COLORS } from '../constants';

interface SchedulingViewProps {
  user: User;
  onSchedule: (app: Omit<Appointment, 'id' | 'status'>) => void;
}

const SchedulingView: React.FC<SchedulingViewProps> = ({ user, onSchedule }) => {
  const [viewDate, setViewDate] = useState(new Date(2024, 8, 1)); // Set to Sept 2024 by default
  const [selectedDay, setSelectedDay] = useState<number | null>(20);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Simulate some availability pattern
    const getAvailability = (day: number) => {
      // Logic to show some days as more "available" than others
      const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
      if (isWeekend) return 'NONE';
      if (day % 3 === 0) return 'LIMITED';
      return 'FULL';
    };

    return {
      year,
      month: monthNames[month],
      firstDayOfMonth,
      daysInMonth,
      getAvailability
    };
  }, [viewDate]);

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime) return;
    onSchedule({
      companyId: user.id,
      companyName: user.companyName || user.name,
      technicianId: 'tech_auto_1',
      date: `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`,
      time: selectedTime,
      description: description.trim() || 'Solicitação de visita técnica via portal'
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8 animate-fadeIn pb-12">
      <header className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Agendar Visita</h2>
      </header>

      {/* Calendar Area */}
      <div className="bg-[#1e293b] rounded-3xl p-6 shadow-xl border border-slate-700/50">
        <div className="flex justify-between items-center mb-8 px-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.ChevronLeft />
          </button>
          <div className="text-center">
            <span className="font-bold text-lg block">{calendarData.month}</span>
            <span className="text-xs text-slate-500 font-mono uppercase">{calendarData.year}</span>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
            <span key={d} className="text-[10px] font-bold text-slate-500 mb-2">{d}</span>
          ))}
          
          {/* Empty slots for start of month */}
          {Array.from({ length: calendarData.firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}

          {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const availability = calendarData.getAvailability(dayNum);
            const isSelected = selectedDay === dayNum;
            const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum).toDateString();

            return (
              <div key={dayNum} className="relative flex flex-col items-center group">
                <button
                  disabled={availability === 'NONE'}
                  onClick={() => {
                    setSelectedDay(dayNum);
                    setSelectedTime(null);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all relative
                    ${isSelected ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 scale-110 z-10' : 
                      availability === 'NONE' ? 'text-slate-700 cursor-not-allowed opacity-40' : 
                      'text-slate-300 hover:bg-slate-700/50 group-hover:scale-105'}
                    ${isToday && !isSelected ? 'border border-emerald-500/50' : ''}
                  `}
                >
                  {dayNum}
                  {/* Availability Indicator */}
                  {availability !== 'NONE' && !isSelected && (
                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${availability === 'LIMITED' ? 'bg-amber-500' : 'bg-emerald-500/50'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-tighter border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Disponível</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Limitado</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> Indisponível</div>
        </div>
      </div>

      {/* Time Selection */}
      <div className={`space-y-4 transition-all duration-500 ${selectedDay ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none'}`}>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Icons.Calendar />
          Horários disponíveis para o dia {selectedDay}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {times.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`py-3 px-2 rounded-2xl text-sm font-bold transition-all border active:scale-95
                ${selectedTime === t ? 'bg-emerald-500 border-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 
                  'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Description Field */}
      <div className={`space-y-4 transition-all duration-500 ${selectedTime ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none'}`}>
        <h3 className="text-lg font-bold">Observações (Opcional)</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o motivo da visita ou observações importantes para o técnico..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all min-h-[100px]"
        />
      </div>

      {/* Summary Footer */}
      <div className="fixed bottom-24 left-4 right-4 md:static md:mt-12 flex flex-col gap-4 z-40">
        <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-3xl flex items-center justify-between border border-slate-700 shadow-2xl">
          <div className="flex-1">
            <p className="font-black text-white text-lg">
              {selectedDay ? `${selectedDay} de ${calendarData.month}` : 'Selecione uma data'}
            </p>
            <p className="text-sm text-slate-400 font-medium">
              {selectedTime ? `Início às ${selectedTime}` : 'Escolha um horário acima'}
            </p>
          </div>
          <div className={`p-3 rounded-2xl transition-all ${selectedTime ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-500'}`}>
            <Icons.Calendar />
          </div>
        </div>
        
        <button 
          disabled={!selectedTime}
          onClick={handleConfirm}
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-95
            ${selectedTime ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-emerald-500/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
          `}
        >
          Confirmar Visita Técnica
        </button>
      </div>
    </div>
  );
};

export default SchedulingView;
