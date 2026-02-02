import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "./Header";
import { StatsCards } from "./StatsCards";
import { PostsList } from "./PostsList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorDisplay } from "./ErrorDisplay";
import { DemoControls } from "./DemoControls";

export function Dashboard() {
  const { state, reload } = useDashboard("user-123");

  if (state.status === "idle" || state.status === "loading") {
    return <LoadingSkeleton />;
  }

  if (state.status === "error") {
    return <ErrorDisplay error={state.error} onRetry={reload} />;
  }

  const { user, posts, stats } = state.data;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto space-y-6 px-4 py-6">
        <StatsCards stats={stats} />

        <div className="grid gap-6 lg:grid-cols-2">
          <PostsList
            posts={posts.published}
            title="Published Posts"
            description="Your live content"
            variant="published"
          />
          <PostsList
            posts={posts.draft}
            title="Drafts"
            description="Work in progress"
            variant="draft"
          />
        </div>

        {/* Demo controls for testing error handling */}
        <DemoControls />

        {/* Pithos info card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="font-semibold">✨ Powered by Pithos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This dashboard uses <strong>Kanon</strong> for schema validation,{" "}
            <strong>Arkhe</strong> for data transformation (capitalize, groupBy), and{" "}
            <strong>Zygos</strong> patterns for type-safe error handling.
          </p>
        </div>
      </main>
    </div>
  );
}
