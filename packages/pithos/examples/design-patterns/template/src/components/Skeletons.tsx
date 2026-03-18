const SKELETON_WIDTHS = ["85%", "70%", "60%", "90%", "50%", "75%"];

export function Skeleton({ w, h }: { w: string; h: number }) {
  return (
    <div
      className="rounded animate-pulse"
      style={{ width: w, height: h, backgroundColor: "#e4e4e7" }}
    />
  );
}

export function SkeletonBlock({ lines }: { lines: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} w={SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]} h={10} />
      ))}
    </div>
  );
}

export function SidebarSkeletonBlock({ lines }: { lines: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="rounded animate-pulse"
          style={{
            width: SKELETON_WIDTHS[i % SKELETON_WIDTHS.length],
            height: 8,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}
