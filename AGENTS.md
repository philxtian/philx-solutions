# Agent Instructions: PHILX Solutions Website (WordPress + HTMX Stack)

## 1. Project Overview & Architecture
* **Company Name:** PHILX Solutions
* **Nature of Business:** IT Solution Provider (Website Design, Web Development, Mobile Applications, Enterprise Software like Microsoft 365 & Email Solutions).
* **Backend:** Headless WordPress (REST API or WPGraphQL) acting as the CMS and data source.
* **Frontend:** Server-rendered or static HTML/Tailwind templates interacting with WordPress endpoints via **HTMX**.
* **Brand Vibe / Aesthetic:** Modern, minimalist, clean, tech-forward, and professional. Strict two-color palette (Vibrant Royal Blue `#2563EB` paired with crisp light/dark surfaces).

---

## 2. Technical Stack & Execution Rules
* **File Management:** Always use **NANO** for any text file editing or terminal configurations. Strictly **avoid VIM**.
* **Active Skills Directory:** `ui-ux-pro-max`, `everything-claude-code`, `caveman`, `api-design`.

---

## 3. WordPress Integration & HTMX Flow
1. **Content Fetching / Partials:**
   * Use WordPress Custom Post Types or ACF (Advanced Custom Fields) for Services and Portfolio items.
   * Configure HTMX to fetch data dynamically from WordPress REST endpoints (e.g., `hx-get="/wp-json/wp/v2/services"`).
2. **Core Components (`partials/`)**
   * **Navigation & Hero:** Static templates styled with Tailwind CSS.
   * **Services Grid:** Dynamically populated via HTMX partial swaps from WordPress.
   * **Contact Form:** Submits lead details securely to a custom WordPress REST API endpoint or plugin handler.

---

## 4. Workflow & Git Commit Rules
* **Strict Commit Rule:** Always execute a git commit with a clear, descriptive message immediately after completing any major feature change or component integration.

## 5. Design Language & Aesthetic (Apple x Antigravity)
* **Vibe:** Ultra-clean minimalist structure meets futuristic developer-first tooling.
* **Color Palette:** Deep dark space surfaces (`#0A0A0C`), crisp white/silver text contrast, frosted glass borders (`border-white/10`), and radiant Royal Blue (`#2563EB`) accents with subtle luminous glows.
* **Typography:** Tight tracking, bold high-impact headings, and excellent readability across all viewports.