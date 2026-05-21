import { getContent } from '../i18n.js';
import { renderListItems, renderTags } from './utils.js';

class AdditionalAptitudesSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { additional } = getContent();

    this.innerHTML = `
      <section id="additional-aptitudes" class="additional-aptitudes-section reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${additional.kicker}</p>
            <h2 class="section-title">${additional.title}</h2>
          </div>
          <p class="section-copy">${additional.copy}</p>
        </div>

        <div class="aptitudes-grid">
          ${additional.items.map((aptitude) => `
            <article class="aptitude-card">
              <div class="aptitude-header">
                <div class="icon-box">${aptitude.icon}</div>
                <div>
                  <h3>${aptitude.title}</h3>
                  <p>${aptitude.description}</p>
                </div>
              </div>

              <ul class="aptitude-list">
                ${renderListItems(aptitude.items)}
              </ul>

              <div class="tag-list">
                ${renderTags(aptitude.tags)}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('additional-aptitudes-section', AdditionalAptitudesSection);
