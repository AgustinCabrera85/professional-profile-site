import { getContent } from '../i18n.js';
import { renderListItems, renderTags } from './utils.js';

class EducationSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { education } = getContent();

    this.innerHTML = `
      <section id="education" class="reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${education.kicker}</p>
            <h2 class="section-title">${education.title}</h2>
          </div>
        </div>

        <div class="grid-2">
          ${education.items.map((item) => `
            <article class="card">
              <div class="icon-box">${item.icon}</div>
              <h3>${item.title}</h3>
              ${item.description ? `<p>${item.description}</p>` : ''}
              ${item.tags ? `<div class="tag-list">${renderTags(item.tags)}</div>` : ''}
              ${item.list ? `<ul>${renderListItems(item.list)}</ul>` : ''}
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('education-section', EducationSection);
