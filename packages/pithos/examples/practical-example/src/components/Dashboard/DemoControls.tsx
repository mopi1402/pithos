import { useState } from "react";
import { Zap, Play } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { parse } from "pithos/kanon/index";
import { DashboardSchema } from "@/lib/schemas";

const PRESETS = {
  valid: {
    label: "✅ Valid Data",
    data: {
      user: {
        id: "user-123",
        firstName: "john",
        lastName: "doe",
        email: "john.doe@pithos.dev",
        role: "admin",
        createdAt: "2024-01-15T10:30:00Z",
      },
      posts: [
        { id: "1", title: "Hello", content: "World", status: "published" },
      ],
      stats: { totalViews: 100, totalLikes: 50, totalComments: 25 },
    },
  },
  missingFields: {
    label: "❌ Missing Fields",
    data: {
      user: {
        id: "user-123",
        firstName: "john",
        // missing: lastName, email, role, createdAt
      },
      posts: [],
      stats: { totalViews: 100, totalLikes: 50, totalComments: 25 },
    },
  },
  wrongTypes: {
    label: "❌ Wrong Types",
    data: {
      user: {
        id: 123, // should be string
        firstName: "john",
        lastName: "doe",
        email: "not-an-email", // invalid email
        role: "admin",
        createdAt: "2024-01-15",
      },
      posts: "not an array", // should be array
      stats: { totalViews: "many", totalLikes: 50, totalComments: 25 },
    },
  },
  invalidEmail: {
    label: "❌ Invalid Email",
    data: {
      user: {
        id: "user-123",
        firstName: "john",
        lastName: "doe",
        email: "invalid-email-format",
        role: "admin",
        createdAt: "2024-01-15T10:30:00Z",
      },
      posts: [],
      stats: { totalViews: 100, totalLikes: 50, totalComments: 25 },
    },
  },
};

export function DemoControls() {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(PRESETS.valid.data, null, 2)
  );

  const loadPreset = (key: keyof typeof PRESETS) => {
    setJsonInput(JSON.stringify(PRESETS[key].data, null, 2));
  };

  const validate = () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      toast({
        title: "JSON Parse Error",
        description: "Invalid JSON syntax",
        variant: "error",
      });
      return;
    }

    const result = parse(DashboardSchema, parsed);

    if (result.success) {
      toast({
        title: "✅ Validation Passed",
        description: "Data matches DashboardSchema",
        variant: "success",
      });
    } else {
      toast({
        title: "❌ Validation Failed (Kanon)",
        description: result.error,
        variant: "error",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4" />
        Schema Validation Playground
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Test Kanon validation with custom JSON data
      </p>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => loadPreset(key as keyof typeof PRESETS)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted"
          >
            {label}
          </button>
        ))}
      </div>

      {/* JSON editor */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="w-full h-64 font-mono text-sm p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        spellCheck={false}
      />

      {/* Validate button */}
      <button
        onClick={validate}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Play className="h-4 w-4" />
        Validate with Kanon
      </button>
    </div>
  );
}
