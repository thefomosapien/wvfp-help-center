# WVFP Rules Assistant

A public-facing help-center chat widget for [wvfastpitch.org](https://wvfastpitch.org)
that answers parent/coach/player questions using West Valley Fast Pitch's Rules &
Regulations, By-Laws, waiver form, ballpark reminders, and D1 Prospects' tournament
master rules. No user accounts, no saved chat history — every answer is generated live
from `data/knowledge.txt`.

## How it works

```
Browser (chat UI)  →  POST /api/chat  →  Vercel serverless function  →  Anthropic API
                                          (holds ANTHROPIC_API_KEY,
                                           never sent to the browser)
```

The Anthropic API key lives only on the server. The browser talks to this app's own
`/api/chat` route, which builds the system prompt (instructions + knowledge base),
calls Anthropic, and returns just the answer text.

## Project structure

- `app/page.tsx` — the three-view UI (Home category grid → Category → Chat)
- `app/api/chat/route.ts` — server route that calls Anthropic (holds the API key)
- `lib/questions.ts` — canonical question registry and category taxonomy
- `lib/systemPrompt.ts` — assistant instructions + knowledge base loader (cached)
- `data/knowledge.txt` — the rules knowledge base (static text, versioned in git)

## Navigation

The home screen shows an 8-category grid. Tapping a category lists its common
questions; tapping any question — or typing your own in the bottom search bar — opens
a chat thread answered live from `data/knowledge.txt`. The category/question lists are
just a navigable front door to the same assistant; there's no pre-written FAQ content.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Only `ANTHROPIC_API_KEY` is required to run — there is no database to configure.

## Model & cost

- Default model: `claude-haiku-4-5-20251001` (cheap, fast, plenty capable for grounded
  Q&A). Set `ANTHROPIC_MODEL=claude-sonnet-5` to use the sharper model (~2x cost).
- The ~20K-token system prompt is sent with a `cache_control` block, so its reused
  portion is billed at the cheap cached-read rate after the first request. Expect
  roughly $1–3/month for typical rec-league traffic.

## Abuse protection

This is an unauthenticated public endpoint, so `/api/chat` includes:

- A capped `max_tokens` (1000).
- A best-effort in-memory per-IP rate limit (`lib/rateLimit.ts`). Serverless instances
  are ephemeral, so for stronger guarantees swap in Upstash Redis.
- An optional `Origin`/`Referer` allow-list — set `ALLOWED_ORIGINS` (comma-separated)
  to restrict callers to your own site.

## Deployment (Vercel)

1. Get an API key at **platform.claude.com** (separate from any claude.ai subscription).
2. Push this repo to GitHub and import it in Vercel.
3. In the Vercel project: **Settings → Environment Variables** → add `ANTHROPIC_API_KEY`.
4. Deploy. No database or storage integration is needed.

Never commit the API key or expose it via a `NEXT_PUBLIC_*` variable.

## Note before going public

The D1 Prospects document is marked "Not for distribution." That almost certainly
targets resale/republishing rather than a partner league referencing it for its own
families, but since this bot exposes its contents to the general public, confirm with
your D1 Prospects contact before launch.
