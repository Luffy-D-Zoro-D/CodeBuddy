import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings — CodeBuddy" }, { name: "robots", content: "noindex" }],
  }),
});

function SettingsPage() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!api.isAuthed()) {
      navigate({ to: "/oden/login" });
      return;
    }
    const s = api.getSettings();
  }, [navigate]);

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    try {
      await api.changePassword(newPassword);
      toast.success("Password updated successfully");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your AI provider and account security.
        </p>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Admin Security
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New Admin Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new secure password"
                  className="font-mono text-xs"
                />
                <Button onClick={updatePassword} disabled={!newPassword}>
                  Update Password
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Changes the password used for /oden/login.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
