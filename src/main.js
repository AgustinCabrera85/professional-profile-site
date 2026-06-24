import './styles/global.css';

import { initLanguage } from './i18n.js';

import './components/SiteNavbar.js';
import './components/HeroSection.js';
import './components/FocusSection.js';
import './components/CareerMapSection.js';
import './components/ProjectsSection.js';
import './components/AdditionalAptitudesSection.js';
import './components/SkillsSection.js';
import './components/EducationSection.js';
import './components/SiteFooter.js';
import './components/ResumeExport.js';
//import './components/AICVAssistantSection.js';
import './components/ElevenLabsSecureWidget.js';

initLanguage();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const observeRevealElements = () => {
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
};

window.addEventListener('DOMContentLoaded', observeRevealElements);
window.addEventListener('languagechange', observeRevealElements);
