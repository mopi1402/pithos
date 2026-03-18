import type { Flight, WeatherCondition, RunwayCapacity } from "./types";

export const INITIAL_FLIGHTS: Flight[] = [
  { id: "EZY79", airline: "easyJet",    destination: "Geneve", gate: "C03", status: "boarding", scheduledTime: "14:15" },
  { id: "AF24",  airline: "Air France", destination: "London", gate: "A12", status: "on-time", scheduledTime: "14:30" },
  { id: "AF76",  airline: "Air France", destination: "Paris", gate: "B07", status: "on-time", scheduledTime: "14:45" },
  { id: "IB76",  airline: "Iberia",      destination: "Madrid", gate: "A08", status: "on-time", scheduledTime: "15:00" },
  { id: "KL34",  airline: "KLM",         destination: "Amsterdam", gate: "B11", status: "on-time", scheduledTime: "15:20" },
  { id: "AZ609", airline: "ITA Airways", destination: "Rome", gate: "C09", status: "on-time", scheduledTime: "15:35" },
];

export const WEATHER_SEVERITY: Record<WeatherCondition, number> = {
  clear: 0,
  cloudy: 2,
  rain: 5,
  storm: 9,
};

export const CAPACITY_FROM_SEVERITY = (s: number): RunwayCapacity =>
  s >= 8 ? "closed" : s >= 5 ? "reduced" : "full";

/** Apply weather impact to flights. Returns descriptions of what changed. */
export function applyWeatherToFlights(flights: Flight[], condition: WeatherCondition): string[] {
  const changes: string[] = [];

  for (const f of flights) {
    if (f.status === "boarding" || f.status === "departed") continue;
    f.status = "on-time";
  }

  const eligible = flights.filter((f) => f.status !== "boarding" && f.status !== "departed");

  if (condition === "rain") {
    for (let i = 0; i < Math.min(2, eligible.length); i++) {
      eligible[i].status = "delayed";
      changes.push(`${eligible[i].id} delayed (${condition})`);
    }
  } else if (condition === "storm") {
    if (eligible.length) {
      eligible[0].status = "cancelled";
      changes.push(`${eligible[0].id} cancelled (${condition})`);
    }
    for (let i = 1; i < Math.min(3, eligible.length); i++) {
      eligible[i].status = "delayed";
      changes.push(`${eligible[i].id} delayed (${condition})`);
    }
  } else {
    for (const f of eligible) {
      changes.push(`${f.id} back on-time`);
    }
  }

  return changes;
}
