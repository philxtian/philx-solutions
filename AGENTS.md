# Agent Instructions: PHILX Solutions Website (Full-Stack Enterprise Architecture)

## 1. Project Overview & Architecture
* **Company Name:** PHILX Solutions
* **Nature of Business:** IT Solution Provider (Website Design, Web Development, Mobile Applications, Enterprise Software like Dynamics 365, SAP, Microsoft 365 & Email Solutions).
* **Backend:** PHP Laravel & Enterprise REST APIs acting as data source.
* **Frontend:** Modern HTML/Tailwind templates interacting with REST API endpoints.
* **Brand Vibe / Aesthetic:** Modern, minimalist, clean, tech-forward, and professional. Strict monochrome black-and-white palette.

---

## 2. Technical Stack & Execution Rules
* **File Management:** Always use **NANO** for any text file editing or terminal configurations. Strictly **avoid VIM**.
* **Active Skills Directory:** `ui-ux-pro-max`, `everything-claude-code`, `caveman`, `api-design`.

---

## 3. Component Architecture & Integration Flow
1. **Content Fetching / Partials:**
   * Modular component structure for Services, Competencies, and Contact form.
   * Fetch data dynamically from REST endpoints (e.g., `hx-get="api/services.json"`).
2. **Core Components (`partials/`)**
   * **Navigation & Hero:** Static templates styled with Tailwind CSS.
   * **Services Grid:** Dynamically populated via REST API swaps.
   * **Contact Form:** Submits lead details securely to REST API endpoint.

---

## 4. Workflow & Git Commit Rules
* **Strict Commit Rule:** Always execute a git commit with a clear, descriptive message immediately after completing any major feature change or component integration.

## 5. Design Language & Aesthetic (Strict Black & White)
*   **Vibe:** Ultra-minimalist, premium, high-tech, and monochromatic. Absolute visual restraint.
*   **Color Palette (NO ACCENT COLORS):**
    *   Backgrounds: Pure Black (`#000000`) only.
    *   Text/Typography: Pure White (`#FFFFFF`) only.
    *   UI Elements (Buttons/Borders): Pure White (`#FFFFFF`) only. NO BLUE AT ALL.
*   **Execution:** Remove all gradients and glows. All elements must be flat, sharp, and monochromatic. Use whitespace aggressively for hierarchy.

## 6. Graphify Knowledge Graph Integration
- **Token Efficiency:** This project utilizes Graphify to map codebase structures and entity relationships locally.
- **Pre-flight Query Rule:** Before instructing agents to read raw code files, documentation folders, or deep hierarchies for architectural questions, query the local knowledge graph (`graphify-out/graph.json` or use the `/graphify` skill) to minimize context token consumption.
- **Post-Change Sync:** Always run `graphify .` after completing major structural code additions, component changes, or file restructurings to keep the local graph current.