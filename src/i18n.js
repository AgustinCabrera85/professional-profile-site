import { TRANSLATIONS } from './data/translations.js';

const STORAGE_KEY = 'profile-site-language';
const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;

export const getAvailableLanguages = () => Object.keys(TRANSLATIONS);

export const getCurrentLanguage = () => currentLanguage;

export const getContent = () => TRANSLATIONS[currentLanguage] ?? TRANSLATIONS[DEFAULT_LANGUAGE];

export const setLanguage = (language) => {
  if (!TRANSLATIONS[language]) return;

  currentLanguage = language;
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;

  window.dispatchEvent(new CustomEvent('languagechange', {
    detail: { language }
  }));
};

export const toggleLanguage = () => {
  setLanguage(currentLanguage === 'en' ? 'es' : 'en');
};

export const initLanguage = () => {
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  currentLanguage = TRANSLATIONS[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
  document.documentElement.lang = currentLanguage;
};
