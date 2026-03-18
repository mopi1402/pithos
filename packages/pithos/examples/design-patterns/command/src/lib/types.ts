export interface Task {
  id: string;
  title: string;
  color: string;
}

export type ColumnId = "todo" | "inProgress" | "done";

export interface BoardState {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export interface HistoryEntry {
  id: number;
  description: string;
}
