import { useState } from "react";
import { GripVertical } from "lucide-react";
import { COLUMNS } from "@/data/kanban";
import type { ColumnId, Task } from "@/lib/types";

export function KanbanColumn({ id, tasks, onDrop, highlightedTask, disabled }: {
  id: ColumnId;
  tasks: Task[];
  onDrop: (taskId: string, from: ColumnId, to: ColumnId) => void;
  highlightedTask: string | null;
  disabled: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { label, emoji } = COLUMNS[id];

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 p-3 min-h-[200px] transition-all duration-200 ${isDragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-200"}`}
      onDragOver={(e) => { if (!disabled) { e.preventDefault(); setIsDragOver(true); } }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { if (disabled) return; e.preventDefault(); setIsDragOver(false); const [taskId, from] = e.dataTransfer.getData("text/plain").split("|"); if (from !== id) onDrop(taskId, from as ColumnId, id); }}
    >
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
        <span>{emoji}</span> {label}
        <span className="ml-auto text-xs font-normal text-slate-400">{tasks.length}</span>
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={id} isHighlighted={highlightedTask === task.id} disabled={disabled} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, columnId, isHighlighted, disabled }: { task: Task; columnId: ColumnId; isHighlighted: boolean; disabled: boolean }) {
  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => { if (disabled) { e.preventDefault(); return; } e.dataTransfer.setData("text/plain", `${task.id}|${columnId}`); }}
      className={`${task.color} border rounded-lg p-2.5 cursor-grab active:cursor-grabbing transition-all duration-400 flex items-center gap-2 ${isHighlighted ? "ring-2 ring-indigo-500 scale-105" : ""} ${disabled ? "cursor-default opacity-75" : "hover:shadow-md"}`}
    >
      <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="text-sm font-medium text-slate-700 truncate">{task.title}</span>
    </div>
  );
}
