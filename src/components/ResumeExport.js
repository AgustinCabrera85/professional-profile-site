import { getContent } from '../i18n.js';

class ResumeExport extends HTMLElement {
  connectedCallback() {
    this.render();
    this.handleClick = (event) => {
      const button = event.target.closest('[data-resume-export]');
      if (!button) return;

      event.preventDefault();
      window.print();
    };

    this.boundRender = () => this.render();

    document.addEventListener('click', this.handleClick);
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('languagechange', this.boundRender);
  }

  getResumeExperience(experience) {
    return [...experience.items]
      .filter((item) => item.showInResume !== false)
      .sort((a, b) => b.sortOrder - a.sortOrder);
  }

  renderEducationItems(education) {
    return education.items.map((item) => {
      if (item.list) {
        return `<li><strong>${item.title}:</strong> ${item.list.join('; ')}.</li>`;
      }

      return `<li><strong>${item.title}:</strong> ${item.description || ''}</li>`;
    }).join('');
  }

  renderSkillGroups(skills, additional) {
    const additionalTags = additional.items.flatMap((item) => item.tags);
    const uniqueAdditionalTags = [...new Set(additionalTags)];

    return `
      <p><strong>${skills.coreTitle}:</strong> ${skills.strengths.join(', ')}</p>
      <p><strong>${skills.dataTitle}:</strong> ${skills.dataMl.join(', ')}</p>
      ${skills.stack.map((group) => `<p><strong>${group.area}:</strong> ${group.items.join(', ')}</p>`).join('')}
      <p><strong>Additional:</strong> ${uniqueAdditionalTags.join(', ')}</p>
    `;
  }

  render() {
    const { profile, resume, experience, education, projects, skills, additional } = getContent();
    const linkedin = profile.linkedinUrl && profile.linkedinUrl !== '#'
      ? profile.linkedinUrl
      : '';
    const github = profile.githubUrl && profile.githubUrl !== '#'
      ? profile.githubUrl
      : '';

    const resumeExperience = this.getResumeExperience(experience);

    this.innerHTML = `
      <div class="resume-print-root" aria-hidden="true">
        <article class="resume-sheet">
          <header class="resume-header">
            <p class="resume-doc-title">${resume.printTitle}</p>
            <h1>${profile.name}</h1>
            <p class="resume-headline">${resume.headline}</p>
            <p class="resume-contact-line">
              ${profile.email} | ${profile.phone} | ${profile.location}
              ${linkedin ? ` | LinkedIn: ${linkedin}` : ''}
              ${github ? ` | GitHub: ${github}` : ''}
            </p>
          </header>

          <section class="resume-section">
            <h2>${resume.summaryTitle}</h2>
            <p>${resume.summary}</p>
          </section>

          <section class="resume-section">
            <h2>${resume.highlightsTitle}</h2>
            <ul>
              ${resume.highlights.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </section>

          <section class="resume-section">
            <h2>${resume.skillsTitle}</h2>
            <div class="resume-skills">
              ${this.renderSkillGroups(skills, additional)}
            </div>
          </section>

          <section class="resume-section">
            <h2>${resume.experienceTitle}</h2>
            ${resumeExperience.map((job) => `
              <article class="resume-job">
                <h3>${job.role}</h3>
                <p class="resume-job-meta">${job.company} | ${job.period}</p>
                <ul>
                  ${job.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
                </ul>
              </article>
            `).join('')}
          </section>

          <section class="resume-section">
            <h2>${resume.educationTitle}</h2>
            <ul>
              ${this.renderEducationItems(education)}
            </ul>
          </section>

          <section class="resume-section">
            <h2>${resume.projectsTitle}</h2>
            <ul>
              ${projects.items.map((project) => `<li><strong>${project.title}:</strong> ${project.description}</li>`).join('')}
            </ul>
          </section>
        </article>
      </div>
    `;
  }
}

customElements.define('resume-export', ResumeExport);
