
import React from 'react';
import { Icons } from '../constants';

interface CalendarProps {
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  getAvailability: (day: number) => 'NONE' | 'LIMITED' | 'FULL';
}

const Calendar: React.FC<CalendarProps> = ({ viewDate, onPrevMonth, onNextMonth, selectedDay, onSelectDay, getAvailability }) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="bg-[#1e293b] rounded-3xl p-6 shadow-xl border border-slate-700/50">
      <div className="flex justify-between items-center mb-8 px-2">
        <button onClick={onPrevMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
          <Icons.ChevronLeft />
        </button>
        <div className="text-center">
          <span className="font-bold text-lg block text-white">{monthNames[month]}</span>
          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">{year}</span>
        </div>
        <button onClick={onNextMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
          <Icons.ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
          <span key={d} className="text-[10px] font-bold text-slate-500 mb-2">{d}</span>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="w-10 h-10" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const availability = getAvailability(dayNum);
          const isSelected = selectedDay === dayNum;
          const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

          return (
            <div key={dayNum} className="relative flex flex-col items-center group">
              <button
                disabled={availability === 'NONE'}
                onClick={() => onSelectDay(dayNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all relative
                  ${isSelected ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 scale-110 z-10' : 
                    availability === 'NONE' ? 'text-slate-700 cursor-not-allowed opacity-40' : 
                    'text-slate-300 hover:bg-slate-700/50 group-hover:scale-105'}
                  ${isToday && !isSelected ? 'border border-emerald-500/50' : ''}
                `}
              >
                {dayNum}
                {availability !== 'NONE' && !isSelected && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${availability === 'LIMITED' ? 'bg-amber-500' : 'bg-emerald-500/50'}`} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-tighter border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Disponível</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Limitado</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> Indisponível</div>
      </div>
    </div>
  );
};

export default Calendar;
