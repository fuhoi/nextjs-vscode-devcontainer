# Agent Storage Guidelines

This document tells autonomous agents how to use the `.agent-storage` directory as
a persistent workspace for planning, progress, and resumption.

## Structure

```
.agent-storage/
  roadmap.md          # global feature list; updated by all agents
  <feature-name>/     # one folder per roadmap entry
    plan.md           # living plan + progress notes for this feature
```

## Usage

1. **Reading the roadmap**
   * On startup, the agent should open `.agent-storage/roadmap.md`.
   * Look for unchecked items (e.g. `- [ ] browse-products`).
   * Select a feature to work on and navigate into its folder.

2. **Updating progress**
   * Inside the feature directory, append to `plan.md` with dates and short notes:
     ```markdown
     - 2026-03-01 10:00 – created skeleton component
     ```
   * If a subtask completes, mark it within the list (e.g. `- [x] scaffold page`).
   * When the entire feature is finished, update `roadmap.md` by marking the
     bullet as completed (strike-through or `[x]`).

3. **Resuming work later**
   * On subsequent runs, read the last entries in `plan.md` and resume from the
     last incomplete subtask.
   * Add a `resume.md` note if you need to leave contextual information about where
     to pick up.

4. **Human involvement**
   * Developers can open the roadmap to add new features or re-prioritize.
   * They can also inspect individual `plan.md` files for detailed history.

5. **Agent responsibilities**
   * Always keep `roadmap.md` and the active feature’s `plan.md` up to date.
   * Commit changes to git if the agent is running in a repo environment.
   * Do not create additional top‑level files; keep all state within `.agent-storage`.

This guideline should be referenced by any agent that needs to track long-running
work across sessions.
