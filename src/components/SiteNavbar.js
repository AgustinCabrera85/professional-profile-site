import { getContent, getCurrentLanguage, toggleLanguage } from '../i18n.js';

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { profile, nav, common, resume } = getContent();
    const currentLanguage = getCurrentLanguage();

    this.innerHTML = `
      <header class="navbar">
        <nav class="nav-inner" aria-label="Main navigation">
          <a href="#top" class="brand" aria-label="Home">
            <span class="brand-mark">${profile.initials}</span>
            <span>${profile.shortName}</span>
          </a>

          <button class="mobile-menu-button" aria-label="Open navigation menu">☰</button>

          <div class="nav-links">
            ${nav.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}
            <button class="nav-resume-button" type="button" data-resume-export>${resume.navButton}</button>
            <button class="language-switch" type="button" aria-label="${common.languageLabel}">
              <span>${currentLanguage.toUpperCase()}</span>
              <strong>${common.switchTo}</strong>
            </button>
            <a class="nav-cta" href="mailto:${profile.email}">${common.contactMe}</a>
          </div>
        </nav>
      </header>
    `;

    const button = this.querySelector('.mobile-menu-button');
    const links = this.querySelector('.nav-links');
    const languageSwitch = this.querySelector('.language-switch');

    button.addEventListener('click', () => {
      links.classList.toggle('open');
      button.textContent = links.classList.contains('open') ? '×' : '☰';
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        button.textContent = '☰';
      });
    });

    languageSwitch.addEventListener('click', () => toggleLanguage());
  }
}

customElements.define('site-navbar', SiteNavbar);
