import { getContent } from '../i18n.js';
import { safePhoneHref } from './utils.js';

class HeroSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.boundRender = () => this.render();
    window.addEventListener('languagechange', this.boundRender);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundRender);
  }

  render() {
    const { profile, hero, common, resume } = getContent();
    const profilePhoto = profile.photoUrl || '';

    this.innerHTML = `
      <section class="hero">
        <div class="hero-copy fade-in">
          <div class="eyebrow">
            <span class="eyebrow-dot"></span>
            ${profile.roleLine}
          </div>

          <h1>
            ${profile.heroTitle}
            <span class="gradient-text">${profile.heroHighlight}</span>
          </h1>

          <p class="hero-subtitle">${profile.heroSubtitle}</p>

          <div class="hero-actions">
            <a class="button button-primary" href="#experience">${hero.primaryAction}</a>
            <a class="button button-secondary" href="#projects">${hero.secondaryAction}</a>
            <button class="button button-secondary" type="button" data-resume-export>${resume.exportButton}</button>
          </div>

          <div class="hero-metrics">
            ${hero.metrics.map((metric) => `
              <div class="metric">
                <strong>${metric.value}</strong>
                <span>${metric.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <aside class="profile-card profile-card-with-photo fade-in delay-2" id="about" aria-label="Professional summary card">
          <div class="profile-photo-frame">
            ${profilePhoto
              ? `<img class="profile-photo" src="${profilePhoto}" alt="${profile.name}" loading="eager" />`
              : `<div class="avatar">${profile.initials}</div>`
            }
          </div>

          <div class="profile-card-content">
            <h2>${profile.name}</h2>
            <p>${profile.profileSummary}</p>

            <div class="contact-list">
              <a class="contact-item" href="mailto:${profile.email}">${common.email} · ${profile.email}</a>
              <a class="contact-item" href="tel:${safePhoneHref(profile.phone)}">${common.phone} · ${profile.phone}</a>
              <span class="contact-item">${common.location} · ${profile.location}</span>
              <a class="contact-item" href="${profile.githubUrl}" target="_blank" rel="noreferrer">${common.github} · ${new URL(profile.githubUrl).pathname.slice(1)}</a>
              <a class="contact-item" href="${profile.linkedinUrl}" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">${common.linkedin} · ${common.addLinkedInUrl}</a>
            </div>
          </div>
        </aside>
      </section>
    `;
  }
}

customElements.define('hero-section', HeroSection);
