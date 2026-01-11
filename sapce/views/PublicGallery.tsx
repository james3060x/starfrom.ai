
import React, { useState, useMemo } from 'react';
import { Agent, Category } from '../types';
import { TopNavBar } from '../components/TopNavBar';
import { AgentCard } from '../components/AgentCard';
import { AgentDetailModal } from '../components/AgentDetailModal';
import { useLanguage } from '../App';

interface PublicGalleryProps {
  agents: Agent[];
  categories: Category[];
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ agents, categories }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { t } = useLanguage();

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                           agent.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || agent.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [agents, search, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <TopNavBar />
      
      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full px-4 pt-16 pb-12 flex justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 dark:from-[#1d233b] via-background-light dark:via-background-dark to-background-light dark:to-background-dark">
          <div className="flex flex-col max-w-[960px] w-full items-center gap-8">
            <div className="text-center space-y-4">
              <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-[-0.04em] max-w-4xl mx-auto">
                {t.hero.title}
              </h1>
              <h2 className="text-slate-600 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
                {t.hero.subtitle}
              </h2>
            </div>

            {/* Search Bar & Subscribe Button Container */}
            <div className="w-full max-w-[700px] flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex h-14 w-full max-w-[560px] shadow-lg dark:shadow-primary/5 focus-within:shadow-primary/20 transition-shadow">
                <div className="text-slate-400 dark:text-gray-400 flex border border-border-light dark:border-border-dark bg-white dark:bg-card-dark items-center justify-center pl-5 rounded-l-xl border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="flex w-full flex-1 border border-border-light dark:border-border-dark bg-white dark:bg-card-dark focus:border-primary dark:focus:border-primary/50 text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 text-base transition-colors"
                  placeholder={t.hero.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-border-light dark:border-border-dark bg-white dark:bg-card-dark pr-2">
                  <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-md">
                    {t.hero.searchButton}
                  </button>
                </div>
              </div>

              {/* Subscribe Button */}
              <button 
                onClick={() => alert('Subscription feature coming soon!')}
                className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
                {t.hero.subscribeButton}
              </button>
            </div>

            {/* Filter Chips */}
            <div className="w-full overflow-x-auto hide-scrollbar pb-2">
              <div className="flex gap-3 justify-start md:justify-center min-w-max px-1">
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 border ${
                    activeCategory === 'All' 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-slate-600 dark:text-gray-300 hover:border-slate-400 dark:hover:border-gray-500 shadow-sm'
                  }`}
                >
                  <span className="text-sm font-medium">{t.categories.All}</span>
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 border ${
                      activeCategory === cat.name 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-slate-600 dark:text-gray-300 hover:border-slate-400 dark:hover:border-gray-500 shadow-sm'
                    }`}
                  >
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section className="w-full px-4 md:px-10 py-12 flex justify-center bg-background-light dark:bg-background-dark transition-colors">
          <div className="max-w-[1200px] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map(agent => {
                const catInfo = categories.find(c => c.name === agent.category);
                return (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    categoryInfo={catInfo}
                    onViewDetails={(a) => setSelectedAgent(a)}
                  />
                );
              })}
            </div>
            {filteredAgents.length === 0 && (
              <div className="text-center py-24 text-slate-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <p className="text-xl font-medium">No agents found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 px-5 py-12 text-center border-t border-border-light dark:border-border-dark bg-white dark:bg-background-dark transition-colors">
        <p className="text-slate-500 dark:text-gray-400 text-base font-medium">{t.footer.welcome}</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 shadow-inner">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-300/80 font-mono font-bold tracking-[0.05em] uppercase">v1.2.4 Premium</span>
        </div>
      </footer>

      {selectedAgent && (
        <AgentDetailModal 
          agent={selectedAgent} 
          categoryInfo={categories.find(c => c.name === selectedAgent.category)}
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  );
};
