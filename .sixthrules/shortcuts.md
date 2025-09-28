# AIDevelo.AI Workspace Workflows

workflows:
  plan:
    description: Plan tasks for AIDevelo.AI
    steps:
      - prompt: |
          You are my planner for AIDevelo.AI. 
          Create <=20min tasks to:
          1) Verify/add pricing config & calc with unit tests
          2) Build /products page with Phone, Chat, Social cards
          3) Add onboarding skeleton routes
          4) Add public/widget.js with snippet
          5) Ensure build & deploy to Cloudflare Pages
          Output: files to edit/create + Done criteria.

  impl:
    description: Implement one roadmap task
    inputs:
      - name: task
        description: Task number to implement
    steps:
      - prompt: |
          Implement TASK {{task}} for AIDevelo.AI. 
          Only touch files listed in the plan. 
          Output: diffs, manual test steps, rollback note.

  qa:
    description: Local QA for AIDevelo.AI
    steps:
      - command: npm i
      - command: npm run typecheck
      - command: npm test
      - command: npm run build
      - prompt: |
          Report any errors. If all pass, confirm project ready to deploy.

  deploy:
    description: Deploy AIDevelo.AI frontend
    steps:
      - command: npm run build
      - command: wrangler pages deploy dist
      - prompt: |
          Confirm deployment URL and test:
          - Logo centered
          - Pricing totals: 79 / 115.2 / 158.95
          - Onboarding routes accessible
          - No console errors

  worker:
    description: Deploy API Worker
    steps:
      - command: wrangler deploy
      - prompt: |
          Check https://aidevelo.ai/api/health returns { ok: true }.
          Report status.

  check:
    description: Post-deploy validation
    steps:
      - prompt: |
          Verify production:
          - Logo centered
          - Toggle & discount logic correct
          - Onboarding routes load
          - No JS console errors
          Report pass/fail.
