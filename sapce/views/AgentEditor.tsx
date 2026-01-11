
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Agent, AgentStatus, Category } from '../types';
import { useLanguage } from '../App';

interface AgentEditorProps {
  agents?: Agent[];
  categories: Category[];
  onSave: (agent: Agent) => void;
}

export const AgentEditor: React.FC<AgentEditorProps> = ({ agents = [], categories, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();
  
  const existingAgent = agents.find(a => a.id === id);

  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    category: categories.length > 0 ? categories[0].name : '',
    shortDescription: '',
    detailedInstructions: '',
    status: AgentStatus.ACTIVE,
    imageUrl: '',
    repoUrl: '',
    version: '1.0.0',
    lastUpdated: 'Just now'
  });

  useEffect(() => {
    if (existingAgent) {
      setFormData(existingAgent);
    }
  }, [existingAgent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAgent: Agent = {
      ...formData,
      id: existingAgent?.id || Math.random().toString(36).substr(2, 6),
      lastUpdated: 'Just now'
    } as Agent;
    onSave(finalAgent);
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-background-dark text-white font-display">
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/admin/dashboard" className="text-[#929bc9] hover:text-primary transition-colors">{t.editor.dashboard}</Link>
            <span className="material-symbols-outlined text-[16px] text-[#929bc9]">chevron_right</span>
            <span className="text-white font-medium">{id ? t.editor.edit : t.editor.create}</span>
          </nav>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all uppercase"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {language === 'en' ? '中文' : 'EN'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{t.editor.identity}</h1>
          <p className="text-[#929bc9] text-lg">{t.editor.identitySub}</p>
        </div>

        <div className="bg-[#191e33] border border-[#232948] rounded-xl p-6 md:p-8 shadow-2xl">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.name}</label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g. CodeReviewBot-V2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">smart_toy</span>
                </div>
              </div>

              {/* Status Selection (Prominent Requirement) */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.status}</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AgentStatus })}
                  >
                    {Object.values(AgentStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">
                    {formData.status === AgentStatus.ACTIVE ? 'check_circle' : 
                     formData.status === AgentStatus.TRAINING ? 'model_training' : 
                     formData.status === AgentStatus.MAINTENANCE ? 'build' : 'pause_circle'}
                  </span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.category}</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">category</span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Version Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.version}</label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="1.0.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">numbers</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.shortDesc}</label>
              <input 
                className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="A brief one-liner summary of what this agent does..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.instructions}</label>
              <textarea 
                className="w-full bg-[#111422] border border-[#323b67] text-white rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed"
                placeholder="Define the prompt logic and behavior..."
                rows={10}
                value={formData.detailedInstructions}
                onChange={(e) => setFormData({ ...formData, detailedInstructions: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#232948]">
              {/* Image Upload Area */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.image}</label>
                <div 
                  onClick={triggerFileInput}
                  className="relative w-full h-44 bg-[#111422] border-2 border-dashed border-[#323b67] hover:border-primary rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                >
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-background-dark/80 px-6 py-2.5 rounded-full text-xs font-bold border border-white/10 shadow-lg">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[#929bc9] text-4xl mb-3 group-hover:text-primary transition-colors">add_photo_alternate</span>
                      <p className="text-sm text-[#929bc9] group-hover:text-white transition-colors">Click to select file</p>
                      <p className="text-[10px] text-[#58618a] mt-1 font-mono uppercase">JPG, PNG or GIF</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              {/* Repo Link Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#929bc9] uppercase tracking-wider">{t.editor.repo}</label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#111422] border border-[#323b67] text-white rounded-lg px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="https://github.com/yourproject"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#929bc9]">link</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-8 mt-4 border-t border-[#232948]">
              <Link to="/admin/dashboard" className="px-8 py-3 rounded-lg text-sm font-bold text-[#929bc9] hover:text-white hover:bg-white/5 transition-all">
                {t.editor.cancel}
              </Link>
              <button 
                type="submit"
                className="px-12 py-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-[#1a3ac4] shadow-xl shadow-primary/30 transition-all flex items-center gap-3 transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">save</span>
                {t.editor.save}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
