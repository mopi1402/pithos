import type { BoardState, ColumnId } from "@/lib/types";

export const COLUMNS: Record<ColumnId, { label: string; emoji: string }> = {
  todo: { label: "To Do", emoji: "📋" },
  inProgress: { label: "Doing", emoji: "🔄" },
  done: { label: "Done", emoji: "✅" },
};

export const INITIAL_BOARD: BoardState = {
  todo: [
    { id: "1", title: "Fix bug #42", color: "bg-red-100 border-red-300" },
    { id: "2", title: "Write tests", color: "bg-blue-100 border-blue-300" },
    { id: "3", title: "Update docs", color: "bg-amber-100 border-amber-300" },
  ],
  inProgress: [
    { id: "4", title: "Code review", color: "bg-purple-100 border-purple-300" },
  ],
  done: [
    { id: "5", title: "Deploy v1.0", color: "bg-emerald-100 border-emerald-300" },
  ],
};
