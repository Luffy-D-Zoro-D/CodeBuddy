import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  FolderTree,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, useStore } from "@/lib/store";

export function SiteHeader() {
  const storeVer = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(api.isAuthed());
  }, [storeVer]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-foreground">CodeBuddy</span>
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
          <Button asChild variant="ghost" size="sm">
            <Link to="/explorer">
              <FolderTree className="mr-1.5 h-4 w-4" />
              Explorer
            </Link>
          </Button>
          {authed ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/settings">
                  <SettingsIcon className="mr-1.5 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  api.logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
