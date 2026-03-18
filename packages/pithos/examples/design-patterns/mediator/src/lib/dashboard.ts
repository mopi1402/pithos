/**
 * DGAC Flight Dashboard: Mediator demo.
 *
 * Three panels (flights, weather, runway) communicate exclusively
 * through a typed mediator. No panel knows about the others.
 */

import { createMediator } from "@pithos/core/eidos/mediator/mediator";
import { INITIAL_FLIGHTS, WEATHER_SEVERITY, CAPACITY_FROM_SEVERITY, applyWeatherToFlights } from "./data";
import type { WeatherCondition, RunwayCapacity, DashboardEvents, DashboardState } from "./types";

// Re-export for consumers
export type { WeatherCondition, RunwayCapacity, Flight, LogEntry, DashboardState } from "./types";
export { WEATHER_OPTIONS } from "./types";

export function createDashboard() {
  const mediator = createMediator<DashboardEvents>();
  let flights = INITIAL_FLIGHTS.map((f) => ({ ...f }));
  let weather: WeatherCondition = "clear";
  let severity = 0;
  let runway: RunwayCapacity = "full";
  let selectedFlightId: string | null = null;
  let logId = 0;
  const logs: { id: number; timestamp: string; event: string; detail: string }[] = [];

  let snapshot = buildSnapshot();
  const listeners = new Set<() => void>();

  function now() {
    return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function addLog(event: string, detail: string) {
    logs.push({ id: ++logId, timestamp: now(), event, detail });
    if (logs.length > 50) logs.shift();
  }

  function buildSnapshot(): DashboardState {
    return {
      flights: flights.map((f) => ({ ...f })),
      weather,
      severity,
      runway,
      selectedFlightId,
      logs: [...logs],
    };
  }

  function commit() {
    snapshot = buildSnapshot();
    for (const fn of listeners) fn();
  }

  // ── Wire up mediator handlers ──────────────────────────────────

  mediator.on("weatherChanged", ({ condition, severity: sev }) => {
    weather = condition;
    severity = sev;
    const changes = applyWeatherToFlights(flights, condition);
    for (const c of changes) addLog("flightStatusChanged", c);
    const cap = CAPACITY_FROM_SEVERITY(sev);
    mediator.emit("runwayUpdated", { capacity: cap });
    addLog("weatherChanged", `${condition} (severity ${sev})`);
  });

  mediator.on("runwayUpdated", ({ capacity }) => {
    runway = capacity;
    addLog("runwayUpdated", `capacity → ${capacity}`);
  });

  mediator.on("flightSelected", ({ flightId, destination, gate }) => {
    selectedFlightId = flightId;
    addLog("flightSelected", `${flightId} → ${destination} (gate ${gate})`);
  });

  mediator.on("flightDeselected", () => {
    selectedFlightId = null;
    addLog("flightDeselected", "selection cleared");
  });

  // ── Public API ─────────────────────────────────────────────────

  return {
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },

    getState(): DashboardState {
      return snapshot;
    },

    setWeather(condition: WeatherCondition) {
      mediator.emit("weatherChanged", { condition, severity: WEATHER_SEVERITY[condition] });
      commit();
    },

    selectFlight(flightId: string) {
      const f = flights.find((fl) => fl.id === flightId);
      if (f) {
        mediator.emit("flightSelected", { flightId: f.id, destination: f.destination, gate: f.gate });
        commit();
      }
    },

    deselectFlight() {
      mediator.emit("flightDeselected", {});
      commit();
    },

    reset() {
      flights = INITIAL_FLIGHTS.map((f) => ({ ...f }));
      weather = "clear";
      severity = 0;
      runway = "full";
      selectedFlightId = null;
      logs.length = 0;
      logId = 0;
      commit();
    },
  };
}
