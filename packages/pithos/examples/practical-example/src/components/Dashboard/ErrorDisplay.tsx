import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ErrorDisplayProps = {
  error: string;
  onRetry: () => void;
};

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading dashboard</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
