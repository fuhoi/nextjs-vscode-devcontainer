# instrumentation Plan

This plan file lives inside the feature-specific directory. Agents working on this
feature should append progress notes, mark subtasks complete, and timestamp updates.

The instrumentation plan outlines a generic, drop-in client-side telemetry solution
for Next.js/React. Work will proceed according to the high-level steps in
`INSTRUMENTATION_PLAN.md`.

## Initial tasks

- [ ] read current INSTRUMENTATION_PLAN.md and summarize goals
- [ ] create folder structure under `my-app/instrumentation`
- [ ] implement IndexedDB utilities (`db.ts`)
- [ ] create context/provider (`InstrumentationContext.tsx`)
- [ ] build hooks: `useInstrumentation`, `usePageSpan`, `useApiTracker`, `useConsoleErrorTracker`, `useEventTracker`
- [ ] error boundary component (`InstrumentationErrorBoundary.tsx`)
- [ ] span & event model (`types.ts`)
- [ ] config loader (`config.ts`)
- [ ] batch sender (`uploader.ts`)
- [ ] integrate provider in `_app.tsx`
- [ ] write documentation notes in `docs/` subfolder
- [ ] add tests/validation steps

> Progress updates:
> - 2026-03-01 – initialized plan with tasks
