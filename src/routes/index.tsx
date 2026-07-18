import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Layers } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  loader: async () => {
    const categories = await api.listCategories();
    const topics = await api.listTopics();

    // Fetch days for all topics in parallel to calculate counts
    const daysPerTopicList = await Promise.all(
      topics.map(async (t) => {
        const days = await api.listDays(t.id);
        return { topicId: t.id, count: days.length };
      }),
    );
    const daysPerTopic = new Map(daysPerTopicList.map((d) => [d.topicId, d.count]));
    const totalDays = daysPerTopicList.reduce((sum, d) => sum + d.count, 0);

    // Calculate topics per category
    const topicsPerCategory = new Map(
      categories.map((c) => [c.id, topics.filter((t) => t.categoryId === c.id).length]),
    );

    return { categories, topics, daysPerTopic, totalDays, topicsPerCategory };
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "CodeBuddy — Classroom code, beautifully organized" },
      {
        name: "description",
        content:
          "Browse day-by-day lecture notes and code for HTML, CSS, and JavaScript, organized by topic.",
      },
      { property: "og:title", content: "CodeBuddy" },
      { property: "og:description", content: "Classroom code, organized by topic and day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  useStore(); // Keep for real-time reactivity if localStorage is updated
  const { categories, topics, daysPerTopic, totalDays, topicsPerCategory } = Route.useLoaderData();

  const recentTopics = topics.slice(0, 6);
  const catById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        <section className="pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            Well organized.
            <br />
            <span className="text-primary">Easy to learn.</span>
          </h1>
          <div className="mt-8 flex items-center justify-center gap-3">
            {categories[0] && (
              <Link
                to="/browse/$category"
                params={{ category: categories[0].slug }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Open {categories[0].name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <a
              href="#recent"
              className="inline-flex items-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Recent topics
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {topics.length} {topics.length === 1 ? "topic" : "topics"} · {totalDays} material
          </p>
        </section>

        <section aria-labelledby="cats" className="pb-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              id="cats"
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Subjects
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const tCount = topicsPerCategory.get(c.id) || 0;
              return (
                <Link
                  key={c.id}
                  to="/browse/$category"
                  params={{ category: c.slug }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent p-2.5">
                      <Layers className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tCount} {tCount === 1 ? "topic" : "topics"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </section>

        <section id="recent" aria-labelledby="recent-h" className="pb-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              id="recent-h"
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Recent topics
            </h2>
          </div>
          {recentTopics.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
              No topics yet. Ask your teacher to add one.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {recentTopics.map((t) => {
                const cat = catById.get(t.categoryId);
                const days = daysPerTopic.get(t.id) || 0;
                return (
                  <li key={t.id}>
                    <Link
                      to="/browse/$category"
                      params={{ category: cat?.slug ?? "" }}
                      hash={t.slug}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-secondary/50"
                    >
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                        {t.description && (
                          <p className="truncate text-sm text-muted-foreground">{t.description}</p>
                        )}
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {cat?.name} · {days} {days === 1 ? "day" : "days"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} CodeBuddy — Web Technology
        </div>
      </footer>
    </div>
  );
}
