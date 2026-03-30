import { Music, Waves, Play, Pause } from "lucide-react";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { SOURCES, VISUALIZERS } from "@/data/tracks";
import { VisualizerIcon, VIZ_ICONS } from "./icons";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { ProgressBar } from "./ProgressBar";

export function MusicVisualizer() {
  const {
    sourceKey, vizKey, setVizKey, playing, loading, volume, accent,
    handleSourceChange, handlePlayPause, handleVolume,
  } = useMusicPlayer();

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] text-white overflow-hidden select-none">
      {/* Mobile */}
      <div className="sm:hidden flex flex-col flex-1 min-h-0">
        <div className="px-4 py-3 bg-[#141416] border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.4)] flex items-center gap-3 shrink-0">
          <VisualizerIcon size={22} />
          <span className="w-px h-6 bg-white/10 shrink-0" />
          <div>
            <h1 className="text-[14px] font-bold text-zinc-100 tracking-tight">Nəvər</h1>
            <p className="text-[9px] text-zinc-500 mt-0.5">Bridge Pattern</p>
          </div>
        </div>
        <div className="shrink-0 p-3 pb-0 flex flex-col gap-2">
          <div className="flex gap-2">
            {SOURCES.map((s) => (
              <button key={s.key} onClick={() => handleSourceChange(s.key)} className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${s.key === sourceKey ? "text-white" : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300"}`} style={s.key === sourceKey ? { backgroundColor: s.color } : undefined}>
                {s.title}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {VISUALIZERS.map((v) => (
              <button key={v.key} onClick={() => setVizKey(v.key)} className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 ${v.key === vizKey ? "bg-white/[0.1] text-white ring-1 ring-white/[0.1]" : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300"}`}>
                {VIZ_ICONS[v.key]}{v.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden p-3">
          <div className="w-full h-full rounded-xl overflow-hidden bg-[#0a0a0b] ring-1 ring-white/[0.06]">
            <VisualizerCanvas vizKey={vizKey} accent={accent} playing={playing} />
          </div>
        </div>
        <div className="shrink-0 px-3 pb-3 flex flex-col gap-2">
          <ProgressBar accent={accent} />
          <div className="flex gap-2">
            <PlayButton loading={loading} playing={playing} accent={accent} onClick={handlePlayPause} />
            <VolumeSlider volume={volume} onChange={handleVolume} />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex flex-1 min-h-0">
        <div className="w-[260px] flex flex-col bg-[#111113] border-r border-white/[0.05] flex-shrink-0 min-h-0">
          <div className="px-5 py-5 flex items-center gap-3.5 bg-[#141416] border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.4)] shrink-0">
            <VisualizerIcon size={26} />
            <span className="w-px h-8 bg-white/10 shrink-0" />
            <div>
              <h1 className="text-[16px] font-bold text-zinc-100 tracking-tight">Nəvər</h1>
              <p className="text-[10px] text-zinc-500 mt-0.5">Bridge Pattern</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-4 pt-4 pb-3">
              <SectionLabel icon={<Music size={10} />} label="Audio Source" />
              <div className="space-y-1.5">
                {SOURCES.map((s) => {
                  const isActive = s.key === sourceKey;
                  return (
                    <button key={s.key} onClick={() => handleSourceChange(s.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${isActive ? "bg-white/[0.06] ring-1 ring-white/[0.08]" : "hover:bg-white/[0.03]"}`}>
                      <img src={`${import.meta.env.BASE_URL}${s.cover}`} alt={s.title} className={`w-8 h-8 rounded-lg object-cover transition-all ${isActive ? "shadow-lg" : "opacity-60 group-hover:opacity-80"}`} />
                      <div className="min-w-0">
                        <span className={`text-[12px] font-medium block transition-colors ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-400"}`}>{s.title}</span>
                        <span className={`text-[10px] block truncate transition-colors ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>{s.artist}</span>
                      </div>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mx-4 border-t border-white/[0.05]" />
            <div className="px-4 pt-3 pb-4">
              <SectionLabel icon={<Waves size={10} />} label="Visualizer" />
              <div className="space-y-1.5">
                {VISUALIZERS.map((v) => {
                  const isActive = v.key === vizKey;
                  return (
                    <button key={v.key} onClick={() => setVizKey(v.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${isActive ? "bg-white/[0.06] ring-1 ring-white/[0.08]" : "hover:bg-white/[0.03]"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? "shadow-lg" : "opacity-60 group-hover:opacity-80"}`} style={{ backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)" }}>
                        <span className={isActive ? "text-white" : "text-zinc-600"}>{VIZ_ICONS[v.key]}</span>
                      </div>
                      <span className={`text-[12px] font-medium transition-colors ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-400"}`}>{v.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-white/[0.05] space-y-3 shrink-0">
            <div className="flex gap-2">
              <PlayButton loading={loading} playing={playing} accent={accent} onClick={handlePlayPause} ghost />
              <VolumeSlider volume={volume} onChange={handleVolume} />
            </div>
            <ProgressBar accent={accent} />
            <div className="text-[10px] text-zinc-600">
              <span style={{ color: accent }} className="font-mono font-medium">{SOURCES.length} sources</span>
              <span className="mx-1.5">×</span>
              <span className="font-mono font-medium text-zinc-400">{VISUALIZERS.length} visualizers</span>
              <span className="mx-1.5">=</span>
              <span className="font-mono font-medium text-zinc-300">{SOURCES.length * VISUALIZERS.length} combos</span>
            </div>
            <p className="text-[9px] text-zinc-700 font-mono">visualize(frame, renderer)</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-[#0a0a0b] flex items-center justify-center p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
            <VisualizerCanvas vizKey={vizKey} accent={accent} playing={playing} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-zinc-600">{icon}</span>
      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.1em]">{label}</span>
    </div>
  );
}

function PlayButton({ loading, playing, accent, onClick, ghost }: { loading: boolean; playing: boolean; accent: string; onClick: () => void; ghost?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200 flex items-center justify-center gap-2" style={ghost ? { backgroundColor: `${accent}20`, color: accent } : { backgroundColor: accent }}>
      {loading ? "Loading..." : playing ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Play</>}
    </button>
  );
}

function VolumeSlider({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex-1 flex items-center gap-2 bg-white/[0.04] rounded-xl px-3">
      <Music size={10} className="text-zinc-600 shrink-0" />
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1 appearance-none bg-white/[0.08] rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-400" />
    </div>
  );
}
