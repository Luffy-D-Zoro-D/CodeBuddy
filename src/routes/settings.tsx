import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Database, KeyRound, Save } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — CodeClass" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SettingsPage() {
  const navigate = useNavigate();
  const [mongoUri, setMongoUri] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [groqModel, setGroqModel] = useState("llama-3.3-70b-versatile");
  const [showKey, setShowKey] = useState(false);
  const [showUri, setShowUri] = useState(false);

  useEffect(() => {
    if (!api.isAuthed()) {
      navigate({ to: "/oden/login" });
      return;
    }
    const s = api.getSettings();
    setMongoUri(s.mongoUri);
    setGroqApiKey(s.groqApiKey);
    setGroqModel(s.groqModel);
  }, [navigate]);

  const save = () => {
    api.setSettings({ mongoUri, groqApiKey, groqModel });
    toast.success("Settings saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your backend connection and AI provider. Values are stored locally in your browser.
        </p>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              MongoDB
            </h2>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="uri">Connection URI</Label>
            <div className="flex gap-2">
              <Input
                id="uri"
                type={showUri ? "text" : "password"}
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/codeclass"
                className="font-mono text-xs"
              />
              <Button variant="outline" size="sm" onClick={() => setShowUri((v) => !v)}>
                {showUri ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used by your external Express backend. Never call MongoDB directly from the browser.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Groq AI
            </h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="groq">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="groq"
                  type={showKey ? "text" : "password"}
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="font-mono text-xs"
                />
                <Button variant="outline" size="sm" onClick={() => setShowKey((v) => !v)}>
                  {showKey ? "Hide" : "Show"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get one at console.groq.com. Powers the “Format with AI” button.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={groqModel}
                onChange={(e) => setGroqModel(e.target.value)}
                className="font-mono text-xs"
                placeholder="llama-3.3-70b-versatile"
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Button onClick={save}>
            <Save className="mr-1.5 h-4 w-4" /> Save settings
          </Button>
        </div>
      </main>
    </div>
  );
}