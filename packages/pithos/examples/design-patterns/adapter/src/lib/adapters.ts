/**
 * Adapter pattern: adapt() bridges two incompatible APIs into one uniform interface.
 *
 * - IRVE API (EV charging) has its own URL format and response shape
 * - Prix-carburants API (fuel) has a different URL format and response shape
 * - adapt(source, mapInput, mapOutput) wraps each so both share:
 *     (bbox: BBox) => Promise<MapFeature[]>
 */

import { adapt } from "@pithos/core/eidos/adapter/adapter";
import { uniqBy } from "@pithos/core/arkhe/array/uniq-by";
import type { BBox, MapFeature } from "./types";

// ── Raw API shapes ──────────────────────────────────────────────────

interface IRVEStation {
  id_station_itinerance: string;
  nom_station: string;
  adresse_station: string;
  nom_operateur: string;
  nbre_pdc: number;
  puissance_nominale: number;
  prise_type_2: string | null;
  prise_type_combo_ccs: string | null;
  prise_type_chademo: string | null;
  gratuit: string | null;
  horaires: string | null;
  condition_acces: string | null;
  consolidated_latitude: number;
  consolidated_longitude: number;
}

interface FuelStation {
  id: number;
  adresse: string | null;
  ville: string | null;
  departement: string | null;
  geom: { lon: number; lat: number };
  gazole_prix: number | null;
  sp95_prix: number | null;
  sp98_prix: number | null;
  e10_prix: number | null;
  e85_prix: number | null;
  carburants_disponibles: string[] | null;
  horaires_automate_24_24: string | null;
}

// ── Raw fetch ───────────────────────────────────────────────────────

async function rawFetchCharging(url: string): Promise<IRVEStation[]> {
  const res = await fetch(url);
  if (!res.ok) throw res;
  return (await res.json()).results ?? [];
}

async function rawFetchFuel(url: string): Promise<FuelStation[]> {
  const res = await fetch(url);
  if (!res.ok) throw res;
  return (await res.json()).results ?? [];
}

// ── Transformers ────────────────────────────────────────────────────

function plugTypes(s: IRVEStation): string {
  const plugs: string[] = [];
  if (s.prise_type_2 === "True") plugs.push("Type 2");
  if (s.prise_type_combo_ccs === "True") plugs.push("CCS");
  if (s.prise_type_chademo === "True") plugs.push("CHAdeMO");
  return plugs.join(", ") || "—";
}

function toChargingFeature(s: IRVEStation): MapFeature {
  return {
    id: s.id_station_itinerance,
    name: s.nom_station,
    kind: "charging",
    coords: [s.consolidated_latitude, s.consolidated_longitude],
    meta: {
      operator: s.nom_operateur ?? "—",
      address: s.adresse_station ?? "—",
      plugs: plugTypes(s),
      points: s.nbre_pdc,
      power: `${s.puissance_nominale} kW`,
      free: s.gratuit === "True" ? "Yes" : s.gratuit === "False" ? "No" : "—",
      hours: s.horaires ?? "—",
      access: s.condition_acces ?? "—",
    },
  };
}

function toFuelFeature(s: FuelStation): MapFeature {
  const prices: Record<string, number> = {};
  if (s.gazole_prix != null) prices["Gazole"] = s.gazole_prix;
  if (s.sp95_prix != null) prices["SP95"] = s.sp95_prix;
  if (s.sp98_prix != null) prices["SP98"] = s.sp98_prix;
  if (s.e10_prix != null) prices["E10"] = s.e10_prix;
  if (s.e85_prix != null) prices["E85"] = s.e85_prix;
  const best = Object.entries(prices).sort((a, b) => a[1] - b[1])[0];

  return {
    id: `fuel-${s.id}`,
    name: `Station ${s.ville ?? "?"}`,
    kind: "fuel",
    coords: [s.geom.lat, s.geom.lon],
    meta: {
      address: s.adresse ?? "—",
      city: s.ville ?? "—",
      department: s.departement ?? "—",
      fuels: (s.carburants_disponibles ?? []).join(", ") || "—",
      "best price": best ? `${best[1].toFixed(3)}€ (${best[0]})` : "—",
      "24/7": s.horaires_automate_24_24 === "Oui" ? "Yes" : "No",
    },
  };
}

// ── Adapted functions (the pattern) ─────────────────────────────────

export const adaptedFetchCharging = adapt(
  rawFetchCharging,
  (bbox: BBox): string => {
    const where = `in_bbox(coordonneesxy, ${bbox.west}, ${bbox.south}, ${bbox.east}, ${bbox.north})`;
    const select = "id_station_itinerance,nom_station,adresse_station,nom_operateur,nbre_pdc,puissance_nominale,prise_type_2,prise_type_combo_ccs,prise_type_chademo,gratuit,horaires,condition_acces,consolidated_latitude,consolidated_longitude";
    return `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?where=${encodeURIComponent(where)}&select=${select}&group_by=${select}&limit=100`;
  },
  async (records): Promise<MapFeature[]> =>
    uniqBy((await records).map(toChargingFeature), (f) => f.id),
);

export const adaptedFetchFuel = adapt(
  rawFetchFuel,
  (bbox: BBox): string => {
    const where = `in_bbox(geom, ${bbox.south}, ${bbox.west}, ${bbox.north}, ${bbox.east})`;
    return `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?where=${encodeURIComponent(where)}&limit=100`;
  },
  async (records): Promise<MapFeature[]> =>
    uniqBy((await records).map(toFuelFeature), (f) => f.id),
);
