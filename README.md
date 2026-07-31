# PHILX Solutions — Enterprise IT & Software Solutions Website

A high-performance, minimalist web application for **PHILX Solutions**, built using a **Headless WordPress** CMS architecture powered by **HTMX** and **Tailwind CSS**.

![Brand Palette](https://img.shields.io/badge/Palette-Monochrome%20Black%20%26%20White-black)
![Tech Stack](https://img.shields.io/badge/Stack-WordPress%20%7C%20HTMX%20%7C%20Tailwind-black)

---

## 🚀 Overview

PHILX Solutions provides IT solutions across Website Design, Full-Stack Web Development, Cross-Platform Mobile Applications, and Enterprise Cloud Software (Microsoft 365 & Business Email Solutions).

This codebase delivers a modern, lightweight, server-rendered frontend interface using **HTMX** for dynamic content partial swaps, backed by **Headless WordPress** REST API endpoints for dynamic content management.

---

## 🎨 Design System & Aesthetic

- **Strict Monochrome Palette (High-End Black & White)**:
  - **Backgrounds & Text**: Pure Black (`#000000`) and Pure White (`#FFFFFF`) only.
  - **Typography & Elements**: Solid black and white surfaces, crisp borders, and high contrast editorial layout hierarchy with zero accent colors or gradients.
- **Micro-Interactions**: Smooth hover effects, glassmorphic navigation header (`backdrop-blur-xl`), one-click email copy-to-clipboard chips, and inline feedback loops.

---

## 🛠️ Tech Stack

- **Frontend Core**: HTML5, [HTMX](https://htmx.org/) (v1.9.10), JavaScript (Vanilla ES6+).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN / Utility-first class architecture).
- **Content Management System**: Headless WordPress via WP REST API (`/wp-json/wp/v2/services`).

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
│   ├── services.json     # Fallback mock dataset for local development
│   └── contact-success.html # Inline HTMX submission response feedback
└── .agents/
    └── skills/           # Customized agent skills (ui-ux-pro-max, caveman, etc.)
```

---

## 💻 Getting Started

### Local Development (Standalone)

No complex build step or package installation required. Serve the workspace directory using any standard HTTP server:

```bash
# Using Python builtin HTTP server
python3 -m http.server 8000

# Or using Node npx serve
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 🔒 Workflow & Commit Conventions

Commit messages follow descriptive formatting:
`feat: initialize PHILX Solutions Headless WordPress + HTMX base architecture`

---

## 📄 License

Copyright © 2026 PHILX Solutions. All rights reserved.
