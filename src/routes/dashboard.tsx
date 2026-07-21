import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Save, Sparkles, Trash2, FileCode2, CalendarDays, Loader2, Lightbulb } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { CodeViewer } from "@/components/CodeViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, useStore, type CodeFile, type Topic, type Day, type Asset } from "@/lib/store";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Dashboard — CodeBuddy" }, { name: "robots", content: "noindex" }],
  }),
});

function Dashboard() {
  const storeVer = useStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(true); // default true to bypass SSR mismatch
  const role = api.getRole();
  const isLuffy = role === "admin";

  useEffect(() => {
    if (!api.isAuthed()) {
      setIsAuthed(false);
    } else {
      setIsChecking(false);
    }
  }, [storeVer]);

  if (!isAuthed) {
    throw notFound();
  }

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.listCategories(),
  });

  const { data: globalTopics = [], isLoading: isLoadingGlobalTopics } = useQuery({
    queryKey: ["globalTopics"],
    queryFn: () => api.listTopics(),
  });

  const [selectedCat, setSelectedCat] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const { data: prefs, isLoading: isLoadingPrefs } = useQuery({
    queryKey: ["preferences"],
    queryFn: () => api.getUserPreferences(),
  });

  const [hasLoadedPrefs, setHasLoadedPrefs] = useState(false);

  useEffect(() => {
    if (!isLoadingPrefs && !hasLoadedPrefs) {
      if (prefs) {
        if (prefs.lastCatId) setSelectedCat(prefs.lastCatId);
        if (prefs.lastTopicId) setSelectedTopicId(prefs.lastTopicId);
        if (prefs.lastDayId) setSelectedDayId(prefs.lastDayId);
        if (prefs.lastFileId) setSelectedFileId(prefs.lastFileId);
      }
      setHasLoadedPrefs(true);
    }
  }, [isLoadingPrefs, prefs, hasLoadedPrefs]);

  useEffect(() => {
    if (hasLoadedPrefs) {
      // Only sync back if we have loaded the initial state
      if (selectedCat || selectedTopicId || selectedDayId || selectedFileId) {
        api.updateUserPreferences({
          lastCatId: selectedCat,
          lastTopicId: selectedTopicId || undefined,
          lastDayId: selectedDayId || undefined,
          lastFileId: selectedFileId || undefined,
        });
      }
    }
  }, [selectedCat, selectedTopicId, selectedDayId, selectedFileId, hasLoadedPrefs]);

  useEffect(() => {
    if (hasLoadedPrefs && !selectedCat && categories.length > 0 && !isLoadingGlobalTopics) {
      if (globalTopics.length > 0) {
        const sorted = [...globalTopics].sort((a, b) => {
          const timeA = a.updatedAt || a.createdAt || "";
          const timeB = b.updatedAt || b.createdAt || "";
          return timeB.localeCompare(timeA);
        });
        const latest = sorted[0];
        setSelectedCat(latest.categoryId);
        setSelectedTopicId(latest.id);
      } else {
        setSelectedCat(categories[0].id);
      }
    }
  }, [categories, globalTopics, isLoadingGlobalTopics, selectedCat, hasLoadedPrefs]);

  const {
    data: topics = [],
    refetch: refetchTopics,
    isLoading: isLoadingTopics,
  } = useQuery({
    queryKey: ["topics", selectedCat],
    queryFn: () => api.listTopics(selectedCat),
    enabled: !!selectedCat,
  });

  useEffect(() => {
    if (topics.length > 0 && selectedCat && !topics.find((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(topics[0]?.id ?? null);
    }
  }, [topics, selectedTopicId, selectedCat]);
  const selectedTopic = topics.find((t) => t.id === selectedTopicId) ?? null;

  const {
    data: days = [],
    refetch: refetchDays,
    isLoading: isLoadingDays,
  } = useQuery({
    queryKey: ["days", selectedTopicId],
    queryFn: () => api.listDays(selectedTopicId!),
    enabled: !!selectedTopicId,
  });

  useEffect(() => {
    if (days.length > 0 && selectedTopicId && !days.find((d) => d.id === selectedDayId)) {
      setSelectedDayId(days[0]?.id ?? null);
    }
  }, [days, selectedDayId, selectedTopicId]);
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? null;

  const {
    data: files = [],
    refetch: refetchFiles,
    isLoading: isLoadingFiles,
  } = useQuery({
    queryKey: ["files", selectedDayId],
    queryFn: () => api.listFiles(selectedDayId!),
    enabled: !!selectedDayId,
  });

  const {
    data: assets = [],
    refetch: refetchAssets,
  } = useQuery({
    queryKey: ["assets", selectedDayId],
    queryFn: () => api.listAssets(selectedDayId!),
    enabled: !!selectedDayId,
  });

  useEffect(() => {
    if (files.length > 0 && selectedDayId && !files.find((f) => f.id === selectedFileId)) {
      setSelectedFileId(files[0]?.id ?? null);
    }
  }, [files, selectedFileId, selectedDayId]);
  const currentFile = files.find((f) => f.id === selectedFileId) ?? null;

  const [draft, setDraft] = useState("");
  useEffect(() => {
    setDraft(currentFile?.content ?? "");
  }, [currentFile?.id]);

  const saveFile = async () => {
    if (!currentFile) return;
    await api.updateFile(currentFile.id, { content: draft });
    refetchFiles();
    toast.success("Saved");
  };
  const formatAI = async () => {
    if (!currentFile) return;
    try {
      const out = await api.formatWithAI(draft, currentFile.language, currentFile.aiNote);
      setDraft(out);
      toast.success("Formatted — click Save to persist");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isChecking) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <SiteHeader />
      <main className="mx-auto grid w-full flex-1 max-w-[1600px] grid-cols-1 gap-6 overflow-hidden px-6 py-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-4 overflow-hidden pb-2 pr-2">
          {selectedCat && (
            <QuickUploadDialog
              categoryId={selectedCat}
              categoryName={categories.find(c => c.id === selectedCat)?.name || ""}
              topics={topics}
              currentTopicId={selectedTopicId}
              onSuccess={async (tId, dId) => {
                await refetchTopics();
                setSelectedTopicId(tId);
                await refetchDays();
                setSelectedDayId(dId);
              }}
            />
          )}

          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-card p-3 overflow-hidden">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
              Subject
            </Label>
            <div className="shrink-0 mt-2">
              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 flex shrink-0 items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Topics (newest first)
              </span>
              <NewTopicDialog
                categoryId={selectedCat}
                onCreated={async (t) => {
                  await refetchTopics();
                  setSelectedTopicId(t.id);
                }}
              />
            </div>
            <ul className="mt-2 flex flex-1 flex-col space-y-0.5 overflow-y-auto pr-1 min-h-0">
              {isLoadingTopics && (
                <li className="py-2 text-center">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                </li>
              )}
              {!isLoadingTopics && topics.length === 0 && (
                <li className="rounded-md px-2 py-2 text-xs text-muted-foreground">No topics</li>
              )}
              {topics.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`w-full truncate rounded-md px-2 py-1.5 text-left text-sm transition ${
                      selectedTopicId === t.id
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedTopic && (
            <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-card p-3 overflow-hidden">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Days
                </span>
                <NewDayDialog
                  topic={selectedTopic}
                  onCreated={async (d) => {
                    await refetchDays();
                    setSelectedDayId(d.id);
                  }}
                />
              </div>
              <ul className="mt-2 flex flex-1 flex-col space-y-0.5 overflow-y-auto pr-1 min-h-0">
                {isLoadingDays && (
                  <li className="py-2 text-center">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                  </li>
                )}
                {!isLoadingDays && days.length === 0 && (
                  <li className="rounded-md px-2 py-2 text-xs text-muted-foreground">
                    No days yet
                  </li>
                )}
                {days.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => setSelectedDayId(d.id)}
                      className={`flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-sm transition ${
                        selectedDayId === d.id
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {d.title && d.title !== `Day ${d.dayNumber}`
                          ? `Day ${d.dayNumber} : ${d.title}`
                          : `Day ${d.dayNumber}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content */}
        {!selectedTopic ? (
          <section className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-12 text-center text-sm text-muted-foreground">
            Create your first topic (e.g. "Positions in CSS"), then add Day 1, Day 2, and so on.
          </section>
        ) : (
          <div className="flex min-w-0 flex-col overflow-hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6">
            {/* Middle column: Info & Actions */}
            <div className="space-y-6 overflow-y-auto pb-6 pr-2">
              <section className="flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Topic
                      </p>
                      <h1 className="mt-1 break-words text-2xl font-semibold tracking-tight text-foreground">
                        {selectedTopic.title}
                      </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <EditTopicDialog topic={selectedTopic} onUpdated={refetchTopics} />
                      <DeleteTopic
                        topic={selectedTopic}
                        onDeleted={() => {
                          setSelectedTopicId(null);
                          refetchTopics();
                        }}
                      />
                    </div>
                  </div>
                  {selectedTopic.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedTopic.description}
                    </p>
                  )}
                </div>

                {!selectedDay ? (
                  <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
                    Add a day entry from the sidebar to attach today's code and notes.
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Day {selectedDay.dayNumber}
                        </p>
                        <h2 className="mt-1 break-words text-lg font-semibold text-foreground">
                          {selectedDay.title && selectedDay.title !== `Day ${selectedDay.dayNumber}`
                            ? `Day ${selectedDay.dayNumber} : ${selectedDay.title}`
                            : `Day ${selectedDay.dayNumber}`}
                        </h2>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditDayDialog day={selectedDay} onUpdated={refetchDays} />
                        <DeleteDay
                          day={selectedDay}
                          onDeleted={() => {
                            setSelectedDayId(null);
                            refetchDays();
                          }}
                        />
                      </div>
                    </div>

                    {selectedDay.note && (
                      <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm text-foreground">
                        <p className="whitespace-pre-wrap">{selectedDay.note}</p>
                      </div>
                    )}

                    {currentFile && isLuffy && (
                      <div className="mt-6 space-y-1.5 border-t border-border pt-4">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                          AI note (context for Format-with-AI)
                        </Label>
                        <Textarea
                          value={currentFile.aiNote ?? ""}
                          onChange={async (e) => {
                            await api.updateFile(currentFile.id, { aiNote: e.target.value });
                            refetchFiles();
                          }}
                          rows={3}
                          placeholder="e.g. Demonstrates flexbox row alignment with 3 items"
                          className="resize-none"
                        />
                      </div>
                    )}

                    <div className="mt-6 space-y-2 border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                          Attached Assets (Images / Zips)
                        </Label>
                        <UploadAssetDialog dayId={selectedDay.id} onCreated={refetchAssets} />
                      </div>
                      {assets.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No assets uploaded.</p>
                      ) : (
                        <div className="flex flex-col gap-2 mt-2">
                          {assets.map(a => (
                            <div key={a.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/20 px-3 py-2 text-sm">
                              <span className="font-mono text-xs">{a.filename}</span>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
                                  navigator.clipboard.writeText(`/api/assets/${selectedDay.id}/${a.filename}`);
                                  toast.success("URL copied!");
                                }}>Copy URL</Button>
                                <DeleteAsset asset={a} onDeleted={refetchAssets} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right column: Editor */}
            {selectedDay && (
              <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/20 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {isLoadingFiles ? (
                      <div className="px-2 py-1">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      files.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFileId(f.id)}
                          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition ${
                            selectedFileId === f.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <FileCode2 className="h-3.5 w-3.5" />
                          {f.displayName}
                        </button>
                      ))
                    )}
                    <NewFileDialog
                      dayId={selectedDay.id}
                      onCreated={(f) => {
                        setSelectedFileId(f.id);
                        refetchFiles();
                      }}
                    />
                  </div>
                  {currentFile && (
                    <div className="flex items-center gap-1.5">
                      {isLuffy && (
                        <Button variant="outline" size="sm" onClick={formatAI} className="h-8">
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Format with AI
                        </Button>
                      )}
                      <Button size="sm" onClick={saveFile} className="h-8">
                        <Save className="mr-1.5 h-3.5 w-3.5" /> Save
                      </Button>
                      <DeleteFile
                        file={currentFile}
                        onDeleted={() => {
                          setSelectedFileId(null);
                          refetchFiles();
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="relative flex-1 overflow-hidden p-0">
                  {currentFile ? (
                    <CodeViewer
                      value={draft}
                      language={currentFile.language}
                      readOnly={false}
                      onChange={setDraft}
                      height="100%"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
                      <FileCode2 className="mb-2 h-8 w-8 opacity-20" />
                      No files yet. Add one to start.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function NewTopicDialog({
  categoryId,
  onCreated,
}: {
  categoryId: string;
  onCreated: (t: Topic) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7" disabled={!categoryId}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New topic</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Positions in CSS"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={async () => {
              const t = await api.createTopic({
                categoryId,
                title: title.trim(),
                description: description.trim() || undefined,
              });
              onCreated(t);
              setOpen(false);
              setTitle("");
              setDescription("");
              toast.success("Topic created");
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditTopicDialog({ topic, onUpdated }: { topic: Topic; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(topic.title);
  const [description, setDescription] = useState(topic.description ?? "");
  useEffect(() => {
    setTitle(topic.title);
    setDescription(topic.description ?? "");
  }, [topic.id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit topic</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await api.updateTopic(topic.id, { title, description });
              onUpdated();
              setOpen(false);
              toast.success("Topic updated");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTopic({ topic, onDeleted }: { topic: Topic; onDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{topic.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Removes the topic, all its days, and files. Cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await api.deleteTopic(topic.id);
              onDeleted();
              toast.success("Topic deleted");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${day}${suffix}-${month}-${year}`;
}

function NewDayDialog({ topic, onCreated }: { topic: Topic; onCreated: (d: Day) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(getFormattedDate());
      setNote("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New day entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Day title (optional)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Absolute & fixed"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="What you covered today…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const d = await api.createDay({
                topicId: topic.id,
                title: title.trim() || undefined,
                note: note.trim() || undefined,
              });
              onCreated(d);
              setOpen(false);
              setTitle("");
              setNote("");
              toast.success(`Day ${d.dayNumber} added`);
            }}
          >
            Add day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditDayDialog({ day, onUpdated }: { day: Day; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(day.title ?? "");
  const [note, setNote] = useState(day.note ?? "");
  useEffect(() => {
    setTitle(day.title ?? "");
    setNote(day.note ?? "");
  }, [day.id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit day {day.dayNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await api.updateDay(day.id, { title: title || undefined, note: note || undefined });
              onUpdated();
              setOpen(false);
              toast.success("Day updated");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDay({ day, onDeleted }: { day: Day; onDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete day
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete day {day.dayNumber}?</AlertDialogTitle>
          <AlertDialogDescription>All files in this day will be removed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await api.deleteDay(day.id);
              onDeleted();
              toast.success("Day deleted");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getLanguageFromFilename(filename: string): CodeFile["language"] {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".ts") || lower.endsWith(".tsx")) return "javascript";
  return "text";
}

function NewFileDialog({ dayId, onCreated }: { dayId: string; onCreated: (f: CodeFile) => void }) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("index.html");
  const [language, setLanguage] = useState<CodeFile["language"]>("html");
  const [content, setContent] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleManualAdd = async () => {
    const f = await api.createFile({
      dayId,
      displayName,
      filename: displayName,
      language,
      content,
    });
    onCreated(f);
    setOpen(false);
    setContent("");
    toast.success("File added");
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const createdFiles = await Promise.all(
        files.map((file) => {
          return new Promise<CodeFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                const text = e.target?.result as string;
                const f = await api.createFile({
                  dayId,
                  displayName: file.name,
                  filename: file.name,
                  language: getLanguageFromFilename(file.name),
                  content: text,
                });
                resolve(f);
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsText(file);
          });
        })
      );
      if (createdFiles.length > 0) onCreated(createdFiles[0]);
      setOpen(false);
      setFiles([]);
      toast.success(`${files.length} file(s) added`);
    } catch (err) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add file
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add file(s)</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="manual">Create Manually</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Select HTML/CSS/JS files</Label>
              <Input 
                type="file" 
                multiple 
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))} 
              />
              <p className="text-xs text-muted-foreground">
                Files will be read as text and added to the editor.
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <Button disabled={files.length === 0 || uploading} onClick={handleUpload}>
                {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload & Add"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>File name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as CodeFile["language"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!displayName.trim()}
                onClick={handleManualAdd}
              >
                Add File
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function DeleteFile({ file, onDeleted }: { file: CodeFile; onDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {file.displayName}?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await api.deleteFile(file.id);
              onDeleted();
              toast.success("File deleted");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UploadAssetDialog({ dayId, onCreated }: { dayId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(
        files.map((file) => {
          return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                const result = e.target?.result as string;
                await api.createAsset({
                  dayId,
                  filename: file.name,
                  mimeType: file.type || "application/octet-stream",
                  data: result,
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      onCreated();
      setOpen(false);
      setFiles([]);
      toast.success(`${files.length} asset(s) uploaded`);
    } catch (err) {
      toast.error("Upload failed for one or more files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs">
          <Plus className="h-3.5 w-3.5" /> Upload Asset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Asset(s)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            type="file" 
            multiple 
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))} 
          />
          <p className="text-xs text-muted-foreground">Max size: ~15MB (MongoDB limit)</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={files.length === 0 || uploading} onClick={handleUpload}>
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAsset({ asset, onDeleted }: { asset: Asset; onDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {asset.filename}?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            await api.deleteAsset(asset.id);
            onDeleted();
            toast.success("Asset deleted");
          }}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function QuickUploadDialog({
  categoryId,
  categoryName,
  topics,
  currentTopicId,
  onSuccess,
}: {
  categoryId: string;
  categoryName: string;
  topics: Topic[];
  currentTopicId: string | null;
  onSuccess: (topicId: string, dayId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [newTopicName, setNewTopicName] = useState("");
  const [dayTitle, setDayTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (open && topics.length > 0) {
      if (currentTopicId && topics.some(t => t.id === currentTopicId)) {
        setSelectedTopicId(currentTopicId);
      } else if (!selectedTopicId) {
        setSelectedTopicId(topics[0].id);
      }
    }
  }, [open, topics, currentTopicId]);

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (!isNewTopic && !selectedTopicId) return;
    if (isNewTopic && !newTopicName.trim()) return;

    setUploading(true);
    try {
      let topicId = selectedTopicId;
      
      if (isNewTopic) {
        const t = await api.createTopic({
          categoryId,
          title: newTopicName.trim(),
        });
        topicId = t.id;
      }

      const d = await api.createDay({
        topicId,
        title: dayTitle.trim() || undefined,
      });

      // upload files
      await Promise.all(
        files.map((file) => {
          return new Promise<void>((resolve, reject) => {
            const isText = file.type.startsWith("text/") || file.name.endsWith(".js") || file.name.endsWith(".json");
            const isImage = file.type.startsWith("image/");
            const isZip = file.name.endsWith(".zip");

            if (isText) {
              const reader = new FileReader();
              reader.onload = async (e) => {
                try {
                  const content = e.target?.result as string;
                  let language: CodeFile["language"] = "text";
                  if (file.name.endsWith(".html")) language = "html";
                  else if (file.name.endsWith(".css")) language = "css";
                  else if (file.name.endsWith(".js") || file.name.endsWith(".ts")) language = "javascript";
                  
                  await api.createFile({
                    dayId: d.id,
                    filename: file.name,
                    displayName: file.name,
                    language,
                    content,
                  });
                  resolve();
                } catch (err) {
                  reject(err);
                }
              };
              reader.onerror = reject;
              reader.readAsText(file);
            } else if (isImage || isZip) {
              const reader = new FileReader();
              reader.onload = async (e) => {
                try {
                  const result = e.target?.result as string;
                  await api.createAsset({
                    dayId: d.id,
                    filename: file.name,
                    mimeType: file.type || "application/octet-stream",
                    data: result,
                  });
                  resolve();
                } catch (err) {
                  reject(err);
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            } else {
               // Ignore unsupported files
               resolve();
            }
          });
        })
      );
      
      onSuccess(topicId, d.id);
      setOpen(false);
      
      // reset
      setNewTopicName("");
      setDayTitle("");
      setFiles([]);
      setIsNewTopic(false);
      
      toast.success("Lecture uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload lecture");
    } finally {
      setUploading(false);
    }
  };

  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setFiles(newFiles);
    setHasAnalyzed(false);
    setAnalyzing(true);
    
    try {
      // Find the first text file to use as a snippet for the AI
      const textFile = newFiles.find(f => f.type.startsWith("text/") || f.name.endsWith(".js") || f.name.endsWith(".html") || f.name.endsWith(".css"));
      let snippet = "(No text file found, use filename context: " + newFiles.map(f => f.name).join(", ") + ")";
      
      if (textFile) {
        snippet = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string).substring(0, 1000));
          reader.onerror = () => resolve(snippet);
          reader.readAsText(textFile);
        });
      }

      const existingTopics = topics.map(t => ({ id: t.id, title: t.title }));
      const aiResult = await api.inferTopic(categoryName, existingTopics, snippet, currentTopicId);
      
      if (aiResult.action === "use_existing" && aiResult.topicId) {
        setIsNewTopic(false);
        setSelectedTopicId(aiResult.topicId);
      } else if (aiResult.action === "create_new" && aiResult.topicName) {
        setIsNewTopic(true);
        setNewTopicName(aiResult.topicName);
      }
      if (aiResult.dayTitle) {
        setDayTitle(aiResult.dayTitle);
      }
      
      setHasAnalyzed(true);
      toast.success("AI Analysis Complete. Please review and upload.");
    } catch (err) {
      toast.error("AI couldn't infer the topic. Please fill it manually.");
      setHasAnalyzed(true); // Let them do it manually
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setHasAnalyzed(false);
      setFiles([]);
      setNewTopicName("");
      setDayTitle("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/25 border-0 h-12 text-sm font-bold transition-all hover:scale-[1.02]">
          <i className="fa-solid fa-plus text-base"></i> Quick Add Lecture
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Lecture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {!hasAnalyzed ? (
            <div className="space-y-3 pt-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select files to begin</Label>
              <div className="relative border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 rounded-xl p-8 transition-colors text-center h-48 flex items-center justify-center">
                {analyzing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                    <span className="font-semibold text-primary text-base">AI is analyzing files...</span>
                    <p className="text-xs text-muted-foreground">Please wait a moment</p>
                  </div>
                ) : (
                  <>
                    <Input 
                      type="file" 
                      multiple 
                      onChange={(e) => handleFilesSelected(Array.from(e.target.files ?? []))} 
                      accept=".html,.css,.js,.ts,.json,image/*,.zip"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none flex flex-col items-center gap-2">
                      <FileCode2 className="h-10 w-10 text-primary/70 mb-2" />
                      <span className="font-semibold text-primary text-base">Select or drop files here</span>
                      <p className="text-xs text-muted-foreground">HTML, CSS, JS, images, ZIP</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-primary/10 text-primary-foreground rounded-lg p-4 text-sm flex items-start gap-3 mb-4 border border-primary/30 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="bg-primary/20 p-1.5 rounded-md shrink-0">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="relative z-10">
                  <strong className="text-base text-primary">Our Suggestion</strong>
                  <p className="opacity-80 mt-0.5 text-foreground">We matched these files to the best topic and title. Review and click upload.</p>
                </div>
              </div>

              <Tabs value={isNewTopic ? "new" : "existing"} onValueChange={(v) => setIsNewTopic(v === "new")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Existing Topic</TabsTrigger>
                  <TabsTrigger value="new">New Topic</TabsTrigger>
                </TabsList>
                <TabsContent value="existing" className="mt-4">
                  <div className="space-y-2">
                    <Label>Select Topic</Label>
                    <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.length === 0 && <SelectItem value="none" disabled>No topics available</SelectItem>}
                        {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="new" className="mt-4">
                  <div className="space-y-2">
                    <Label>New Topic Name</Label>
                    <Input value={newTopicName} onChange={e => setNewTopicName(e.target.value)} placeholder="e.g. Layouts in CSS" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2 pt-2">
                <Label>Day Title</Label>
                <Input value={dayTitle} onChange={e => setDayTitle(e.target.value)} placeholder="e.g. Login Page" />
              </div>

              <div className="space-y-2 pt-2">
                <Label>Lecture Files</Label>
                <div className="flex items-center gap-2 text-sm p-3 bg-secondary rounded-md border border-border">
                   <FileCode2 className="h-4 w-4" /> <strong>{files.length}</strong> file(s) ready to upload.
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!hasAnalyzed || files.length === 0 || uploading || (isNewTopic ? !newTopicName.trim() : !selectedTopicId)} onClick={handleUpload}>
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Confirm & Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
