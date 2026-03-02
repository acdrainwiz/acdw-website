# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
AC Drain Wiz is a React 19 + TypeScript e-commerce website built with Vite 7, using Netlify serverless/edge functions as its backend. See `ROADMAP.md` for full architecture and feature details.

### Node version
The project requires Node.js 20.19.0 (specified in `.nvmrc`). Use `nvm use` to activate the correct version.

### Running the application
- **Frontend only:** `npm run dev` (Vite dev server on port 5173)
- **Full stack with Netlify functions:** `npm run dev:netlify` (requires `netlify-cli` installed globally and Netlify auth; falls back to Vite-only if not linked)
- For most frontend development work, `npm run dev` is sufficient.

### Lint / Build / Test
- **Lint:** `npm run lint` — pre-existing lint errors exist in the codebase (mostly `@typescript-eslint/no-explicit-any` in mcp-server/ and some src/ files); these are not regressions.
- **Build:** `npm run build` — runs `tsc -b && vite build`.
- **Tests:** No automated test framework is configured. Testing is manual/browser-based only.

### Third-party API keys
The app uses Clerk (auth), Stripe (payments), Resend (email), ShipStation (shipping), and reCAPTCHA (bot protection). Without these keys the app still renders and navigates, but auth/payment/email flows will not work. See `ROADMAP.md` > "Deployment & Environment" for the full list of required env vars.

### MCP server
The `mcp-server/` directory is a separate Node.js project (development tooling, not part of the website runtime). It has its own `package.json` and requires a separate `npm install` if needed.
