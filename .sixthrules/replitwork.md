# AIDevelo.AI Workspace Rules

## Business Context
- Brand: AIDevelo.AI
- Modular products (individually activatable):
  1) AI Phone Agent (€79)
  2) AI Website Chat Agent (€49)
  3) AI Social Media Agent (€59)
- Discounts: 2 modules → 10% off subtotal; 3 modules → 15% off.
- Messaging (EN): “Pick only what you need. No bundles.”

## Required UX
- Header with centered logo (desktop + mobile).
- Landing sections: Hero, Product cards, Pricing summary, References, FAQ, CTA.
- Products page `/products` with three cards (activate toggles, persist to localStorage).
- Onboarding skeleton routes:
  - `/onboarding/phone` (provider stub, calendar, hours, test call)
  - `/onboarding/chat` (widget snippet, knowledge link, verify install)
  - `/onboarding/social` (connect accounts, cadence, first draft, schedule test)

## File Layout (do not break)
- `src/lib/pricing/config.ts` and `src/lib/pricing/calc.ts` (single source of truth).
- `src/components/PricingSummary.tsx` uses the calc.
- `public/widget.js` (or `/client/widget.js`) for website chat snippet demo.
- Optional API (Cloudflare Worker) under `/cloudflare/worker/src/index.ts`.

## ENV Keys (document only, don't hardcode)
- `VITE_API_BASE_URL`, `STRIPE_SECRET`, `OPENAI_API_KEY` or `OPENROUTER_API_KEY`, `AI_PROVIDER`, `AI_MODEL`.

## Deploy Targets
- Frontend: Cloudflare Pages (Vite build to `dist/`).
- API: Cloudflare Workers with `wrangler` and a route `aidevelo.ai/api/*`.

## Guardrails
- No redesign of color tokens; reuse existing look.
- Keep module prices & discount logic in `config.ts` / `calc.ts` only.
- Any new dependency must be justified; prefer zero-dep utilities.
