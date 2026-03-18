import { useState } from "react";
import { RotateCcw, Terminal, X } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { BRAND_COLOR } from "./constants";
import { WeatherPanel } from "./WeatherPanel";
import { FlightListPanel } from "./FlightListPanel";
import { RunwayPanel } from "./RunwayPanel";
import { MediatorLog } from "./MediatorLog";

export function FlightDashboard() {
  const {
    state, selectedFlight, logScrollRef,
    handleWeather, handleSelectFlight, handleReset,
  } = useDashboard();

  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-2.5" style={{ background: BRAND_COLOR }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="dgac-logo.svg" alt="DGAC" className="h-8 w-8 object-contain brightness-0 invert" />
            <div>
              <h1 className="text-sm font-bold text-white leading-none">DGAC Flight Control</h1>
              <p className="text-[10px] text-blue-200/70 mt-0.5">
                3 panels, 1 mediator : <code className="text-blue-100/80">createMediator()</code>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-blue-200/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLogOpen(!logOpen)}
              className="md:hidden p-2 bg-white/10 rounded-lg relative"
            >
              {logOpen ? <X className="w-4 h-4 text-white/70" /> : <Terminal className="w-4 h-4 text-white" />}
              {!logOpen && !!state.logs.length && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {state.logs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {logOpen && (
          <div className="md:hidden h-full p-3">
            <MediatorLog logs={state.logs} scrollRef={logScrollRef} />
          </div>
        )}

        <div className={`h-full max-w-6xl mx-auto px-1 sm:px-4 py-1 ${logOpen ? "hidden md:grid" : "flex flex-col md:grid"} md:grid-cols-5 md:gap-4`}>
          <div className="md:col-span-3 overflow-y-auto min-h-0 space-y-3 pb-2">
            <WeatherPanel
              current={state.weather}
              severity={state.severity}
              destination={selectedFlight?.destination}
              onChangeWeather={handleWeather}
            />
            <div className="space-y-3">
              <FlightListPanel
                flights={state.flights}
                selectedId={state.selectedFlightId}
                onSelect={handleSelectFlight}
              />
              <RunwayPanel
                capacity={state.runway}
                gate={selectedFlight?.gate}
                flightId={selectedFlight?.id}
              />
            </div>
          </div>

          <div ref={logScrollRef} className="hidden md:flex md:col-span-2 flex-col overflow-y-auto min-h-0">
            <MediatorLog logs={state.logs} />
          </div>
        </div>
      </div>

      <div className="shrink-0 py-1.5 text-center text-[10px] text-slate-400">
        Panels communicate through <code className="text-slate-500 font-medium">createMediator()</code> : no direct references
      </div>
    </div>
  );
}
