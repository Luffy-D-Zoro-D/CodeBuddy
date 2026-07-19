## What changes

Restructure the app around **Topics → Days** (not Category → Lecture → files) and connect it to **MongoDB** using the URI saved in Settings.

### New data model

```
Category (HTML / CSS / JavaScript)  ← stays the same
  └─ Topic  (e.g. "Positions", "Forms", "Selectors")   ← teacher creates
       └─ Day  (Day 1, Day 2, Day 3 …)                  ← teacher adds each class
            ├─ notes (markdown text, optional)
            └─ files[]  (html/css/js/text snippets — the material for that day)
```

- New topics appear at the top (sorted by `createdAt desc`).
- Within a topic, **newest Day is on top** (Day N first, Day 1 last).
- Auto-numbered: adding a day increments `dayNumber`.

### Student UI (browsing)

- **Home**: keep 3 category cards but the count now says "N topics".
- **Category page** (`/browse/:category`): list of **Topics** as collapsible sections. Each topic shows its days stacked newest-first; clicking a day opens it.
- **Day page** (`/browse/:category/:topic/:day`): notes + Monaco tabs for each file (same viewer as today).
- **Recently updated** on home switches to "recent days" across all topics.

### Teacher dashboard

- Pick a category → see topics list (newest first) → "New Topic".
- Inside a topic: "Add Day" (auto-numbered), edit/delete day, edit/delete files inside a day, edit topic title, delete topic.
- Format-with-AI stays (Groq).
- Fixes the stale count bug by re-fetching after every mutation.

### MongoDB connection

Cloudflare Workers can't open raw TCP, so the standard `mongodb` driver doesn't run in this environment. We'll use the **MongoDB Atlas Data API** (HTTPS) instead. Settings gets two new fields alongside the URI:

- Data API URL (e.g. `https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1`)
- Data API Key
- Database name (default `codeclass`)

(The MongoDB URI field stays for reference / future native-driver backend, but the live app talks to Atlas Data API.)

All reads/writes go through a single server function `mongoRequest` that:

1. Loads the Data API creds from a server-only settings store (persisted per-installation in a signed cookie so it survives refresh without a DB).
2. Calls `POST {dataApiUrl}/action/{find|insertOne|updateOne|deleteOne}` with `apiKey` header.
3. Returns plain DTOs.

If Data API creds aren't set, the app falls back to the current localStorage store so the preview keeps working.

### Files to add / change

- `src/lib/store.ts` — replace Lecture/File model with Topic/Day/File; keep localStorage fallback; add async API.
- `src/lib/mongo.functions.ts` — `createServerFn` wrappers: `listTopics`, `createTopic`, `updateTopic`, `deleteTopic`, `listDays`, `getDay`, `createDay`, `updateDay`, `deleteDay`, plus file CRUD nested in days.
- `src/lib/mongo.server.ts` — Data API fetch helper + creds accessor.
- `src/routes/settings.tsx` — add Data API URL / Key / DB name fields.
- `src/routes/browse.$category.index.tsx` — topic list UI.
- `src/routes/browse.$category.$topic.tsx` (layout) + `.index.tsx` (day list) + `.$day.tsx` (day viewer). Delete old `browse.$category.$lecture.tsx`.
- `src/routes/dashboard.tsx` — full rewrite around topics/days.
- `src/routes/index.tsx` — update counts + recent-days list.

### Out of scope (won't do this turn)

- Auth for real users (still `admin`/`admin`).
- File uploads for images/pdfs — days hold code snippets + notes only.
- Reordering by drag; ordering is by day number / created date.

Say **go** and I'll implement it end-to-end.
