
import React from 'react';
import { Agent, AgentStatus, Category } from '../types';
import { useLanguage } from '../App';

interface AgentDetailModalProps {
  agent: Agent;
  categoryInfo?: Category;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, categoryInfo, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm dark:backdrop-blur-md" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-[800px] flex flex-col max-h-[90vh] bg-white dark:bg-modal-bg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-fade-in-up transition-colors">
        {/* Header */}
        <div className="flex flex-col border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-modal-bg relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 dark:text-[#929bc9] hover:text-primary dark:hover:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="shrink-0">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl h-24 w-24 shadow-xl ring-4 ring-white dark:ring-white/10 flex items-center justify-center bg-slate-200 dark:bg-surface-dark overflow-hidden"
                style={agent.imageUrl ? { backgroundImage: `url("${agent.imageUrl}")` } : {}}
              >
                {!agent.imageUrl && <span className="material-symbols-outlined text-5xl text-primary">smart_toy</span>}
              </div>
            </div>
            <div className="flex flex-col flex-1 pt-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h2 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-none tracking-tight">{agent.name}</h2>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  agent.status === AgentStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-[#929bc9] text-base font-medium mb-4">{t.detail.version} {agent.version} • {t.detail.architecture}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <a 
                  href={agent.repoUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-2 text-sm font-semibold text-primary dark:text-primary hover:text-primary/80 dark:hover:text-white transition-all items-center cursor-pointer bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-lg border border-primary/10 dark:border-primary/20 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  <span>{t.detail.visitProject}</span>
                </a>
                <button className="flex gap-2 text-sm font-semibold text-slate-500 dark:text-[#929bc9] hover:text-primary dark:hover:text-white transition-all items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  <span>{t.detail.share}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-modal-bg p-8 transition-colors">
          <div className="flex flex-col gap-10">
            {/* Tag Section */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
               <span className={`px-4 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-2 ${colorClass}`}>
                  <span className="material-symbols-outlined text-sm">tag</span>
                  {agent.category}
               </span>
               <span className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-gray-300 text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {t.detail.architecture}
               </span>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 dark:text-white text-2xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                {t.detail.overview}
              </h3>
              <div className="text-slate-600 dark:text-[#929bc9] text-lg font-normal leading-relaxed font-body bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10">
                <p>{agent.shortDescription}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 dark:text-white text-2xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">settings_suggest</span>
                {t.detail.logic}
              </h3>
              <div className="p-6 rounded-2xl bg-slate-900 dark:bg-[#0d1117] border border-slate-700 dark:border-white/10 shadow-inner">
                <pre className="text-sm text-indigo-300 dark:text-primary/80 whitespace-pre-wrap font-mono leading-relaxed">
                  {agent.detailedInstructions}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#151825] p-6 px-8 flex justify-between items-center text-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:gap-6 text-slate-400 dark:text-[#6b7280] font-bold">
            <span>{t.detail.core}: <span className="text-slate-700 dark:text-white">v{agent.version}</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-[10px]">
               <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
               {t.detail.systemNominal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
