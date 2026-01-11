
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

interface AdminPortalProps {
  onLogin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="bg-background-dark font-display min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#2b4bee 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="absolute top-8 left-8 z-20 flex justify-between w-full pr-16 items-center">
        <Link to="/" className="group flex items-center gap-2 text-[#929bc9] hover:text-white transition-colors duration-200 text-sm font-medium">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          {t.nav.return}
        </Link>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all uppercase"
        >
          <span className="material-symbols-outlined text-sm">language</span>
          {language === 'en' ? '中文' : 'EN'}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[480px] p-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="size-12 bg-surface-dark border border-border-dark rounded-xl flex items-center justify-center mb-4 shadow-lg text-white">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <h1 className="text-white tracking-tight text-3xl font-bold leading-tight text-center">{t.admin.console}</h1>
          <p className="text-[#929bc9] text-base font-normal mt-2 text-center">{t.admin.authenticate}</p>
        </div>

        <div className="bg-surface-dark/80 backdrop-blur-md border border-border-dark rounded-xl shadow-2xl p-8 w-full">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">{t.admin.email}</p>
              <div className="relative">
                <input 
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-[#111422] focus:border-primary h-12 px-4 pl-11 transition-colors"
                  placeholder="admin@portfolio.dev"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929bc9]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
              </div>
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">{t.admin.password}</p>
              <div className="relative">
                <input 
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-[#111422] focus:border-primary h-12 px-4 pl-11 transition-colors"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929bc9]">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <a className="text-xs font-medium text-primary hover:text-primary/80 transition-colors" href="#">{t.admin.forgot}</a>
              </div>
            </label>

            <button type="submit" className="mt-4 flex w-full items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-sm font-bold tracking-wide uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              <span className="mr-2 material-symbols-outlined text-[20px]">login</span>
              {t.admin.signIn}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-border-dark flex items-center justify-center gap-2">
            <span className="text-[#58618a] text-xs">{t.admin.security}</span>
            <span className="material-symbols-outlined text-[#58618a] text-[14px]">shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};
