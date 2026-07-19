import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Layers,
  ChevronDown,
  ChevronRight,
  FileCode2,
  FolderClosed,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  loader: async () => {
    const categories = await api.listCategories();
    const topics = await api.listTopics();
    const recentDays = await api.listRecentDays(3);

    // Fetch days for all topics in parallel to calculate counts and find the first day
    const daysPerTopicList = await Promise.all(
      topics.map(async (t) => {
        const days = await api.listDays(t.id);
        const sortedDays = days.sort((a, b) => a.dayNumber - b.dayNumber);
        return { topicId: t.id, count: days.length, firstDay: sortedDays[0]?.dayNumber };
      }),
    );
    const daysPerTopic = new Map(daysPerTopicList.map((d) => [d.topicId, d.count]));
    const firstDayPerTopic = new Map(daysPerTopicList.map((d) => [d.topicId, d.firstDay]));
    const totalDays = daysPerTopicList.reduce((sum, d) => sum + d.count, 0);

    // Calculate topics per category
    const topicsPerCategory = new Map(
      categories.map((c) => [c.id, topics.filter((t) => t.categoryId === c.id).length]),
    );

    return {
      categories,
      topics,
      daysPerTopic,
      firstDayPerTopic,
      totalDays,
      topicsPerCategory,
      recentDays,
    };
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
  const { categories, topics, recentDays } = Route.useLoaderData();
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const catById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-10">
        <section aria-labelledby="cats" className="pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryColumn key={c.id} categoryId={c.id} categorySlug={c.slug} name={c.name} />
            ))}
          </div>
        </section>

        <section id="recent" aria-labelledby="recent-h" className="pb-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              id="recent-h"
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Recent additions
            </h2>
          </div>
          {recentDays.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
              No material added yet.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {recentDays.map((d) => {
                const topic = topicById.get(d.topicId);
                const cat = topic ? catById.get(topic.categoryId) : undefined;
                if (!topic || !cat) return null;

                const dayDisplay =
                  d.title && d.title !== `Day ${d.dayNumber}`
                    ? `Day ${d.dayNumber} : ${d.title}`
                    : `Day ${d.dayNumber}`;

                return (
                  <li key={d.id}>
                    <Link
                      to="/browse/$category/$topic/$day"
                      params={{ category: cat.slug, topic: topic.slug, day: String(d.dayNumber) }}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-secondary/50"
                    >
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {cat.name} — {topic.title}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">{dayDisplay}</p>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function CategoryColumn({
  categoryId,
  categorySlug,
  name,
}: {
  categoryId: string;
  categorySlug: string;
  name: string;
}) {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["topics", categoryId],
    queryFn: () => api.listTopics(categoryId),
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
        <span className="text-xs text-muted-foreground">
          {topics.length} {topics.length === 1 ? "topic" : "topics"}
        </span>
      </div>
      {isLoading ? (
        <div className="py-4 text-center">
          <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : topics.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          No topics yet
        </p>
      ) : (
        <ul className="space-y-1">
          {topics.map((t) => (
            <TopicNode
              key={t.id}
              topicId={t.id}
              title={t.title}
              topicSlug={t.slug}
              categorySlug={categorySlug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TopicNode({
  topicId,
  title,
  topicSlug,
  categorySlug,
}: {
  topicId: string;
  title: string;
  topicSlug: string;
  categorySlug: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: days = [], isLoading } = useQuery({
    queryKey: ["days", topicId],
    queryFn: () => api.listDays(topicId),
    enabled: open,
  });

  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-secondary"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {open ? (
          <FolderOpen className="h-4 w-4 text-primary" />
        ) : (
          <FolderClosed className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="truncate">{title}</span>
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5 border-l border-border pl-3 ml-2">
          {isLoading && (
            <li className="px-2 py-1 text-xs">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            </li>
          )}
          {!isLoading && days.length === 0 && (
            <li className="px-2 py-1 text-xs text-muted-foreground">No days yet</li>
          )}
          {days.map((d) => (
            <DayNode
              key={d.id}
              dayId={d.id}
              dayNumber={d.dayNumber}
              dayTitle={d.title}
              categorySlug={categorySlug}
              topicSlug={topicSlug}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function DayNode({
  dayId,
  dayNumber,
  dayTitle,
  categorySlug,
  topicSlug,
}: {
  dayId: string;
  dayNumber: number;
  dayTitle?: string;
  categorySlug: string;
  topicSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files", dayId],
    queryFn: () => api.listFiles(dayId),
    enabled: open,
  });

  return (
    <li>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm hover:bg-secondary"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          {open ? (
            <FolderOpen className="h-3.5 w-3.5 text-primary" />
          ) : (
            <FolderClosed className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="truncate font-medium text-foreground">
            {dayTitle && dayTitle !== `Day ${dayNumber}`
              ? `Day ${dayNumber} : ${dayTitle}`
              : `Day ${dayNumber}`}
          </span>
        </button>
        <Link
          to="/browse/$category/$topic/$day"
          params={{ category: categorySlug, topic: topicSlug, day: String(dayNumber) }}
          className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          open
        </Link>
      </div>
      {open && (
        <ul className="mt-0.5 space-y-0.5 border-l border-border pl-3 ml-1.5">
          {isLoading && (
            <li className="px-2 py-1">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            </li>
          )}
          {!isLoading && files.length === 0 && (
            <li className="px-2 py-1 text-xs text-muted-foreground">No files</li>
          )}
          {files.map((f) => (
            <li key={f.id}>
              <Link
                to="/browse/$category/$topic/$day"
                params={{ category: categorySlug, topic: topicSlug, day: String(dayNumber) }}
                hash={f.id}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <FileCode2 className="h-3 w-3" />
                {f.displayName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
