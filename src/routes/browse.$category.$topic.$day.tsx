import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronRight, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { CodeViewer } from "@/components/CodeViewer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { api, useStore } from "@/lib/store";

export const Route = createFileRoute("/browse/$category/$topic/$day")({
  loader: async ({ params: { category, topic: topicSlug, day: dayStr } }) => {
    const cat = await api.getCategoryBySlug(category);
    const topic = await api.getTopic(category, topicSlug);
    const dayNumber = Number(dayStr);
    const day = topic ? await api.getDay(topic.id, dayNumber) : undefined;
    const files = day ? await api.listFiles(day.id) : [];

    if (!cat || !topic || !day) throw notFound();
    return { cat, topic, day, files };
  },
  component: DayPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.topic} · Day ${params.day} — CodeBuddy` },
      { name: "description", content: `Day ${params.day} of ${params.topic}.` },
    ],
  }),
});

function DayPage() {
  useStore();
  const { cat, topic, day, files } = Route.useLoaderData();

  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<string | undefined>(undefined);
  const isLuffy = api.getUsername() === "luffy";

  useEffect(() => {
    if (files[0]) setActiveFile((prev) => prev ?? files[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day?.id]);

  const current = files.find((f) => f.id === activeFile) ?? files[0];

  const copy = async () => {
    if (!current) return;
    await navigator.clipboard.writeText(current.content);
    setCopied(true);
    toast.success(`${current.displayName} copied`);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/browse/$category"
            params={{ category: cat.slug }}
            className="hover:text-foreground"
          >
            {cat.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/browse/$category"
            params={{ category: cat.slug }}
            hash={topic.slug}
            className="hover:text-foreground"
          >
            {topic.title}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Day {day.dayNumber}</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {topic.title}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              {day.title && day.title !== `Day ${day.dayNumber}`
                ? `Day ${day.dayNumber} : ${day.title}`
                : `Day ${day.dayNumber}`}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>
              {new Date(day.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {day.note && (
          <div className="mb-6 rounded-xl border border-border bg-secondary/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Teacher's note
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{day.note}</p>
          </div>
        )}

        {files.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
            No files for this day.
          </p>
        ) : (
          <Tabs value={current?.id} onValueChange={setActiveFile} className="w-full">
            <div className="flex items-center justify-between gap-4">
              <TabsList className="bg-secondary/60">
                {files.map((f) => (
                  <TabsTrigger key={f.id} value={f.id} className="font-mono text-xs">
                    {f.displayName}
                  </TabsTrigger>
                ))}
              </TabsList>
              {current && (
                <Button size="sm" onClick={copy}>
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-4 w-4" /> Copy {current.language.toUpperCase()}
                    </>
                  )}
                </Button>
              )}
            </div>
            {files.map((f) => (
              <TabsContent key={f.id} value={f.id} className="mt-4">
                {f.aiNote && isLuffy && (
                  <div className="mb-3 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">AI note:</span> {f.aiNote}
                  </div>
                )}
                {f.content.includes(".zip") && (
                  <div className="mb-4">
                    {(() => {
                      const match = f.content.match(/\[(.*?)\]\((.*?\.zip)\)/);
                      if (match) {
                        return (
                          <Button asChild>
                            <a href={match[2]} download>
                              <Download className="mr-2 h-4 w-4" />
                              {match[1]}
                            </a>
                          </Button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                <CodeViewer value={f.content} language={f.language} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
