# Rezzident Ecosystem

> **Next-Generation Multi-Tenant Estate Management SaaS Platform**

---

## Ecosystem Components

- ⚙️ **[app/rezzident_BE](./apps/rezzident_BE)**: FastAPI Python Backend + fastguard (PostgreSQL Multi-Tenant Schema Isolation, Redis, Paystack Split Payments, JWT + PIN Auth).
- 💻 **[app/rezzident_FE](./apps/rezzident_FE)**: Modern TanStack Start (React + Vite + TailwindCSS) Web Portal (Community & Admin Management Dashboard).
- 📱 **[app/rezzident_MB](./apps/rezzident_MB)**: Expo / React Native Mobile Application (Community & Security Guard App).

---

## Interactive Model Flowchart & Architecture Visualizer

Rezzident features an automated interactive visual flowchart application for database models, foreign key connections, schema boundaries, and system workflows.

- **Interactive Flowchart Application**: [models_interactive_flowchart.html](./apps/models_interactive_flowchart.html)
- **Architectural Flowchart Report**: [models_and_system_flowchart_report.md](./docs/models_and_system_flowchart_report.md)

### Contributor Automation Pipeline
The interactive flowchart updates **automatically** whenever backend models are updated, added, or deleted:

1. **Git Pre-Commit Hook**:
   Any staged edit inside `apps/rezzident_BE/api/v1/models/*.py` automatically triggers `.git/hooks/pre-commit` to re-parse the SQLAlchemy AST and stage the updated `models_interactive_flowchart.html`.

2. **FastAPI Development Startup**:
   Starting the FastAPI server (`python main.py`) in development mode auto-generates and refreshes the model graph.

3. **Manual Trigger**:
   Contributors can manually regenerate the flowchart anytime by running:
   ```bash
   python3 apps/rezzident_BE/scripts/generate_model_flowchart.py
   ```

---

## Documentation & Markdown Tools

Rezzident heavily uses Markdown (`.md`) for architecture decisions, guidelines, and project planning. 

> **💡 Note:** The [`docs/architecture`](./docs/architecture/01-infrastructure-deployment.md) directory contains all core decisions, architectural guidelines, and execution plans for this project. These are **living documents** and will likely change over time as features evolve and plans adapt based on project requirements and feedback.

Depending on your role, here are the recommended tools to read and write documentation seamlessly:

### For Developers
- **[Visual Studio Code (VS Code)](https://code.visualstudio.com/)**: The standard IDE. We recommend installing the **Markdown All in One** and **Prettier** extensions for auto-formatting and table-of-contents generation.
- **[MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)**: Enforces standard markdown formatting and prevents broken links.

### For Product
- **[Obsidian](https://obsidian.md/)**: A powerful, visual Markdown editor that lets you view all documentation as an interconnected graph. It works directly with local folders (just open the `docs/` or `kickoff/` folder as an Obsidian Vault).
- **[Typora](https://typora.io/)**: A seamless, distraction-free WYSIWYG (What You See Is What You Get) Markdown editor. You don't need to look at raw syntax; it formats as you type. Highly recommended for non-developers.
- **[Notion](https://www.notion.so/)**: While we keep our source of truth in the code repository, you can import `.md` files into Notion for collaborative brainstorming, then export back to Markdown when decisions are finalized.

---

## Getting Started

Check out the detailed guides in each component directory:
- [Backend Development Guide](./apps/rezzident_BE/README.md)
- [Frontend Web Guide](./apps/rezzident_FE/README.md)
- [Mobile App Guide](./apps/rezzident_MB/README.md)
