import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { api, useStore, type Feedback } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trash2, Bug, Lightbulb, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const storeVer = useStore();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await api.listFeedback();
      setFeedback(data);
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
    fetchFeedback();
  }, [storeVer]);

  const handleResolve = async (id: string) => {
    try {
      await api.resolveFeedback(id);
      toast.success("Feedback marked as resolved");
      fetchFeedback();
    } catch (e) {
      toast.error("Failed to resolve feedback");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFeedback(id);
      toast.success("Feedback deleted");
      fetchFeedback();
    } catch (e) {
      toast.error("Failed to delete feedback");
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Feedback</h1>
            <p className="text-muted-foreground mt-1">Review and manage bugs and suggestions submitted by students.</p>
          </div>
          <Button variant="outline" onClick={fetchFeedback} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-xl">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No feedback yet</h3>
            <p className="text-muted-foreground mt-1">When students submit feedback, it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {feedback.map((item) => (
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
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
    </div>
  );
}
