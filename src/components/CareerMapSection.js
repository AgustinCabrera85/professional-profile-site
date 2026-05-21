import { getContent } from '../i18n.js';
import { renderListItems, renderTags } from './utils.js';

class CareerMapSection extends HTMLElement {
  connectedCallback() {
    this.selectedItemId = 'overview';
    this.openBranches = new Set(['complete']);
    this.render();
    this.boundLanguageChange = () => {
      this.render();
      this.renderDetail(this.selectedItemId);
    };
    window.addEventListener('languagechange', this.boundLanguageChange);
  }

  disconnectedCallback() {
    window.removeEventListener('languagechange', this.boundLanguageChange);
  }

  getSortedExperienceItems() {
    const { experience } = getContent();
    return [...experience.items]
      .filter((item) => item.showInCareerMap !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getBranchItems(branchId) {
    const { career } = getContent();
    const items = this.getSortedExperienceItems();

    if (branchId === 'complete') {
      return [career.overviewNode, ...items];
    }

    return items.filter((item) => item.branches?.includes(branchId));
  }

  render() {
    const { career } = getContent();

    this.innerHTML = `
      <section id="experience" class="career-section reveal visible">
        <div class="section-header section-header-wide">
          <div>
            <p class="section-kicker">${career.kicker}</p>
            <h2 class="section-title">${career.title}</h2>
          </div>
          <p class="section-copy">${career.copy}</p>
        </div>

        <div class="career-toolbar" aria-label="Career branch shortcuts">
          ${career.branches.map((branch) => `
            <button
              class="branch-shortcut ${this.openBranches.has(branch.id) ? 'active' : ''}"
              type="button"
              data-branch-target="${branch.id}"
            >
              ${branch.label}
            </button>
          `).join('')}
        </div>

        <aside class="career-detail-panel career-detail-panel-wide" aria-live="polite"></aside>

        <div class="branch-accordion">
          ${career.branches.map((branch) => this.renderBranch(branch, career)).join('')}
        </div>
      </section>
    `;

    this.bindEvents();
    this.renderDetail(this.selectedItemId);
  }

  renderBranch(branch, career) {
    const isOpen = this.openBranches.has(branch.id);
    const branchItems = this.getBranchItems(branch.id);

    return `
      <article class="career-branch ${isOpen ? 'open' : ''}" data-branch="${branch.id}" data-tone="${branch.tone}">
        <button class="career-branch-header" type="button" data-branch-toggle="${branch.id}" aria-expanded="${isOpen}">
          <span class="branch-meta">
            <span class="branch-dot"></span>
            <span>
              <strong>${branch.title}</strong>
              <small>${branch.subtitle}</small>
            </span>
          </span>
          <span class="branch-count">${branchItems.length} ${career.nodesLabel}</span>
          <span class="branch-arrow">⌄</span>
        </button>

        <div class="career-branch-body">
          <div class="branch-path" aria-hidden="true"></div>
          <div class="branch-node-grid">
            ${branchItems.map((item, index) => this.renderNode(item, index)).join('')}
          </div>
        </div>
      </article>
    `;
  }

  renderNode(item, index) {
    const id = item.id;

    return `
      <button
        class="branch-node-card ${id === this.selectedItemId ? 'active' : ''}"
        style="--i: ${index};"
        type="button"
        data-career-node="${id}"
      >
        <span class="node-year">${item.year}</span>
        <h3>${item.nodeTitle}</h3>
        <p>${item.nodeSummary}</p>
        <span class="node-pill">${item.pill}</span>
      </button>
    `;
  }

  bindEvents() {
    this.querySelectorAll('[data-branch-toggle]').forEach((button) => {
      button.addEventListener('click', () => this.toggleBranch(button.dataset.branchToggle));
    });

    this.querySelectorAll('[data-branch-target]').forEach((button) => {
      button.addEventListener('click', () => this.focusBranch(button.dataset.branchTarget));
    });

    this.querySelectorAll('[data-career-node]').forEach((button) => {
      button.addEventListener('click', () => this.renderDetail(button.dataset.careerNode));
    });
  }

  toggleBranch(branchId) {
    if (this.openBranches.has(branchId)) {
      this.openBranches.delete(branchId);
    } else {
      this.openBranches.add(branchId);
    }

    this.refreshBranchState();
  }

  focusBranch(branchId) {
    this.openBranches = new Set([branchId]);
    this.refreshBranchState();

    const branch = this.querySelector(`[data-branch="${branchId}"]`);
    branch?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  refreshBranchState() {
    this.querySelectorAll('.career-branch').forEach((branch) => {
      const branchId = branch.dataset.branch;
      const isOpen = this.openBranches.has(branchId);
      branch.classList.toggle('open', isOpen);

      const header = branch.querySelector('.career-branch-header');
      header?.setAttribute('aria-expanded', String(isOpen));
    });

    this.querySelectorAll('.branch-shortcut').forEach((button) => {
      button.classList.toggle('active', this.openBranches.has(button.dataset.branchTarget));
    });
  }

  getCareerItemById(id) {
    const { career, experience } = getContent();

    if (id === career.overviewNode.id) return career.overviewNode;

    return experience.items.find((item) => item.id === id) || career.overviewNode;
  }

  renderDetail(id) {
    const item = this.getCareerItemById(id);
    this.selectedItemId = item.id;

    const detailPanel = this.querySelector('.career-detail-panel');
    if (!detailPanel) return;

    detailPanel.classList.remove('detail-enter');
    void detailPanel.offsetWidth;

    detailPanel.innerHTML = `
      <div>
        <p class="detail-kicker">${item.year}</p>
        <h3>${item.role || item.nodeTitle}</h3>
        <p class="detail-company">${item.company || ''}</p>
      </div>

      <div>
        <p class="detail-summary">${item.summary}</p>
        <ul class="detail-list">${renderListItems(item.bullets)}</ul>
        <div class="detail-tags">${renderTags(item.tags, 'detail-tag')}</div>
      </div>
    `;

    detailPanel.classList.add('detail-enter');

    this.querySelectorAll('[data-career-node]').forEach((node) => {
      node.classList.toggle('active', node.dataset.careerNode === item.id);
    });
  }
}

customElements.define('career-map-section', CareerMapSection);
