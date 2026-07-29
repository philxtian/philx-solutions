---
name: everything-claude-code
description: Comprehensive software engineering capabilities including context management, memory tracking, code optimization, robust HTMX partial template structure, and clean backend routing.
---

# Everything Claude Code Skill

This skill provides comprehensive context tracking, architectural discipline, template modularity, and high-performance backend integration for the PHILX Solutions stack.

## Architecture & Code Engineering Guidelines

1. **Modular Template Structure**:
   - Separate UI concerns into clean, single-responsibility HTMX HTML partials.
   - Maintain partial isolation: Partials should strictly define their outer wrapper and HTMX attributes (`hx-get`, `hx-post`, `hx-target`, `hx-swap`).

2. **Backend & HTMX Integration Rules**:
   - Support clean RESTful endpoints designed for HTMX swaps (e.g. `/api/contact` returning HTML response fragments or dynamic status templates).
   - Use standard swap triggers: `hx-swap="outerHTML"` or `hx-swap="innerHTML"`.
   - Maintain clean state management without unnecessary full page refreshes.

3. **Code Optimization & Quality**:
   - Maintain DRY principles across HTML templates and backend routes.
   - Enforce semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Validate form submissions cleanly and return inline response indicators.
