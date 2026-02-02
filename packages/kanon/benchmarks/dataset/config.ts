// Size of the generated pools
export const POOL_SIZE = 10000;

export type LibName =
  | "@kanon/V3.0"
  | "@kanon/JIT"
  | "Zod"
  | "Valibot"
  | "Superstruct"
  | "Fast-Validator"
  | "TypeBox"
  | "AJV";

const defaultAvailability: Record<LibName, boolean> = {
  "@kanon/V3.0": true,
  "@kanon/JIT": true,
  Zod: true,
  Valibot: false,
  Superstruct: false,
  "Fast-Validator": false,
  TypeBox: false,
  AJV: false,
};

const mapName = (name: string): LibName | null => {
  const n = name.trim().toLowerCase();
  if (n === "kanon" || n === "kanonv3" || n === "v3") return "@kanon/V3.0";
  if (n === "jit" || n === "kanonjit") return "@kanon/JIT";
  if (n === "zod") return "Zod";
  if (n === "valibot") return "Valibot";
  if (n === "superstruct") return "Superstruct";
  if (n === "fastest" || n === "fast-validator" || n === "fastest-validator") return "Fast-Validator";
  if (n === "typebox" || n === "type-box") return "TypeBox";
  if (n === "ajv") return "AJV";
  return null;
};

// Libraries included when using "all" (only v3 and JIT for Kanon, all external libs)
const ALL_LIBS: LibName[] = [
  "@kanon/V3.0",
  "@kanon/JIT",
  "Zod",
  "Valibot",
  "Superstruct",
  "Fast-Validator",
  "TypeBox",
  "AJV",
];

const envLibs = process.env.BENCH_LIBS;
const availability: Record<LibName, boolean> = { ...defaultAvailability };

export const BENCH_LIB_HINTS = [
  "@kanon/V3.0 (aliases: kanon, v3, kanonv3)",
  "@kanon/JIT (aliases: jit, kanonjit)",
  "Zod",
  "Valibot",
  "Superstruct",
  "Fast-Validator (aliases: fastest)",
  "TypeBox",
  "AJV",
  "all (v3, jit + all external libs)",
] as const;

if (envLibs) {
  Object.keys(availability).forEach((k) => {
    availability[k as LibName] = false;
  });
  
  // Handle "all" shortcut
  if (envLibs.trim().toLowerCase() === "all") {
    ALL_LIBS.forEach((lib) => {
      availability[lib] = true;
    });
  } else {
    envLibs
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .forEach((entry) => {
        const mapped = mapName(entry);

        if (mapped) {
          availability[mapped] = true;
        } else {
          // INTENTIONAL: surface invalid user input for BENCH_LIBS
          // eslint-disable-next-line no-console
          console.warn(
            `[bench] Ignoring unknown library name in BENCH_LIBS: "${entry}"`
          );
        }
      });
  }
}

export const isAvailable = availability satisfies Record<LibName, boolean>;
