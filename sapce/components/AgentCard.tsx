
import React from 'react';
import { Agent, Category } from '../types';
import { useLanguage } from '../App';

interface AgentCardProps {
  agent: Agent;
  categoryInfo?: Category;
  onViewDetails: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, categoryInfo, onViewDetails }) => {
  const { t } = useLanguage();
  
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
    pink: 'text-pink-500 dark:text-pink-400 bg-pink-500/10 border-pink-500/20',
    red: 'text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20',
  };

  const colorClass = categoryInfo ? colorMap[categoryInfo.color] : 'text-slate-500 dark:text-gray-400 bg-slate-500/10 border-slate-500/20';
  const icon = categoryInfo ? categoryInfo.icon : 'smart_toy';

  return (
    <div className="group flex flex-col gap-4 p-6 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:shadow-none">
      <div className="flex justify-between items-start">
        <div className={`size-12 rounded-lg flex items-center justify-center border ${colorClass}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{icon}</span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
          {agent.category}
        </span>
      </div>
      <div>
        <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
          {agent.name}
        </h3>
        <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {agent.shortDescription}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
        <button 
          onClick={() => onViewDetails(agent)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/btn"
        >
          {t.agentCard.viewDetails}
          <span className="material-symbols-outlined text-slate-400 dark:text-gray-500 group-hover/btn:text-primary dark:group-hover/btn:text-white transition-colors text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
