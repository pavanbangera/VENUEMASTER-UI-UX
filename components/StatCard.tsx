import React from 'react';
import { LucideIcon } from 'lucide-react';
import { THEME, PRIMARY_COLOR } from '../constants';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp, colorClass = "bg-white" }) => {
  return (
    <div className={`relative overflow-hidden ${colorClass} rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
      {/* Top Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[${PRIMARY_COLOR}] to-[${PRIMARY_COLOR}]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className={`p-3.5 rounded-xl shadow-inner ${trendUp !== false ? `bg-gradient-to-br from-emerald-50 to-emerald-100` : 'bg-slate-50'} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${trendUp !== false ? `text-emerald-600` : 'text-slate-500'}`} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center text-xs font-medium bg-slate-50 w-fit px-2 py-1 rounded-md">
          <span className={trendUp ? `text-emerald-600` : 'text-rose-500'}>
            {trend}
          </span>
          <span className="ml-1.5 text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;