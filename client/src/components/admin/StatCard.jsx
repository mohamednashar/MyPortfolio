import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'cyan' }) => {
  const colorStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color] || colorStyles.cyan}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
