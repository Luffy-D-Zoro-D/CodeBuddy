import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FolderClosed,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/explorer")({
  loader: async () => {
    return { categories: await api.listCategories() };
  },
  component: ExplorerPage,
  head: () => ({
    meta: [
      { title: "Explorer — CodeBuddy" },
      { name: "description", content: "Tree explorer of all subjects, topics, days and files." },
    ],
  }),
});

function ExplorerPage() {
  useStore(); // For local storage reactivity if needed
  const { categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Explorer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse all subjects side-by-side. Expand topics to see days and files.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((c) => (
            <CategoryColumn key={c.id} categoryId={c.id} categorySlug={c.slug} name={c.name} />
          ))}
        </div>
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
    enabled: open, // Only fetch when expanded
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
          <span className="truncate">
            Day {dayNumber}
            {dayTitle ? ` — ${dayTitle}` : ""}
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
