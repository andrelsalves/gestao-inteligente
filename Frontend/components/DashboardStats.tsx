
import React from 'react';

interface Stat {
  label: string;
  value: number;
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <div key={idx} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg transform transition-all hover:scale-[1.02]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          <p className={`text-3xl font-black mt-2 ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
