# Professional Profile Website

Professional portfolio / CV landing page for Gerardo Agustín Cabrera.

## What is included

- Wider layout with more breathing room.
- Career map redesigned as animated branch accordions.
- Branches open and close with smooth transitions.
- A selected-career detail panel updates with smooth animation.
- Personal Projects section with selected GitHub repositories.
- Additional Aptitudes section for Blender, Godot, CrewAI, LangChain, LangGraph and related skills.
- Bilingual support: English and Spanish.
- English is the default language.
- Language switch in the navbar.
- Language preference is saved in `localStorage`.

## Tech stack

- Vite
- Vanilla JavaScript
- Native Web Components
- Modular CSS
- No external UI framework

## Project structure

```txt
professional-profile-site/
├─ index.html
├─ package.json
├─ README.md
└─ src/
   ├─ main.js
   ├─ i18n.js
   ├─ data/
   │  └─ translations.js
   ├─ components/
   │  ├─ SiteNavbar.js
   │  ├─ HeroSection.js
   │  ├─ FocusSection.js
   │  ├─ CareerMapSection.js
   │  ├─ ProjectsSection.js
   │  ├─ AdditionalAptitudesSection.js
   │  ├─ SkillsSection.js
   │  ├─ EducationSection.js
   │  ├─ SiteFooter.js
   │  └─ utils.js
   └─ styles/
      └─ global.css
```

## How to run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Where to edit content

All English and Spanish content is centralized in:

```txt
src/data/translations.js
```

The language behavior is handled in:

```txt
src/i18n.js
```

Default language:

```js
const DEFAULT_LANGUAGE = 'en';
```

## Resume PDF export

The project includes a free, browser-native CV export flow:

- The navbar and hero include a `CV PDF` / `Export CV PDF` button.
- The button calls `window.print()`.
- The print stylesheet hides the portfolio UI and renders an ATS-friendly resume layout.
- The user can choose **Save as PDF** from the browser print dialog.
- No paid service, API key, or PDF generation dependency is required.

Editable resume content lives in:

```txt
src/data/translations.js
```

Look for the `resume` object under both `en` and `es`.

Why this approach is ATS-friendly:

- Text remains selectable and searchable.
- The layout avoids heavy graphics, canvas rendering and rasterized HTML screenshots.
- Sections use simple headings, paragraphs and bullet lists.
- Contact URLs are printed as plain text.


## Scalable experience model

From v7 onward, professional experience has a single source of truth:

```txt
src/data/translations.js
```

Look for:

```js
experience: {
  items: [...]
}
```

Each experience item can control where it appears:

```js
{
  id: 'new-role',
  sortOrder: 70,
  period: '2026 - Present',
  year: '2026 — Present',
  role: 'Role title',
  company: 'Company name',
  nodeTitle: 'Short card title',
  nodeSummary: 'Short card summary',
  pill: 'Short label',
  summary: 'Longer detail used by the Career Map.',
  bullets: [
    'Bullet used by both Career Map and PDF export.'
  ],
  tags: ['Tag 1', 'Tag 2'],
  branches: ['qa', 'leadership', 'data'],
  showInCareerMap: true,
  showInResume: true
}
```

The Career Map reads from `experience.items`.

The exported PDF also reads from `experience.items`, filtered by:

```js
showInResume: true
```

If you want an item to appear only in the Career Map, use:

```js
showInResume: false
```

Example: formal education or a professional transition node.

## Profile photo integration

The hero profile card uses a professional portrait stored at:

```txt
public/images/profile-professional.png
```

The image path is controlled from:

```txt
src/data/translations.js
```

Look for:

```js
profile: {
  photoUrl: '/images/profile-professional.png'
}
```

To replace the photo later, keep the same filename or update `photoUrl` in both `en.profile` and `es.profile`.
