
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Agent, AgentStatus, Category } from '../types';
import { useLanguage } from '../App';
import { DEFAULT_ICONS } from '../constants';

interface AdminDashboardProps {
  agents: Agent[];
  categories: Category[];
  onDelete: (id: string) => void;
  onSaveCategories: (cats: Category[]) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ agents, categories, onDelete, onSaveCategories, onLogout }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AgentStatus | 'All'>('All');
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('smart_toy');
  const [newCatColor, setNewCatColor] = useState('blue');
  
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const filtered = useMemo(() => {
    return agents.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || a.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [agents, search, filter]);

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      onSaveCategories(categories.map(c => c.id === editingCat.id ? { ...c, name: newCatName, icon: newCatIcon, color: newCatColor } : c));
    } else {
      const newCat: Category = {
        id: Math.random().toString(36).substr(2, 6),
        name: newCatName,
        icon: newCatIcon,
        color: newCatColor
      };
      onSaveCategories([...categories, newCat]);
    }
    resetCatForm();
  };

  const resetCatForm = () => {
    setEditingCat(null);
    setNewCatName('');
    setNewCatIcon('smart_toy');
    setNewCatColor('blue');
  };

  const startEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setNewCatName(cat.name);
    setNewCatIcon(cat.icon);
    setNewCatColor(cat.color);
  };

  const deleteCategory = (id: string) => {
    if (window.confirm(t.categories.confirmDelete)) {
      onSaveCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-display">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#111422] border-r border-slate-800 h-full shrink-0">
        <div className="flex flex-col justify-between h-full p-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                <span className="material-symbols-outlined text-lg">neurology</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-white text-base font-bold truncate">StarFromSpace</h1>
                <p className="text-[#929bc9] text-xs truncate">{t.admin.console}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[20px]">view_list</span>
                <span className="text-sm font-medium">{t.admin.allAgents}</span>
              </Link>
              <button 
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#929bc9] hover:bg-surface-dark transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[20px]">category</span>
                <span className="text-sm font-medium">{t.categories.manage}</span>
              </button>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#929bc9] hover:bg-surface-dark transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">language</span>
              <span className="text-sm font-medium">{language === 'en' ? '切换为中文' : 'Switch to English'}</span>
            </button>
            <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-surface-dark hover:bg-[#2b324d] text-white text-sm font-bold transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>{t.admin.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-3xl font-bold tracking-tight">{t.admin.management}</h2>
              <p className="text-[#929bc9] text-base">{t.admin.managementSub}</p>
            </div>
            <button 
              onClick={() => navigate('/admin/editor')}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>{t.admin.addNew}</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full md:max-w-md">
              <div className="flex items-center rounded-lg bg-[#1e2336] border border-[#323b67] focus-within:ring-2 focus-within:ring-primary overflow-hidden shadow-sm">
                <div className="pl-4 text-[#929bc9]">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#929bc9] h-12 px-4 text-sm" 
                  placeholder={t.admin.search} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={() => setFilter('All')}
                className={`flex h-8 items-center gap-x-2 rounded-full px-4 text-sm font-bold transition-colors ${filter === 'All' ? 'bg-primary text-white' : 'bg-surface-dark text-[#929bc9]'}`}
              >
                {t.admin.allAgents}
              </button>
              {Object.values(AgentStatus).map(s => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`flex h-8 items-center gap-x-2 rounded-full px-4 text-sm font-bold transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-surface-dark text-[#929bc9]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#323b67] bg-[#111422] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#191e33] border-b border-[#323b67]">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#929bc9]">{t.admin.tableName}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#929bc9]">{t.admin.tableStatus}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#929bc9]">{t.admin.tableUpdated}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-right text-[#929bc9]">{t.admin.tableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#323b67]">
                {filtered.map(agent => (
                  <tr key={agent.id} className="group hover:bg-[#1e2336] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                          {agent.imageUrl ? <img src={agent.imageUrl} className="w-full h-full object-cover" /> : agent.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm">{agent.name}</span>
                          <span className="text-slate-400 text-xs">{agent.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${agent.status === AgentStatus.ACTIVE ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-sm text-slate-300">{agent.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#929bc9]">{agent.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/editor/${agent.id}`)} className="p-1.5 text-slate-400 hover:text-white hover:bg-primary/20 rounded-md">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => onDelete(agent.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Category Management Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCatModal(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-modal-bg rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151825]">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">category</span>
                {t.categories.manage}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="material-symbols-outlined text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">close</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-modal-bg custom-scrollbar">
              {/* Add/Edit Form */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{editingCat ? t.categories.edit : t.categories.add}</h4>
                <form onSubmit={handleSaveCategory} className="bg-[#111422] p-6 rounded-xl border border-[#323b67] shadow-lg flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">{t.categories.name}</label>
                      <input 
                        className="w-full bg-[#1e2336] border border-[#323b67] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder={t.categories.placeholderName}
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">{t.categories.icon}</label>
                      
                      {/* Icon Selection Grid */}
                      <div className="flex flex-wrap gap-2 p-3 bg-[#1e2336] border border-[#323b67] rounded-lg max-h-32 overflow-y-auto no-scrollbar">
                        {DEFAULT_ICONS.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            title={icon}
                            onClick={() => setNewCatIcon(icon)}
                            className={`material-symbols-outlined p-1.5 rounded-lg transition-all transform active:scale-90 ${
                              newCatIcon === icon 
                                ? 'bg-primary text-white ring-2 ring-primary/40' 
                                : 'text-[#929bc9] hover:bg-white/5 hover:text-white'
                            }`}
                            style={{ fontSize: '20px' }}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>

                      <div className="relative mt-1">
                        <input 
                          className="w-full bg-[#1e2336] border border-[#323b67] text-white rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          placeholder={t.categories.placeholderIcon}
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          required
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">{newCatIcon}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">{t.categories.color}</label>
                    <div className="flex flex-wrap gap-3">
                      {['blue', 'emerald', 'purple', 'orange', 'pink', 'red', 'indigo', 'amber'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCatColor(color)}
                          className={`size-8 rounded-full border-2 transition-all transform active:scale-95 ${newCatColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          style={{ backgroundColor: color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'purple' ? '#a855f7' : color === 'orange' ? '#f97316' : color === 'pink' ? '#ec4899' : color === 'red' ? '#ef4444' : color === 'indigo' ? '#6366f1' : '#f59e0b' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#323b67]">
                    {editingCat && (
                      <button type="button" onClick={resetCatForm} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        {t.categories.cancel}
                      </button>
                    )}
                    <button type="submit" className="bg-primary hover:bg-blue-600 px-8 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all">
                      {editingCat ? t.categories.save : t.categories.add}
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Existing Categories */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.admin.allAgents}</h4>
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-[#111422] border border-[#323b67] group hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10`}>
                          <span className={`material-symbols-outlined`} style={{ color: cat.color === 'blue' ? '#3b82f6' : cat.color === 'emerald' ? '#10b981' : cat.color === 'purple' ? '#a855f7' : cat.color === 'orange' ? '#f97316' : cat.color === 'pink' ? '#ec4899' : cat.color === 'red' ? '#ef4444' : cat.color === 'indigo' ? '#6366f1' : '#f59e0b' }}>{cat.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{cat.name}</span>
                          <span className="text-xs text-[#929bc9] font-mono">{cat.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => startEditCategory(cat)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
