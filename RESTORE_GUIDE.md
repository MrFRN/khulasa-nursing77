# Khulasa Nursing — Existing Codebase Restore Guide

This package is an existing Vite/React/TypeScript codebase extracted from the KHULASA1 backup. It is NOT a design reference and must be imported as an existing project.

## Stack
- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Supabase
- Framer Motion
- Vercel serverless API files under `api/`

## Important
Do not rebuild the site from screenshots or prompts. Open/import this exact codebase and continue it.

Do not commit real secrets. Copy `.env.example` to the platform's environment-variable settings and add the real values there.

## Main routes
- /
- /study
- /books
- /interview
- /resource/:id
- /search
- /favorites
- /login
- /admin
- /admin/resources
- /admin/upload
- /admin/categories
- /admin/settings
- /admin/ai
- /clinical-assistant
- /ai-assistant
- /ai-assistant/care-plan
- /ai-assistant/calculator
- /ai-assistant/case
- /ai-assistant/mcq
- /ai-assistant/interview
- /ai-assistant/pdf
- /ai-assistant/chat
- /ai-assistant/dictionary
- /ai-assistant/ecg
- /ai-assistant/lab
- /ai-assistant/drug
- /ai-assistant/exam

## Restore workflow
1. Import this repository/folder as an EXISTING project.
2. Do not create a replacement website.
3. Configure environment variables from `.env.example`.
4. Install dependencies with the package manager supported by the host.
5. Run the existing build: `npm run build` (or the platform's equivalent).
6. Only after the existing build works, begin requested modifications.

## Supabase
The code expects existing Supabase configuration and data/storage. Do not reset or recreate the database until the existing schema has been inspected.
