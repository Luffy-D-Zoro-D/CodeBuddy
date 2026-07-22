import { useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, useStore, getDeviceId } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, Ban } from "lucide-react";
import { toast } from "sonner";
import { getEnhancedFingerprint } from "@/lib/fingerprint";

export function IdentityWall({ children }: { children: ReactNode }) {
  const storeVer = useStore();
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [trapMode, setTrapMode] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  const deviceId = typeof window !== "undefined" ? getDeviceId() : "";

  const { data: globalSettings } = useQuery({
    queryKey: ["global_settings"],
    queryFn: () => api.getGlobalSettings(),
    refetchInterval: 10000, // Check every 10s
  });

  const { data: isRegistered } = useQuery({
    queryKey: ["is_registered", deviceId],
    queryFn: () => api.checkIfRegistered(deviceId),
    refetchInterval: 10000, // Check every 10s
    enabled: !!deviceId,
  });

  useEffect(() => {
    if (deviceId && typeof window !== "undefined") {
      getEnhancedFingerprint().then(ua => {
        api.registerDeviceSilent(deviceId, ua).catch(() => {});
      });
    }
  }, [deviceId]);

  useEffect(() => {
    if (api.isAuthed()) {
      setTrapMode(false);
      setNamePromptOpen(false);
      return;
    }

    const isBanned = globalSettings?.bannedDevices?.includes(deviceId);
    
    if (isBanned) {
      setTrapMode(true);
      setNamePromptOpen(false);
      return;
    }

    if (globalSettings?.lockdownMode && isRegistered === false) {
      setTrapMode(true);
      setNamePromptOpen(false);
      return;
    }

    setTrapMode(false);

    if (globalSettings?.requireStudentNames) {
      if (isRegistered === true) {
         localStorage.setItem("codebuddy_name_submitted", "true");
         setNamePromptOpen(false);
      } else if (isRegistered === false) {
         setNamePromptOpen(true);
      }
    } else {
      setNamePromptOpen(false);
    }
  }, [globalSettings, isRegistered, deviceId, storeVer]);

  const handleNameSubmit = async () => {
    if (!studentName.trim()) return;
    setIsSubmittingName(true);
    try {
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

  if (trapMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-950 px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-red-800 bg-red-900 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-950 mb-6 border-2 border-red-500 animate-[pulse_2s_infinite]">
              <Ban className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-black tracking-widest text-red-100 uppercase">Access Revoked</h1>
            <p className="mt-4 text-lg font-medium text-red-200 uppercase tracking-wide">
              Please see the instructor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (namePromptOpen) {
    // HARD BLOCK: Do not render children at all! 
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
