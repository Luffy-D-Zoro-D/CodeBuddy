import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore, type Feedback, type DeviceRegistry } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Trash2, Bug, Lightbulb, MessageSquare, Loader2, RefreshCw, Search, Ban, ShieldAlert, MonitorSmartphone, Target } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

const parseUA = (ua?: string) => {
  if (!ua || ua === "Unknown") return "Unknown Device";
  
  // If it's already using our enhanced fingerprint format
  if (ua.includes(" | ")) {
    return ua.split(" | ")[0];
  }

  // Fallback for older data
  let browser = "Unknown Browser";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  
  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "Mac";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("like Mac")) os = "iOS";
  
  return `${browser} on ${os}`;
}

function FeedbackPage() {
  const storeVer = useStore();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [identities, setIdentities] = useState<Record<string, string>>({});
  const [requireNames, setRequireNames] = useState(false);
  const [lockdownMode, setLockdownMode] = useState(false);
  const [bannedDevices, setBannedDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [investigateTarget, setInvestigateTarget] = useState<Feedback | null>(null);
  const [suspects, setSuspects] = useState<DeviceRegistry[]>([]);
  const [loadingSuspects, setLoadingSuspects] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [data, ids, settings] = await Promise.all([
        api.listFeedback(),
        api.listStudentIdentities(),
        api.getGlobalSettings()
      ]);
      // Sort newest first
      setFeedback(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setRequireNames(settings.requireStudentNames);
      setLockdownMode(settings.lockdownMode);
      setBannedDevices(settings.bannedDevices || []);
      
      const idMap: Record<string, string> = {};
      for (const i of ids) {
        idMap[i.deviceId] = i.name;
      }
      setIdentities(idMap);
    } catch (e) {
      toast.error("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!api.isAuthed()) {
      navigate({ to: "/" });
      return;
    }
    fetchData();
  }, [storeVer]);

  const toggleRequireNames = async (checked: boolean) => {
    setRequireNames(checked);
    try {
      await api.updateGlobalSettings({ requireStudentNames: checked });
      toast.success(checked ? "Name Collection Mode ON" : "Name Collection Mode OFF");
    } catch (e) {
      setRequireNames(!checked);
      toast.error("Failed to update settings");
    }
  };

  const toggleLockdownMode = async (checked: boolean) => {
    setLockdownMode(checked);
    try {
      await api.updateGlobalSettings({ lockdownMode: checked });
      toast.success(checked ? "Lockdown Mode ON. New devices blocked." : "Lockdown Mode OFF");
    } catch (e) {
      setLockdownMode(!checked);
      toast.error("Failed to update settings");
    }
  };

  const handleBan = async (deviceId: string) => {
    if (!deviceId) return;
    try {
      await api.banDevice(deviceId);
      toast.success("Device Banned! Screen is now trapped.");
      fetchData(); // Refresh UI to show banned status
    } catch (e) {
      toast.error("Failed to ban device");
    }
  };

  const handleUnban = async (deviceId: string) => {
    if (!deviceId) return;
    try {
      await api.unbanDevice(deviceId);
      toast.success("Device Unbanned. Access restored.");
      fetchData();
    } catch (e) {
      toast.error("Failed to unban device");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.resolveFeedback(id);
      toast.success("Feedback marked as resolved");
      fetchData();
    } catch (e) {
      toast.error("Failed to resolve feedback");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFeedback(id);
      toast.success("Feedback deleted");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete feedback");
    }
  };

  const handleInvestigate = async (item: Feedback) => {
    setInvestigateTarget(item);
    setLoadingSuspects(true);
    try {
       const allDevices = await api.listDeviceRegistry();
       const targetTime = new Date(item.createdAt).getTime();
       // Find devices registered AFTER this feedback was submitted
       const filtered = allDevices
         .filter(d => new Date(d.createdAt).getTime() >= targetTime)
         .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
       setSuspects(filtered);
    } catch(e) {
       toast.error("Failed to load suspects");
    } finally {
       setLoadingSuspects(false);
    }
  };

  const getIcon = (type: string) => {
    if (type === "bug") return <Bug className="h-4 w-4 text-red-500" />;
    if (type === "suggestion") return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    return <MessageSquare className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Feedback</h1>
            <p className="text-muted-foreground mt-1">Review and manage bugs and suggestions submitted by students.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-secondary/30 p-3 sm:px-5 rounded-xl border border-border/50 shadow-sm w-full sm:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Switch id="name-mode" checked={requireNames} onCheckedChange={toggleRequireNames} />
                <Label htmlFor="name-mode" className="font-semibold cursor-pointer whitespace-nowrap">Require Names</Label>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border"></div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Switch id="lockdown-mode" checked={lockdownMode} onCheckedChange={toggleLockdownMode} className="data-[state=checked]:bg-red-600" />
                <Label htmlFor="lockdown-mode" className="font-semibold cursor-pointer text-red-600 flex items-center gap-1 whitespace-nowrap">
                  <ShieldAlert className="h-4 w-4" /> Lockdown Mode
                </Label>
              </div>
            </div>
            <Button variant="outline" onClick={fetchData} disabled={loading} className="w-full sm:w-auto">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, Name or Message..." 
            className="pl-9 bg-secondary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-xl">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No feedback found</h3>
            <p className="text-muted-foreground mt-1">There are no feedback submissions matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {feedback
              .filter(item => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                const idMatch = item.deviceId?.toLowerCase().includes(q);
                const nameMatch = identities[item.deviceId]?.toLowerCase().includes(q);
                const msgMatch = item.message?.toLowerCase().includes(q);
                return idMatch || nameMatch || msgMatch;
              })
              .map((item) => (
              <Card key={item.id} className={`${item.status === "resolved" ? "opacity-75 bg-secondary/30" : ""}`}>
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize flex items-center gap-2">
                        {item.type}
                        {item.status === "resolved" && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                            Resolved
                          </Badge>
                        )}
                        {bannedDevices.includes(item.deviceId) && (
                          <Badge variant="destructive" className="text-xs bg-red-600 uppercase flex items-center gap-1">
                            <Ban className="h-3 w-3" /> Banned
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1 flex-wrap">
                        <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                        <span>•</span>
                        <span className="font-medium text-foreground">
                          {identities[item.deviceId] ? (
                            <span className="text-primary">{identities[item.deviceId]}</span>
                          ) : (
                            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded flex items-center gap-1">
                              ID: {item.deviceId?.substring(0, 8) || "Unknown"}
                            </span>
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-xs">
                          <MonitorSmartphone className="h-3 w-3" />
                          {parseUA(item.userAgent)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handleInvestigate(item)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Target className="mr-2 h-4 w-4" /> Investigate
                    </Button>
                    {bannedDevices.includes(item.deviceId) ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnban(item.deviceId)} className="border-red-500/30 text-red-600 dark:text-red-500 hover:bg-red-500/10">
                        Unban
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleBan(item.deviceId)} className="hover:bg-red-100 hover:text-red-700 hover:border-red-200" title="Ban device and lock screen">
                        <Ban className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                    {item.status !== "resolved" && (
                      <Button variant="outline" size="sm" onClick={() => handleResolve(item.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        Resolve
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100/50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{item.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Investigation Dialog */}
      <Dialog open={!!investigateTarget} onOpenChange={(open) => !open && setInvestigateTarget(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-indigo-600" /> 
              Incident Investigation
            </DialogTitle>
            <DialogDescription>
              Track down anonymous users who cleared their cache to hide their identity.
            </DialogDescription>
          </DialogHeader>

          {investigateTarget && (
            <div className="space-y-6 py-4">
              <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Crime Scene Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Original Device ID</p>
                    <p className="font-mono text-sm">{investigateTarget.deviceId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time of Submission</p>
                    <p className="font-medium">{format(new Date(investigateTarget.createdAt), "MMM d, yyyy 'at' h:mm:ss a")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Browser Fingerprint</p>
                    <p className="font-medium text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded inline-block mt-1 border border-indigo-500/30">
                      {parseUA(investigateTarget.userAgent)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                  <span>Cache-Clear Suspects</span>
                  {suspects.length > 0 && <Badge variant="secondary">{suspects.length} Found</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These are brand new Device IDs that appeared <strong>after</strong> this feedback was submitted. If the culprit cleared their cache to hide, their new ID will be listed below. Look for matching browser fingerprints!
                </p>

                {loadingSuspects ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
                ) : suspects.length === 0 ? (
                  <div className="text-center py-8 bg-secondary/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No new devices detected after this incident.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {suspects.map((s, idx) => {
                      const isMatch = parseUA(s.userAgent) === parseUA(investigateTarget.userAgent);
                      const isBanned = bannedDevices.includes(s.deviceId);
                      const suspectName = identities[s.deviceId];
                      return (
                        <div key={s.deviceId} className={`flex items-center justify-between p-3 rounded-lg border ${isMatch ? 'bg-orange-500/10 border-orange-500/30' : 'bg-background border-border'}`}>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center bg-secondary rounded-md h-10 w-10 text-xs font-bold text-muted-foreground">
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {suspectName ? (
                                  <span className="font-semibold text-sm">{suspectName}</span>
                                ) : (
                                  <span className="font-mono text-sm font-semibold">{s.deviceId.substring(0, 12)}...</span>
                                )}
                                {isMatch && <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-[10px] px-1.5 py-0">Browser Match!</Badge>}
                                {isBanned && <Badge variant="destructive" className="text-[10px] px-1.5 py-0 bg-red-600"><Ban className="h-3 w-3 mr-1 inline"/>Trapped</Badge>}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                {suspectName && <span className="font-mono" title="Device ID">ID: {s.deviceId.substring(0, 8)}</span>}
                                <span>Seen: {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</span>
                                <span className="flex items-center gap-1"><MonitorSmartphone className="h-3 w-3"/> {parseUA(s.userAgent)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {isBanned ? (
                              <Button size="sm" variant="outline" className="border-red-500/30 text-red-600 dark:text-red-500 hover:bg-red-500/10" onClick={() => handleUnban(s.deviceId)}>
                                Unban
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="hover:bg-red-100 hover:text-red-700 hover:border-red-200" onClick={() => handleBan(s.deviceId)}>
                                <Ban className="h-4 w-4 mr-2 inline" /> Trap Suspect
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
