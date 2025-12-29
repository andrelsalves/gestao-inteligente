
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Appointment } from '../types';

interface DashboardChartProps {
  data: Appointment[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts: Record<string, number> = { 'Seg': 0, 'Ter': 0, 'Qua': 0, 'Qui': 0, 'Sex': 0 };
    
    data.forEach(app => {
      const d = new Date(app.date);
      const dayName = days[d.getDay()];
      if (counts[dayName] !== undefined) {
        counts[dayName]++;
      }
    });

    return Object.entries(counts).map(([name, visitas]) => ({ name, visitas }));
  }, [data]);

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Volume de Visitas (Semana)</h3>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">ATIVIDADE</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
            cursor={{ fill: '#334155' }}
          />
          <Bar dataKey="visitas" fill="#10b981" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.visitas > 0 ? '#10b981' : '#334155'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
