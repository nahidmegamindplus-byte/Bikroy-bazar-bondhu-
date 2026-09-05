'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations } from '@/i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isBangla: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[lang][key] || translations.en[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isBangla: lang === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
