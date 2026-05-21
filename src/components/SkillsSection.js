import { getContent } from '../i18n.js';
import { renderTags } from './utils.js';

class SkillsSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { skills } = getContent();

    this.innerHTML = `
      <section id="skills" class="reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${skills.kicker}</p>
            <h2 class="section-title">${skills.title}</h2>
          </div>
          <p class="section-copy">${skills.copy}</p>
        </div>

        <div class="grid-2">
          <div class="card">
            <h3>${skills.coreTitle}</h3>
            <div class="tag-list">${renderTags(skills.strengths)}</div>
          </div>

          <div class="card">
            <h3>${skills.dataTitle}</h3>
            <div class="tag-list">${renderTags(skills.dataMl)}</div>
          </div>
        </div>

        <div class="card stack-card">
          <h3>${skills.stackTitle}</h3>
          <div class="skills-panel">
            ${skills.stack.map((group) => `
              <div class="skill-row">
                <strong>${group.area}</strong>
                <div class="skill-tags">
                  ${group.items.map((item) => `<span>${item}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('skills-section', SkillsSection);
