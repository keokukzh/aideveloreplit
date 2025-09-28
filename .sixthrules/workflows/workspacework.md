# Workspace Workflows for AIDevelo.AI

workflows:
  plan-tasks:
    description: Create a 20-min-per-task roadmap for AIDevelo.AI
    steps:
      - prompt: |
          You are my planner for the AIDevelo.AI project. 
          Create a task list (<=20 min per task) to:
          1) Verify/add pricing config & calc with unit tests
          2) Build /products page with three cards (Phone, Chat, Social) toggling activation & persisting to localStorage
          3) Add onboarding skeleton routes /onboarding/{phone,chat,social}
          4) Add public/widget.js and snippet for website chat
          5) Ensure build & deploy to Cloudflare Pages (Vite)
          Output: files to edit/create + Done criteria.

  implement-task:
    description: Safely implement one roadmap task
    inputs:
      - name: task_number
        description: Number of the task to implement
    steps:
      - prompt: |
          Implement TASK {{task_number}} for AIDevelo.AI. 
          Constraints:
          - Modify only the files you listed in the plan.
          - Keep TypeScript strict, Tailwind clean.
          After coding, output:
          1) The diff or new files
          2) Manual test steps in browser/terminal
          3) A short rollback note

  qa-local:
    description: Run local quality checks for AIDevelo.AI
    steps:
      - command: npm i
      - command: npm run typecheck
      - command: npm test
      - command: npm run build
      - prompt: |
          Summarize any issues found during typecheck/tests/build.
          If all pass, confirm ready for deploy.

  deploy-pages:
    description: Deploy frontend to Cloudflare Pages
    steps:
      - command: npm run build
      - command: wrangler pages deploy dist
      - prompt: |
          Confirm deployment URL and remind me to test:
          - Logo centered in header
          - Pricing totals (79 / 115.2 / 158.95)
          - Onboarding routes accessible
          - No console errors

  deploy-worker:
    description: Deploy Cloudflare API worker
    steps:
      - command: wrangler deploy
      - prompt: |
          Verify https://aidevelo.ai/api/health responds { ok: true } 
          and summarize any deployment issues.

  post-check:
    description: Verify production basics after deploy
    steps:
      - prompt: |
          Open the deployed site and verify:
          - Header logo centered (desktop + mobile)
          - Product toggle & discount logic correct
          - Onboarding routes load without errors
          - No JS console errors
          Report pass/fail with details.
