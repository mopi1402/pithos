export type WeatherCondition = "clear" | "cloudy" | "rain" | "storm";
export type RunwayCapacity = "full" | "reduced" | "closed";

export interface Flight {
  id: string;
  airline: string;
  destination: string;
  gate: string;
  status: "on-time" | "delayed" | "boarding" | "departed" | "cancelled";
  scheduledTime: string;
}

export type DashboardEvents = {
  weatherChanged: { condition: WeatherCondition; severity: number };
  flightSelected: { flightId: string; destination: string; gate: string };
  flightDeselected: Record<string, never>;
  runwayUpdated: { capacity: RunwayCapacity };
};

export interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  detail: string;
}

export interface DashboardState {
  flights: Flight[];
  weather: WeatherCondition;
  severity: number;
  runway: RunwayCapacity;
  selectedFlightId: string | null;
  logs: LogEntry[];
}

export const WEATHER_OPTIONS: WeatherCondition[] = ["clear", "cloudy", "rain", "storm"];
