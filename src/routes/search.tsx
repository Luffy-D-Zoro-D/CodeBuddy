import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";
import { z } from "zod";

const searchSchema = z.object({ q: z.string().catch("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
  head: () => ({ meta: [{ title: "Search — CodeClass" }, { name: "robots", content: "noindex" }] }),
});

function SearchPage() {
  useStore();
  const { q } = Route.useSearch();
  const results = api.search(q).topics;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Search</h1>
        <p className="mt-1 text-muted-foreground">
          {q ? (<>Results for <span className="text-foreground">"{q}"</span></>) : "Type a query in the header to search topics."}
        </p>
        <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {results.length === 0 && q && (
            <li className="p-6 text-sm text-muted-foreground">No topics match.</li>
          )}
          {results.map((r) => (
            <li key={r.id}>
              <Link
                to="/browse/$category"
                params={{ category: r.categorySlug }}
                hash={r.slug}
                className="block px-5 py-4 transition hover:bg-secondary/50"
              >
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                {r.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}