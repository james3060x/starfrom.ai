
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicGallery } from './views/PublicGallery';
import { AdminPortal } from './views/AdminPortal';
import { AdminDashboard } from './views/AdminDashboard';
import { AgentEditor } from './views/AgentEditor';
import { Agent, Category } from './types';
import { INITIAL_AGENTS, DEFAULT_CATEGORIES } from './constants';
import { translations } from './i18n';

type Language = 'en' | 'cn';
type Theme = 'light' | 'dark';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addAgent = (agent: Agent) => {
    setAgents(prev => [...prev, agent]);
  };

  const updateAgent = (updated: Agent) => {
    setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const saveCategories = (cats: Category[]) => {
    setCategories(cats);
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  const t = translations[language];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicGallery agents={agents} categories={categories} />} />
            <Route path="/admin" element={
              isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminPortal onLogin={login} />
            } />
            <Route path="/admin/dashboard" element={
              isAuthenticated ? <AdminDashboard agents={agents} categories={categories} onDelete={deleteAgent} onSaveCategories={saveCategories} onLogout={logout} /> : <Navigate to="/admin" />
            } />
            <Route path="/admin/editor" element={
              isAuthenticated ? <AgentEditor onSave={addAgent} categories={categories} /> : <Navigate to="/admin" />
            } />
            <Route path="/admin/editor/:id" element={
              isAuthenticated ? <AgentEditor agents={agents} onSave={updateAgent} categories={categories} /> : <Navigate to="/admin" />
            } />
          </Routes>
        </HashRouter>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
