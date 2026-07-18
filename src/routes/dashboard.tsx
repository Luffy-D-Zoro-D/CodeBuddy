import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Save, Sparkles, Trash2, FileCode2, CalendarDays, Loader2 } from "lucide-react";
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
import { api, useStore, type CodeFile, type Topic, type Day } from "@/lib/store";
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

  useEffect(() => {
    if (!api.isAuthed()) {
      navigate({ to: "/" });
    } else {
      setIsChecking(false);
    }
  }, [navigate, storeVer]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.listCategories(),
  });

  const [selectedCat, setSelectedCat] = useState<string>("");
  useEffect(() => {
    if (!selectedCat && categories[0]) setSelectedCat(categories[0].id);
  }, [categories, selectedCat]);

  const {
    data: topics = [],
    refetch: refetchTopics,
    isLoading: isLoadingTopics,
  } = useQuery({
    queryKey: ["topics", selectedCat],
    queryFn: () => api.listTopics(selectedCat),
    enabled: !!selectedCat,
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  useEffect(() => {
    if (!topics.find((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(topics[0]?.id ?? null);
    }
  }, [topics, selectedTopicId]);
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

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  useEffect(() => {
    if (!days.find((d) => d.id === selectedDayId)) {
      setSelectedDayId(days[0]?.id ?? null);
    }
  }, [days, selectedDayId]);
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

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  useEffect(() => {
    if (!files.find((f) => f.id === selectedFileId)) {
      setSelectedFileId(files[0]?.id ?? null);
    }
  }, [files, selectedFileId]);
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
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Subject
            </Label>
            <Select value={selectedCat} onValueChange={setSelectedCat}>
              <SelectTrigger className="mt-2 w-full">
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

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Topics (newest first)
              </span>
              <NewTopicDialog
                categoryId={selectedCat}
                onCreated={(t) => {
                  setSelectedTopicId(t.id);
                  refetchTopics();
                }}
              />
            </div>
            <ul className="mt-2 space-y-0.5">
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
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Days
                </span>
                <NewDayDialog
                  topic={selectedTopic}
                  onCreated={(d) => {
                    setSelectedDayId(d.id);
                    refetchDays();
                  }}
                />
              </div>
              <ul className="mt-2 space-y-0.5">
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
                        Day {d.dayNumber}
                        {d.title ? ` — ${d.title}` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main */}
        <section className="min-w-0">
          {!selectedTopic ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-12 text-center text-sm text-muted-foreground">
              Create your first topic (e.g. "Positions in CSS"), then add Day 1, Day 2, and so on.
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Topic
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    {selectedTopic.title}
                  </h1>
                  {selectedTopic.description && (
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      {selectedTopic.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
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

              {!selectedDay ? (
                <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-12 text-center text-sm text-muted-foreground">
                  Add a day entry from the sidebar to attach today's code and notes.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Day {selectedDay.dayNumber}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-foreground">
                        {selectedDay.title || `Day ${selectedDay.dayNumber}`}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
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
                    <div className="mb-4 rounded-lg border border-border bg-secondary/40 p-4">
                      <p className="whitespace-pre-wrap text-sm text-foreground">
                        {selectedDay.note}
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-border bg-card">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
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
                              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition ${
                                selectedFileId === f.id
                                  ? "bg-accent text-accent-foreground"
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
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={formatAI}>
                            <Sparkles className="mr-1.5 h-4 w-4" /> Format with AI
                          </Button>
                          <Button size="sm" onClick={saveFile}>
                            <Save className="mr-1.5 h-4 w-4" /> Save
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
                    <div className="p-4">
                      {currentFile ? (
                        <>
                          <div className="mb-3 space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                              AI note (context for Format-with-AI & students)
                            </Label>
                            <Textarea
                              value={currentFile.aiNote ?? ""}
                              onChange={async (e) => {
                                await api.updateFile(currentFile.id, { aiNote: e.target.value });
                                refetchFiles();
                              }}
                              rows={2}
                              placeholder="e.g. Demonstrates flexbox row alignment with 3 items"
                            />
                          </div>
                          <CodeViewer
                            value={draft}
                            language={currentFile.language}
                            readOnly={false}
                            onChange={setDraft}
                            height={480}
                          />
                        </>
                      ) : (
                        <p className="py-16 text-center text-sm text-muted-foreground">
                          No files yet. Add one to start.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>
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

function NewDayDialog({ topic, onCreated }: { topic: Topic; onCreated: (d: Day) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
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

function NewFileDialog({ dayId, onCreated }: { dayId: string; onCreated: (f: CodeFile) => void }) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("index.html");
  const [language, setLanguage] = useState<CodeFile["language"]>("html");
  const [content, setContent] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add file
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add file</DialogTitle>
        </DialogHeader>
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
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!displayName.trim()}
            onClick={async () => {
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
            }}
          >
            Add
          </Button>
        </DialogFooter>
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
