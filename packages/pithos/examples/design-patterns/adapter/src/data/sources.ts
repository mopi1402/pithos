import type { MapFeature, SourceType } from "@/lib/types";

export const SOURCES: SourceType[] = ["charging", "fuel"];

export const SOURCE_CONFIG: Record<SourceType, { label: string; emoji: string; symbol: string; color: string }> = {
  charging: { label: "EV Charging", emoji: "⚡", symbol: "E", color: "#16a34a" },
  fuel:     { label: "Fuel stations", emoji: "⛽", symbol: "F", color: "#d97706" },
};

export const FALLBACK_CHARGING: MapFeature[] = [
  { id: "demo-c1", name: "Paris | Rue de Rivoli 12", kind: "charging", coords: [48.8606, 2.3376], meta: { operator: "Belib'", address: "12 Rue de Rivoli, 75004 Paris", plugs: "Type 2, CCS", points: 4, power: "22 kW", free: "No", hours: "24/7", access: "Accès libre" } },
  { id: "demo-c2", name: "Paris | Boulevard Voltaire 45", kind: "charging", coords: [48.8632, 2.3795], meta: { operator: "TotalEnergies", address: "45 Bd Voltaire, 75011 Paris", plugs: "Type 2", points: 2, power: "7 kW", free: "No", hours: "24/7", access: "Accès libre" } },
  { id: "demo-c3", name: "Paris | Avenue des Champs-Élysées", kind: "charging", coords: [48.8698, 2.3078], meta: { operator: "Ionity", address: "Av. des Champs-Élysées, 75008 Paris", plugs: "CCS, CHAdeMO", points: 6, power: "350 kW", free: "No", hours: "24/7", access: "Accès libre" } },
  { id: "demo-c4", name: "Paris | Place de la Bastille", kind: "charging", coords: [48.8533, 2.3692], meta: { operator: "Belib'", address: "Place de la Bastille, 75012 Paris", plugs: "Type 2", points: 8, power: "22 kW", free: "No", hours: "24/7", access: "Accès libre" } },
  { id: "demo-c5", name: "Paris | Gare de Lyon", kind: "charging", coords: [48.8443, 2.3735], meta: { operator: "Izivia", address: "Gare de Lyon, 75012 Paris", plugs: "Type 2, CCS", points: 10, power: "50 kW", free: "No", hours: "24/7", access: "Accès libre" } },
];

export const FALLBACK_FUELS: MapFeature[] = [
  { id: "demo-f1", name: "Station Paris 11e", kind: "fuel", coords: [48.8590, 2.3800], meta: { address: "Rue de la Roquette", city: "Paris", department: "Paris", fuels: "Gazole, SP95, E10", "best price": "1.789€ (E10)", "24/7": "Yes" } },
  { id: "demo-f2", name: "Station Paris 15e", kind: "fuel", coords: [48.8420, 2.2930], meta: { address: "Rue de Vaugirard", city: "Paris", department: "Paris", fuels: "Gazole, SP95, SP98, E10", "best price": "1.799€ (E10)", "24/7": "No" } },
  { id: "demo-f3", name: "Station Paris 13e", kind: "fuel", coords: [48.8280, 2.3560], meta: { address: "Avenue d'Italie", city: "Paris", department: "Paris", fuels: "Gazole, SP95, E10, E85", "best price": "0.849€ (E85)", "24/7": "Yes" } },
  { id: "demo-f4", name: "Station Paris 18e", kind: "fuel", coords: [48.8920, 2.3440], meta: { address: "Bd de la Chapelle", city: "Paris", department: "Paris", fuels: "Gazole, SP95, E10", "best price": "1.819€ (E10)", "24/7": "No" } },
  { id: "demo-f5", name: "Station Paris 20e", kind: "fuel", coords: [48.8640, 2.3980], meta: { address: "Rue de Bagnolet", city: "Paris", department: "Paris", fuels: "Gazole, SP95, SP98, E10, E85", "best price": "0.859€ (E85)", "24/7": "Yes" } },
];
