---
name: ui-ux-pro-max
description: Enforce professional design systems, layout patterns, Tailwind component architecture, and the strict two-color minimalist palette (Royal Blue #2563EB with clean light/dark surfaces) for PHILX Solutions HTMX website.
---

# UI/UX Pro Max Skill — PHILX Solutions Design System

This skill enforces high-end, modern design systems, clean layout patterns, and robust Tailwind CSS component architecture specifically tailored for PHILX Solutions.

## Core Design Principles & Aesthetic Guidance

1. **Strict Two-Color Palette Focus**:
   - **Primary Accent**: Royal Blue (`#2563EB` / Tailwind `bg-blue-600`, `text-blue-600`, `border-blue-600`, `hover:bg-blue-700`).
   - **Surfaces & Backgrounds**: Clean Crisp White (`#FFFFFF` / `bg-white`) for light mode, paired with Dark Navy / Charcoal (`#0F172A` / `bg-slate-900`, `#1E293B` / `bg-slate-800`) for dark mode surfaces.
   - **Text Hierarchy**: High contrast navy/slate (`text-slate-900` in light mode, `text-slate-100` in dark mode) and subtle muted tones (`text-slate-500` / `text-slate-400`).

2. **Typography & Hierarchy**:
   - Clean sans-serif font stack (`Inter`, `System UI`, `-apple-system`).
   - Strong typographic scale: Hero headlines (`text-4xl md:text-6xl font-extrabold tracking-tight`), Section titles (`text-2xl md:text-3xl font-bold`), Body text (`text-base md:text-lg leading-relaxed`).

3. **Layout & Component Architecture (HTMX Partials)**:
   - **Base Container**: Max-width constraints (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
   - **Cards & Grids**: Minimalist card design with subtle borders (`border border-slate-200 dark:border-slate-800`), refined rounded corners (`rounded-xl` or `rounded-2xl`), subtle shadows (`shadow-sm hover:shadow-md transition-shadow duration-300`).
   - **Micro-Animations & Transitions**: Smooth hover states (`transition-all duration-200 ease-in-out`), scale effects (`hover:-translate-y-0.5`), and active feedback.

4. **Component Specific Standards**:
   - **Navigation Bar (`partials/navbar.html`)**: Sticky header, glassmorphism (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`), sharp PX monogram branding, and prominent "Get a Quote" Royal Blue button (`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg`).
   - **Hero Section (`partials/hero.html`)**: High-impact headlines, dual CTAs, subtle grid pattern background.
   - **Services Grid (`partials/services.html`)**: 4 core pillars (Website Design, Web Development, Mobile Apps, Enterprise Software & Cloud) in clean responsive grid cards with iconography.
   - **Value Proposition (`partials/value.html`)**: Feature callouts emphasizing speed, security, scalability, and code excellence.
   - **Interactive Contact Form (`partials/contact.html`)**: Form inputs styled with clear focus rings (`focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none`), paired with HTMX async posting.
   - **Footer (`partials/footer.html`)**: Clean multi-column layout with copyright, links, and contact handles.
