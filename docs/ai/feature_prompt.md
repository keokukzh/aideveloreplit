You are my full-stack code generator for THIS repository.

Goal: Implement feature "<FEATURE_SUMMARY>".

Deliverables:
1) DB: Drizzle schema + migration for Postgres.
2) API: Routes with zod validation, typed responses, error handling.
3) Client: Page + components + data hooks (list/create/edit/delete) using shadcn/ui.
4) Tests: at least one happy-path test for the API.
5) Docs: add a short "How to run & test <feature>" section in README.

Constraints:
- Reuse existing folder structure and patterns.
- Keep diffs minimal; explain any new deps.
- At the end, output exact shell commands to run locally: (compose up db) -> drizzle generate/migrate -> dev.