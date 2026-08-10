# Graph Report - /Users/philip/Sites/philx-solutions  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 31 nodes · 28 edges · 10 communities (6 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `243bd632`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Main Layout Shell
- animations.js
- Agent Instructions
- Navigation Bar
- wp-api.js
- Main Logo
- Full Transparent Logo
- Default Logo Mark
- Transparent Logo

## God Nodes (most connected - your core abstractions)
1. `Main Layout Shell` - 8 edges
2. `initAll()` - 4 edges
3. `handleContactSubmit()` - 3 edges
4. `Agent Instructions` - 3 edges
5. `Navigation Bar` - 3 edges
6. `initScrollReveals()` - 2 edges
7. `initMagneticElements()` - 2 edges
8. `initAdaptiveNavbar()` - 2 edges
9. `setLoadingState()` - 2 edges
10. `renderErrorMessage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `PHILX Solutions README` --references--> `Main Layout Shell`  [INFERRED]
  README.md → index.html
- `Main Layout Shell` --references--> `Footer`  [EXTRACTED]
  index.html → partials/footer.html
- `Navigation Bar` --references--> `Black Logo Mark`  [EXTRACTED]
  partials/navbar.html → assets/logo-mark-black.png
- `Navigation Bar` --references--> `White Logo Mark`  [EXTRACTED]
  partials/navbar.html → assets/logo-mark-white.png
- `Footer` --references--> `Black Logo Mark`  [EXTRACTED]
  partials/footer.html → assets/logo-mark-black.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **HTMX Partial Loading Flow** — index_html, partials_navbar, partials_hero, partials_services, partials_contact, partials_footer [EXTRACTED 1.00]
- **Brand Visual Identity** — assets_logo_mark_black, assets_logo_mark_white, assets_logo_mark, assets_logo, partials_navbar, partials_footer [EXTRACTED 0.90]

## Communities (10 total, 4 thin omitted)

### Community 0 - "Main Layout Shell"
Cohesion: 0.25
Nodes (8): Contact Success Response, Main Layout Shell, About Section, Contact Form, Expertise Section, Hero Section, Services Grid, PHILX Solutions README

### Community 1 - "animations.js"
Cohesion: 0.70
Nodes (4): initAdaptiveNavbar(), initAll(), initMagneticElements(), initScrollReveals()

### Community 2 - "Agent Instructions"
Cohesion: 0.50
Nodes (4): Agent Instructions, API Design Skill, UI/UX Pro Max Skill, Caveman Skill

### Community 3 - "Navigation Bar"
Cohesion: 0.50
Nodes (4): Black Logo Mark, White Logo Mark, Footer, Navigation Bar

### Community 4 - "wp-api.js"
Cohesion: 0.83
Nodes (3): handleContactSubmit(), renderErrorMessage(), setLoadingState()

## Knowledge Gaps
- **14 isolated node(s):** `PHILX Solutions README`, `Hero Section`, `Services Grid`, `About Section`, `Expertise Section` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Main Layout Shell` connect `Main Layout Shell` to `Navigation Bar`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `Navigation Bar` connect `Navigation Bar` to `Main Layout Shell`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `PHILX Solutions README`, `Hero Section`, `Services Grid` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._