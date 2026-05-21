import { getContent } from '../i18n.js';

class FocusSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { focus, profile, common } = getContent();

    this.innerHTML = `
      <section id="focus" class="reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${focus.kicker}</p>
            <h2 class="section-title">${focus.title}</h2>
          </div>
          <p class="section-copy">${focus.copy}</p>
        </div>

        <div class="grid-3">
          ${focus.cards.map((card) => `
            <article class="card">
              <div class="icon-box">${card.icon}</div>
              <h3>${card.title}</h3>
              <p>${card.description}</p>
            </article>
          `).join('')}
        </div>

        <div class="highlight-band">
          <div>
            <h3>${focus.highlightTitle}</h3>
            <p>${focus.highlightText}</p>
          </div>
          <a class="button button-primary" href="mailto:${profile.email}">${common.startConversation}</a>
        </div>
      </section>
    `;
  }
}

customElements.define('focus-section', FocusSection);
