import { getContent } from '../i18n.js';

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { profile } = getContent();

    this.innerHTML = `
      <footer class="footer">
        <div class="page-shell">
          <p>© ${new Date().getFullYear()} ${profile.name} · ${profile.footerRole}</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
