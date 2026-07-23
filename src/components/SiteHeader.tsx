import { Link, useNavigate } from "@tanstack/react-router";
import { Search, LayoutDashboard, LogOut, FolderTree, Settings, MessageSquare, Flag, Loader2, Code2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
            <Code2 className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            Code<span className="bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">Buddy</span>
          </span>
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

        <nav className="ml-auto flex flex-1 sm:flex-none justify-end items-center gap-0 sm:gap-2 overflow-x-auto no-scrollbar">


          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 sm:px-4">
                <MessageSquare className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Feedback</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-[95vw] sm:w-full">
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
              <Button asChild variant="ghost" className="text-base font-medium px-2 sm:px-4">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-5 w-5 sm:mr-2" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100/50 px-2 sm:px-4">
                <Link to="/feedback">
                  <Flag className="h-5 w-5 sm:mr-2" />
                  <span className="hidden md:inline">View Feedback</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="text-base font-medium px-2" title="Settings">
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="text-base font-medium px-2 sm:px-4"
                onClick={() => {
                  api.logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
