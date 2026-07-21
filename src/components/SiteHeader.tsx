import { Link, useNavigate } from "@tanstack/react-router";
import { Search, LayoutDashboard, LogOut, FolderTree, Settings, MessageSquare, Flag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, useStore } from "@/lib/store";

export function SiteHeader() {
  const storeVer = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [authed, setAuthed] = useState(false);

  // Feedback state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "suggestion" | "other">("suggestion");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAuthed(api.isAuthed());
  }, [storeVer]);

  const handleFeedbackSubmit = async () => {
    if (!feedbackMsg.trim()) return;
    setIsSubmitting(true);
    try {
      await api.submitFeedback(feedbackType, feedbackMsg);
      toast.success("Feedback submitted! Thank you.");
      setFeedbackOpen(false);
      setFeedbackMsg("");
    } catch (e) {
      toast.error("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">CodeBuddy</span>
        </Link>

        <form
          className="relative ml-4 hidden flex-1 max-w-md md:block"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) navigate({ to: "/search", search: { q } });
          }}
          suppressHydrationWarning
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lectures…"
            className="pl-9 h-9 bg-secondary/60 border-transparent focus-visible:border-border"
            suppressHydrationWarning
          />
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" className="text-base font-medium">
            <Link to="/explorer">
              <FolderTree className="mr-2 h-5 w-5" />
              Explorer
            </Link>
          </Button>

          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-base font-medium text-muted-foreground hover:text-foreground">
                <MessageSquare className="mr-2 h-5 w-5" />
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Feedback</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={feedbackType} 
                    onChange={e => setFeedbackType(e.target.value as any)}
                  >
                    <option value="suggestion">Suggestion / Idea</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    placeholder="Tell us what you think..." 
                    value={feedbackMsg} 
                    onChange={e => setFeedbackMsg(e.target.value)} 
                    rows={4}
                  />
                </div>
                <Button className="w-full" onClick={handleFeedbackSubmit} disabled={!feedbackMsg.trim() || isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Feedback
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {authed ? (
            <>
              <Button asChild variant="ghost" className="text-base font-medium">
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>

              <Button asChild variant="ghost" className="text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100/50">
                <Link to="/feedback">
                  <Flag className="mr-2 h-5 w-5" />
                  View Feedback
                </Link>
              </Button>

              <Button asChild variant="ghost" className="text-base font-medium px-2" title="Settings">
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="text-base font-medium"
                onClick={() => {
                  api.logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
