import { useState } from "react";
import { ChevronRight, ChevronsRight, RotateCcw, Hash, GitMerge, Shapes, Terminal, X } from "lucide-react";
import { SOURCES, SOURCE_IDS, type SourceId } from "@/lib/pokedex";
import { usePokedex } from "@/hooks/usePokedex";
import { PokemonDisplay } from "./PokemonDisplay";
import { YieldLog } from "./YieldLog";

const SOURCE_ICONS: Record<SourceId, React.ReactNode> = {
  byIndex: <Hash className="w-4 h-4" />,
  byEvolution: <GitMerge className="w-4 h-4" />,
  byType: <Shapes className="w-4 h-4" />,
};

export function PokedexBrowser() {
  const {
    source, state, lastAdded, log,
    scrollRef, logScrollRef,
    handleNext, handleNextBatch, handleSourceChange, handleReset,
  } = usePokedex();

  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-red-600 via-red-500 to-red-700 overflow-hidden">
      {/* Fixed header */}
      <div className="shrink-0 pt-4 pb-3 px-2">
        <div className="max-w-4xl mx-auto">
          {/* Mobile: logo | text compact */}
          <div className="flex sm:hidden items-center gap-3 mb-3">
            <img src="pokemon-logo.png" alt="Pokémon" className="h-8 object-contain shrink-0" />
            <div className="w-px h-8 bg-white/20 shrink-0" />
            <div className="text-xs leading-relaxed">
              <div className="text-white/80 font-medium">Pokédex Gen 1</div>
              <div className="text-white/50">3 traversals, 1 interface</div>
              <code className="text-white/40 font-mono text-[10px]">iterator.next()</code>
            </div>
            <button
              onClick={() => setLogOpen(!logOpen)}
              className="ml-auto shrink-0 w-9 h-9 bg-slate-900/80 border border-slate-700 rounded-lg flex items-center justify-center relative"
            >
              {logOpen ? <X className="w-4 h-4 text-white/70" /> : <Terminal className="w-4 h-4 text-green-400" />}
              {!logOpen && !!log.length && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {log.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop: stacked header */}
          <div className="hidden sm:block">
            <div className="flex justify-center mb-2">
              <img src="pokemon-logo.png" alt="Pokémon" className="h-16 object-contain drop-shadow-lg" />
            </div>
            <p className="text-center text-white/90 text-sm font-medium mb-1">
              Pokédex Gen 1 : 3 traversals, 1 interface
            </p>
            <p className="text-center text-white/50 text-xs mb-4">
              <code className="bg-white/15 px-1.5 py-0.5 rounded font-mono text-[11px]">iterator.next()</code>
            </p>
          </div>

          {/* Source selector */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-lg mx-auto">
            {SOURCE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => handleSourceChange(id)}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-2 py-2 sm:px-3 sm:py-3 rounded-xl text-sm transition-all duration-400 ${
                  source === id
                    ? "bg-white text-red-600 shadow-lg shadow-red-900/20 scale-105"
                    : "bg-white/15 text-white/90 hover:bg-white/25 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-[11px] sm:text-xs">
                  {SOURCE_ICONS[id]}
                  <span className="hidden sm:inline">By </span>{SOURCES[id].label}
                </div>
                <span className={`text-[9px] sm:text-[10px] ${source === id ? "text-red-400" : "text-white/50"}`}>
                  {SOURCES[id].description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed controls */}
      <div className="shrink-0 max-w-4xl w-full mx-auto px-3 sm:px-4 pb-3">
        <div className="flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-xl p-2.5">
          <button
            onClick={handleNext}
            disabled={state.exhausted}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-400 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
            .next()
          </button>
          <button
            onClick={handleNextBatch}
            disabled={state.exhausted}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/90 text-red-600 rounded-lg text-sm font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-400 shadow-sm"
          >
            <ChevronsRight className="w-4 h-4" />
            ×5
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-all duration-400"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-xs text-white/90">
            <span className="flex items-center gap-1 text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <circle cx="12" cy="12" r="11" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
                <line x1="1" y1="12" x2="23" y2="12" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
                <circle cx="12" cy="12" r="3.5" fill="white" fillOpacity="0.5" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
              </svg>
              {state.nextCount}<span className="text-white/40">/</span>151
            </span>
            {state.exhausted && (
              <span className="px-2.5 py-1 bg-black/20 rounded-full text-white/80 font-medium text-[11px]">
                done: true
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0">
        {/* Mobile: log overlay replaces content */}
        {logOpen && (
          <div className="md:hidden h-full p-3">
            <div className="bg-slate-900 rounded-2xl p-4 shadow-inner border border-slate-700 h-full flex flex-col">
              <YieldLog log={log} />
            </div>
          </div>
        )}

        {/* Mobile: single scroll column / Desktop: two independent scroll columns */}
        <div className={`h-full max-w-4xl mx-auto px-3 sm:px-4 ${logOpen ? "hidden md:grid" : "flex flex-col md:grid"} md:grid-cols-3 md:gap-4`}>
          {/* Pokémon column */}
          <div ref={scrollRef} className="md:col-span-2 overflow-y-auto min-h-0 pb-1">
            {state.displayed.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
                <div className="text-5xl mb-3 opacity-40">📦</div>
                <p className="text-white/70 text-sm mb-1">No items yielded yet</p>
                <p className="text-white/40 text-xs">
                  Call <code className="font-mono bg-white/15 px-1.5 py-0.5 rounded">.next()</code> to pull from the iterator
                </p>
              </div>
            ) : (
              <PokemonDisplay source={source} displayed={state.displayed} lastAdded={lastAdded} />
            )}
          </div>

          {/* Yield log: desktop sidebar */}
          <div ref={logScrollRef} className="hidden md:flex flex-col overflow-y-auto min-h-0 bg-slate-900 rounded-2xl p-4 shadow-inner border border-slate-700">
            <YieldLog log={log} />
          </div>
        </div>
      </div>

      {/* Attribution footer */}
      <div className="shrink-0 py-1.5 text-center text-[10px] text-white/30">
        Data from{" "}
        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">
          PokéAPI
        </a>
        {" · "}Pokémon is a trademark of The Pokémon Company / Nintendo / Game Freak
      </div>
    </div>
  );
}
