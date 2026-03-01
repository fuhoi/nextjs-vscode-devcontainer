# GitHub Copilot Instructions for nextjs-vscode-devcontainer

This repository is a minimal Next.js 13+ application scaffolded with `create-next-app` using the **app router** and **Tailwind CSS**. Most of the interesting work happens under `my-app/`.

## 📁 Project Layout

```
/ (workspace root)
  README.md                 - empty placeholder
  pnpm-workspace.yaml       - workspace config
  my-app/                   - actual Next.js app
    package.json            - scripts & deps
    next.config.ts
    tsconfig.json
    app/                    - the app router
      layout.tsx
      page.tsx
  INSTRUMENTATION_PLAN.md   - high-level design notes for a custom telemetry library
```

Beyond the above there are only a few config files (ESLint, Tailwind, etc.). The root also contains `.agents` for Copilot skills (unrelated to runtime) and a new `.agent-storage` directory used by autonomous agents to keep track of their roadmap and progress.

## 🚀 Common Workflows

- **Development**
  ```bash
  cd my-app
  pnpm install   # or npm/yarn if you prefer
  pnpm dev
  ```
  This starts the Next.js development server at `http://localhost:3000`.

- **Build / Production**
  ```bash
  cd my-app
  pnpm build
  pnpm start
  ```

- **Linting**
  ```bash
  cd my-app
  pnpm lint
  ```

There are no tests configured; if you add them, update the instructions accordingly.

## 🧠 Key Concepts for AI Agents

### Application Architecture
- It’s a **single-package** Next.js project located in `my-app/`. There are no cross-package dependencies.
- Uses the **app directory** (`app/layout.tsx`, `app/page.tsx`). All new pages/components should follow this pattern.
- Styling is handled via Tailwind CSS; class names live directly in JSX.
- TypeScript is enabled by default; add type definitions under the `my-app/` folder.

### Instrumentation Plan
- A markdown file at the repo root (`INSTRUMENTATION_PLAN.md`) outlines a **drop-in client‑side telemetry library**. It describes context providers, hooks, IndexedDB usage, batch uploading, and OpenTelemetry compatibility.
- New features related to instrumentation should be organized under an `instrumentation/` directory as outlined in that plan.
- Progress on implementation is tracked using markdown docs inside `instrumentation/docs/` per the recommended folder structure.

### Conventions & Patterns
- Avoid unnecessary dependencies; the project aims to build custom solutions when reasonable (see instrumentation plan for example).
- Use React hooks and context extensively; the plan explicitly names hooks like `useInstrumentation`/`usePageSpan`.
- When editing `next.config.ts` or adding new configuration, maintain TypeScript typing as shown in the existing file.
- Components are function components exported as defaults when they represent pages; named exports for utilities/helpers.

### Agent Storage & Roadmap
- Agents should consult `.agent-storage/roadmap.md` to discover planned features.
- Each roadmap entry gets a directory (`.agent-storage/<feature>/`) with its own `plan.md`.
- Agents must keep these files up to date and may reference `.github/copilot-agent-storage.md` for guidelines.

### External Integrations
- There are no backend APIs defined in this repo. If instrumentation code references endpoints, assume they will be specified via configuration loaded at runtime (see `config.ts` in the plan).
- The project uses pnpm but the instructions work with npm/yarn too; only one app package is managed.

## 🧩 Helpful Hints for Future Work

- The `my-app/app` directory is minimal; add new routes there using the app router conventions (`page.tsx`, optional `loading.tsx`, etc.).
- To implement the instrumentation library, follow the plan’s step-by-step sections and match folder structure.
- Any new scripts should be added to `my-app/package.json` and referenced in this file.

---

If you’re uncertain about something, check the minimal example files in `my-app/app` or the instrumentation plan for guidance. Feel free to ask for clarification about domain-specific choices.
