import { getContent } from '../i18n.js';
import { renderTags } from './utils.js';

class ProjectsSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { profile, projects, common } = getContent();

    this.innerHTML = `
      <section id="projects" class="projects-section reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${projects.kicker}</p>
            <h2 class="section-title">${projects.title}</h2>
          </div>
          <p class="section-copy">${projects.copy}</p>
        </div>

        <div class="projects-hero-card">
          <div>
            <span class="projects-kicker">${projects.githubKicker}</span>
            <h3>${profile.githubUrl.replace('https://github.com/', '@')}</h3>
            <p>${projects.githubDescription}</p>
          </div>
          <a class="button button-primary" href="${profile.githubUrl}" target="_blank" rel="noreferrer">
            ${common.openGithub}
          </a>
        </div>

        <div class="projects-grid">
          ${projects.items.map((project) => `
            <article class="project-card">
              <div class="project-card-top">
                <span class="project-category">${project.category}</span>
                <span class="project-repo">${project.repo}</span>
              </div>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="tag-list">${renderTags(project.tags)}</div>
              <a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">
                ${common.viewRepository}
              </a>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('projects-section', ProjectsSection);
