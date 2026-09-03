import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('aura_lang') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('aura_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (lang === 'en') {
      document.title = 'AURA NEST | Integrated Architectural Systems & Luxury Interior Design';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'AURA NEST - Integrated Architectural Systems, Luxury Interior Design, Premium Finishes & Direct Engineering Supervision in New Cairo, Fifth Settlement, Egypt.');
      }
    } else {
      document.title = 'AURA NEST | اورا نيست — تصميم داخلي، تشطيبات فاخرة وإشراف هندسي — التجمع الخامس';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'منظومة AURA NEST (اورا نيست) الهندسية المتكاملة من الفكرة حتى المفتاح في مصر. نقدم خدمات التصميم المعماري والديكور الداخلي، التشطيبات الفاخرة والإشراف الهندسي التجمع الخامس.');
      }
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
