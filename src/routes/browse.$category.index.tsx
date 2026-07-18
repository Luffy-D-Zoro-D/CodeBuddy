import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";

export const Route = createFileRoute("/browse/$category/")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.category.toUpperCase()} — CodeClass` },
      {
        name: "description",
        content: `${params.category.toUpperCase()} topics organized day-by-day.`,
      },
    ],
  }),
});

function CategoryPage() {
  useStore();
  const { category: slug } = Route.useParams();
  const cat = api.getCategoryBySlug(slug);
  if (!cat) throw notFound();

  const topics = api.listTopics(cat.id);

  // Expand the topic pointed to by the URL hash on mount.
  const [openId, setOpenId] = useState<string | null>(topics[0]?.id ?? null);
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hash) {
      const t = topics.find((x) => x.slug === hash);
      if (t) setOpenId(t.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{cat.name}</span>
        </nav>

        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {cat.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {topics.length} {topics.length === 1 ? "topic" : "topics"} · newest on top
        </p>

        {topics.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
            No topics yet.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {topics.map((t) => {
              const days = api.listDays(t.id);
              const isOpen = openId === t.id;
              return (
                <li
                  key={t.id}
                  id={t.slug}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : t.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-secondary/50"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-foreground">{t.title}</p>
                      {t.description && (
                        <p className="truncate text-sm text-muted-foreground">{t.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {days.length} {days.length === 1 ? "day" : "days"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-border bg-background/40 px-5 py-3">
                      {days.length === 0 ? (
                        <p className="py-2 text-sm text-muted-foreground">
                          No entries yet for this topic.
                        </p>
                      ) : (
                        <ul className="divide-y divide-border">
                          {days.map((d) => (
                            <li key={d.id}>
                              <Link
                                to="/browse/$category/$topic/$day"
                                params={{
                                  category: cat.slug,
                                  topic: t.slug,
                                  day: String(d.dayNumber),
                                }}
                                className="flex items-center gap-3 py-2.5 text-sm transition hover:text-primary"
                              >
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium text-foreground">
                                  Day {d.dayNumber}
                                </span>
                                {d.title && (
                                  <span className="truncate text-muted-foreground">
                                    — {d.title}
                                  </span>
                                )}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {new Date(d.createdAt).toLocaleDateString()}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}