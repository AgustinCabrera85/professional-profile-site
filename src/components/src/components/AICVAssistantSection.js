import { getContent } from '../i18n.js';
import { renderTags } from './utils.js';

class AICVAssistantSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { aiCvAssistant } = getContent();

    this.innerHTML = `
      <section id="ai-cv-assistant" class="ai-cv-assistant-section reveal">
        <div class="ai-cv-assistant-card">
          <div>
            <p class="section-kicker">${aiCvAssistant.kicker}</p>
            <h2 class="section-title">${aiCvAssistant.title}</h2>
            <p class="section-copy">${aiCvAssistant.copy}</p>
          </div>

          <div class="ai-cv-assistant-panel">
            <h3>${aiCvAssistant.demoTitle}</h3>
            <p>${aiCvAssistant.demoCopy}</p>
            <div class="tag-list">${renderTags(aiCvAssistant.tags)}</div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('ai-cv-assistant-section', AICVAssistantSection);