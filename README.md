# PHILX Solutions — Enterprise IT & Software Solutions Website

A high-performance, minimalist web application for **PHILX Solutions**, built using a **PHP Laravel / Modern JavaScript** architecture powered by **Tailwind CSS**.

![Brand Palette](https://img.shields.io/badge/Palette-Monochrome%20Black%20%26%20White-black)
![Tech Stack](https://img.shields.io/badge/Stack-Laravel%20%7C%20React%20%7C%20Tailwind-black)

---

## 🚀 Overview

PHILX Solutions provides IT solutions across Website Design, Full-Stack Web Development, Cross-Platform Mobile Applications, Enterprise ERP (Dynamics 365 / SAP), and Enterprise Cloud Software (Microsoft 365 & Business Email Solutions).

This codebase delivers a modern, lightweight, server-rendered frontend interface using modular components for dynamic content partial swaps, backed by REST API endpoints for dynamic content management.

---

## 🎨 Design System & Aesthetic

- **Strict Monochrome Palette (High-End Black & White)**:
  - **Backgrounds & Text**: Pure Black (`#000000`) and Pure White (`#FFFFFF`) only.
  - **Typography & Elements**: Solid black and white surfaces, crisp borders, and high contrast editorial layout hierarchy with zero accent colors or gradients.
- **Micro-Interactions**: Smooth hover effects, glassmorphic navigation header (`backdrop-blur-xl`), one-click email copy-to-clipboard chips, and inline feedback loops.

---

## 🛠️ Tech Stack

- **Frontend Core**: HTML5, JavaScript (Vanilla ES6+), React / Vue.js.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), compiled at build time via the Tailwind CLI (`tailwind.config.js` → `assets/tailwind.css`). Not loaded from the Play CDN — that's dev-only and was measurably slow on mobile.
- **Backend & APIs**: Vercel serverless functions under `/api` (contact form + GA config), REST-style static endpoints (`/data/services.json`).

---

## 📁 Repository Structure

```text
philx-solutions/
├── AGENTS.md             # Project guidelines and agent execution rules
├── index.html            # Main HTML5 base layout shell
├── js/
│   └── wp-api.js         # WordPress REST API integration & HTMX event transformer
├── partials/
│   ├── navbar.html       # Glassmorphic header with PX monogram logo & CTA
│   ├── hero.html         # High-impact minimalist hero section
│   ├── services.html     # Dynamic services grid loaded via HTMX
│   ├── contact.html      # Interactive lead inquiry contact form
│   └── footer.html       # Clean multi-column footer
├── api/
│   ├── contact.js        # Vercel serverless function: contact form submission
│   └── config.js         # Vercel serverless function: exposes GA measurement ID
├── data/
│   └── services.json     # Static dataset loaded via HTMX
├── tailwind.config.js    # Tailwind build configuration
├── src/tailwind-input.css # Tailwind entry point (compiles to assets/tailwind.css)
└── .agents/
    └── skills/           # Customized agent skills (ui-ux-pro-max, caveman, etc.)
```

---

## 💻 Getting Started

### Local Development

Tailwind CSS is compiled at build time (not loaded from a CDN), so a one-time install + build is required before serving the site:

```bash
npm install
npm run build   # compiles assets/tailwind.css once
# or: npm run watch   # recompiles on file changes while you work
```

Then serve the workspace directory using any standard HTTP server:

```bash
# Using Python builtin HTTP server
python3 -m http.server 8000

# Or using Node npx serve
npx serve .
```

Open `http://localhost:8000` in your browser. Note that `/api/*` serverless functions (contact form, GA config) only run under Vercel — use `vercel dev` or a Vercel Preview Deployment to test those end-to-end; a plain static server will 404 on them.

On Vercel, `vercel.json` runs `npm run build` automatically on every deploy, so `assets/tailwind.css` is always regenerated fresh — it's gitignored, not committed.

---

## 🔒 Workflow & Commit Conventions

Commit messages follow descriptive formatting:
`feat: initialize PHILX Solutions Headless WordPress + HTMX base architecture`

---

## 📄 License

Copyright © 2026 PHILX Solutions. All rights reserved.
