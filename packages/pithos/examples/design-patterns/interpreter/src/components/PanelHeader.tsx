export function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-3 h-[42px] border-b border-white/[0.06] bg-white/[0.02] shrink-0">
      <span className="text-zinc-400">{icon}</span>
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</span>
    </div>
  );
}
