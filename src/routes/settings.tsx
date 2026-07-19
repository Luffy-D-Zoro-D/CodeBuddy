import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore } from "@/lib/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    if (!api.isAuthed()) {
      throw redirect({ to: "/" });
    }
  },
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings — CodeBuddy" }],
  }),
});

function SettingsPage() {
  useStore(); // Keep reactive
  const currentUsername = api.getUsername() || "";
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword && newPassword.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updateProfile(newUsername.trim(), newPassword || undefined);
      toast.success("Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">Update Profile</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Change your username or password. Leave password fields blank if you only want to change your username.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={isSubmitting}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-foreground">New Password (Optional)</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="max-w-md"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
