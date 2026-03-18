import { useCallback, useRef, useSyncExternalStore } from "react";
import { createDashboard, type WeatherCondition } from "@/lib/dashboard";

export function useDashboard() {
  const dashRef = useRef(createDashboard());
  const dash = dashRef.current;

  const state = useSyncExternalStore(dash.subscribe, dash.getState);
  const logScrollRef = useRef<HTMLDivElement>(null);

  const scrollLogToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      logScrollRef.current?.scrollTo({ top: logScrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const handleWeather = useCallback((condition: WeatherCondition) => {
    dash.setWeather(condition);
    scrollLogToBottom();
  }, [dash, scrollLogToBottom]);

  const handleSelectFlight = useCallback((flightId: string) => {
    if (state.selectedFlightId === flightId) {
      dash.deselectFlight();
    } else {
      dash.selectFlight(flightId);
    }
    scrollLogToBottom();
  }, [dash, state.selectedFlightId, scrollLogToBottom]);

  const handleReset = useCallback(() => {
    dash.reset();
  }, [dash]);

  const selectedFlight = state.flights.find((f) => f.id === state.selectedFlightId);

  return {
    state,
    selectedFlight,
    logScrollRef,
    handleWeather,
    handleSelectFlight,
    handleReset,
  };
}
