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

- `app/page.tsx` — the three-view chat UI (Home → Category → Chat)
- `app/api/chat/route.ts` — server route that calls Anthropic (holds the API key)
- `app/api/track/route.ts` — `POST { id }` → increments a usage counter in Vercel KV
- `app/api/popular/route.ts` — `GET` → returns per-question counts for ranking
- `lib/questions.ts` — canonical question registry, categories, matching + ranking logic
- `lib/systemPrompt.ts` — assistant instructions + knowledge base loader (cached)
- `lib/kv.ts` — Redis (Upstash) wrapper that degrades gracefully when unconfigured
- `data/knowledge.txt` — the rules knowledge base (static text, versioned in git)

## Popular Questions (usage-tracked)

The home screen's "Popular Questions" list ranks itself by what people actually ask,
not a fixed order. Popularity is tracked only against **canonical question ids** (from
`ALL_QUESTIONS`) — never against raw typed text — so the public page only ever shows
clean, vetted questions. Typed questions are credited toward the closest canonical id
via a small local word-overlap matcher (`matchCanonicalId`).

- A click on a suggested question, or a typed question that matches a canonical id,
  calls `POST /api/track` once (at the start of the chat, not on follow-ups).
- Counts persist in **Redis** (Upstash, via the Vercel Marketplace) using atomic
  `INCR`, so concurrent visitors can't undercount each other.
- If Redis isn't configured, the app still runs — tracking no-ops and the list falls
  back to the default order (`DEFAULT_POPULAR_IDS`).

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Only `ANTHROPIC_API_KEY` is required to run locally. Without Vercel KV env vars, the
Popular Questions list simply uses its default order.

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
4. From the project's **Storage** tab, add a **Redis** integration from the Vercel
   Marketplace (Upstash) and connect it to this project — it auto-injects the REST URL
   and token env vars. No schema or migrations needed.
5. Deploy.

Never commit the API key or expose it via a `NEXT_PUBLIC_*` variable.

## Note before going public

The D1 Prospects document is marked "Not for distribution." That almost certainly
targets resale/republishing rather than a partner league referencing it for its own
families, but since this bot exposes its contents to the general public, confirm with
your D1 Prospects contact before launch.
