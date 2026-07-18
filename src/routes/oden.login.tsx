import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/oden/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Teacher login — CodeClass" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      api.login(username, password);
      toast.success("Signed in");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          CodeClass
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Teacher login
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage lectures and files.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="u">Username</Label>
            <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Demo credentials: <span className="font-mono">admin</span> / <span className="font-mono">admin</span>
          </p>
        </form>
      </div>
    </div>
  );
}