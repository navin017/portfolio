# Naveen Elango — Portfolio

React + Vite single-page portfolio. All content lives in `src/data.js`; keep it in sync with the resume.

## Run locally
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # output in dist/

## AI assistant ("Ask AI about me")
- `api/chat.js` is a serverless function that streams Google Gemini answers. `api/_prompt.js` builds the system prompt from `src/data.js`.
- Get a free key at https://aistudio.google.com/apikey, then copy `.env.example` to `.env.local` and paste the key there.
  `.env.local` is git-ignored. Never commit the key.
- In `npm run dev`, a Vite middleware runs the same function locally. Restart the dev server after adding the key.
- On Vercel: Project → Settings → Environment Variables → add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
- Safeguards: 500 characters per message, last 10 turns, 10 requests per minute per IP, and answers grounded in profile data only.
  In Google AI Studio, also set a spending cap or keep the key on the free tier.

## Update the resume download
Replace `public/Naveen_Elango_Resume.pdf` with the latest PDF from the parent folder.

## Deploy (free) and point naveenelango.link at it
Option A: Vercel (easiest)
1. Push this folder to GitHub (for example, your existing `navin017/portfolio` repo).
2. On vercel.com, import the repo. Framework preset: Vite. Then deploy.
3. In Project → Settings → Domains, add `naveenelango.link`. Vercel shows the DNS records to add.
4. Add those records wherever the domain is registered. Check your registrar or Gravatar/WordPress.com
   if you bought it through them. Then remove the old Gravatar redirect.

Option B: GitHub Pages
- `public/CNAME` already contains `naveenelango.link`.
- Deploy `dist/` with a GitHub Actions Pages workflow, then set the custom domain under repo Settings → Pages.
