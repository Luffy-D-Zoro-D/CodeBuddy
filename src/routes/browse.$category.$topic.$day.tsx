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
    const assets = day ? await api.listAssets(day.id) : [];

    if (!cat || !topic || !day) throw notFound();
    return { cat, topic, day, files, assets };
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
  const { cat, topic, day, files, assets } = Route.useLoaderData();

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
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 overflow-hidden px-6 py-6 lg:grid-cols-[300px_1fr]">
        {/* Left Column: Info */}
        <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/browse/$category"
              params={{ category: cat.slug }}
              className="hover:text-foreground"
            >
              {cat.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/browse/$category"
              params={{ category: cat.slug }}
              hash={topic.slug}
              className="hover:text-foreground"
            >
              {topic.title}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Day {day.dayNumber}</span>
          </nav>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {topic.title}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
              {day.title && day.title !== `Day ${day.dayNumber}`
                ? `Day ${day.dayNumber} : ${day.title}`
                : `Day ${day.dayNumber}`}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground" suppressHydrationWarning>
              {new Date(day.createdAt).toLocaleString()}
            </p>
          </div>

          {day.note && (
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Teacher's note
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{day.note}</p>
            </div>
          )}

          {assets && assets.length > 0 && (
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Attached Assets
              </p>
              <div className="flex flex-col gap-2">
                {assets.map(a => (
                  <Button key={a.id} asChild variant="secondary" size="sm" className="justify-start px-3 py-1.5 h-auto text-xs w-full text-left">
                    <a href={`/api/assets/${day.id}/${a.filename}`} download>
                      <Download className="mr-2 h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{a.filename}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          {files.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
              No files for this day.
            </div>
          ) : (
            <Tabs value={current?.id} onValueChange={setActiveFile} className="flex min-h-0 flex-1 flex-col w-full">
              <div className="flex-none flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/20 px-3 py-2">
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
                <TabsContent key={f.id} value={f.id} className="mt-0 flex-1 min-h-0 data-[state=active]:flex flex-col">
                  {f.aiNote && isLuffy && (
                    <div className="m-3 flex-none rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">AI note:</span> {f.aiNote}
                    </div>
                  )}
                  {f.content.includes(".zip") && (
                    <div className="m-3 flex-none">
                      {(() => {
                        const match = f.content.match(/\[(.*?)\]\((.*?\.zip)\)/);
                        if (match) {
                          return (
                            <Button asChild size="sm">
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
                  <div className="relative flex-1 min-h-0 overflow-hidden bg-background">
                    <CodeViewer value={f.content} language={f.language} height="100%" />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
