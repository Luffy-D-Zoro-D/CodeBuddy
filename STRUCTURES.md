# CodeBuddy — UI Structures

Two student browsing structures currently coexist. Keep BOTH until the user
decides which to remove. If the user asks to "go back to previous structure",
they mean **Structure A** (the collapsible per-category page).

## Structure A — Per-category page with collapsible topics (original)

Routes:

- `/browse/$category` (`src/routes/browse.$category.index.tsx`)
  Shows a single category. Topics are listed newest-first as collapsible
  sections; each expands to show its days.
- `/browse/$category/$topic/$day` — day viewer with Monaco tabs per file.

Home page links to a single category via a hero CTA and lists "Recent topics".

## Structure B — Side-by-side Explorer (new, requested via tree example)

Route:

- `/explorer` (`src/routes/explorer.tsx`)
  Renders HTML / CSS / JavaScript in three side-by-side columns. Each column
  is a file-tree: Topic → Day → File. Clicking `open` on a day navigates to
  the day viewer used by Structure A.

Both structures read from the same store (`src/lib/store.ts`), so any content
added in the dashboard shows up in both.

To remove Structure B later: delete `src/routes/explorer.tsx` and the
Explorer link in `src/components/SiteHeader.tsx`.
To remove Structure A later: delete `src/routes/browse.$category.index.tsx`
and route students from the home page directly into `/explorer`.
