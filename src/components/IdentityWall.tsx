import { useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export function IdentityWall({ children }: { children: ReactNode }) {
  const storeVer = useStore();
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  const { data: globalSettings } = useQuery({
    queryKey: ["global_settings"],
    queryFn: () => api.getGlobalSettings(),
    refetchInterval: 10000, // Check every 10s
  });

  useEffect(() => {
    if (globalSettings?.requireStudentNames && !api.isAuthed()) {
      const submitted = localStorage.getItem("codebuddy_name_submitted");
      if (!submitted) {
        setNamePromptOpen(true);
      } else {
        setNamePromptOpen(false);
      }
    } else {
      setNamePromptOpen(false);
    }
  }, [globalSettings?.requireStudentNames, storeVer]);

  const handleNameSubmit = async () => {
    if (!studentName.trim()) return;
    setIsSubmittingName(true);
    try {
      const deviceId = typeof window !== "undefined" ? localStorage.getItem("codebuddy_device_id_v1") || "" : "";
      await api.submitStudentIdentity(studentName.trim(), deviceId);
      localStorage.setItem("codebuddy_name_submitted", "true");
      setNamePromptOpen(false);
      toast.success("Name saved successfully.");
    } catch (e) {
      toast.error("Failed to save name.");
    } finally {
      setIsSubmittingName(false);
    }
  };

  if (namePromptOpen) {
    // HARD BLOCK: Do not render children at all! 
    // If they delete this via inspect element, they get a blank screen.
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Identify Yourself</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your instructor requires you to provide your full name before accessing the CodeBuddy materials.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your name"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleNameSubmit()}
                autoFocus
                className="h-11"
              />
            </div>
            <Button className="w-full h-11 text-base font-semibold" onClick={handleNameSubmit} disabled={!studentName.trim() || isSubmittingName}>
              {isSubmittingName ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Continue to CodeBuddy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Allow access
  return <>{children}</>;
}
