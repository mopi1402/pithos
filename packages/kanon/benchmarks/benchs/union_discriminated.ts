import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { literal as literalV3 } from "@kanon/schemas/primitives/literal";
import {
  unionOf3 as unionV3_3,
  discriminatedUnion as discriminatedUnionV3,
} from "@kanon/schemas/operators/union";
import { LibName, POOL_SIZE } from "../dataset/config";

type ApiSuccessResponse = {
  status: "success";
  data: { id: number; name: string };
};

type ApiErrorResponse = {
  status: "error";
  error: { code: number; message: string };
};

type ApiLoadingResponse = {
  status: "loading";
  progress: number;
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse | ApiLoadingResponse;

const apiResponsePool: ApiResponse[] = Array.from(
  { length: POOL_SIZE },
  (_, i) => {
    const type = i % 3;
    if (type === 0) {
      return {
        status: "success" as const,
        data: { id: i, name: `Item-${i}` },
      };
    } else if (type === 1) {
      return {
        status: "error" as const,
        error: { code: 400 + (i % 5), message: `Error message ${i}` },
      };
    } else {
      return {
        status: "loading" as const,
        progress: (i % 100) / 100,
      };
    }
  }
);

type ShapeCircle = { type: "circle"; radius: number };
type ShapeRectangle = { type: "rectangle"; width: number; height: number };
type ShapeTriangle = { type: "triangle"; base: number; height: number };
type Shape = ShapeCircle | ShapeRectangle | ShapeTriangle;

const shapePool: Shape[] = Array.from({ length: POOL_SIZE }, (_, i) => {
  const type = i % 3;
  if (type === 0) {
    return { type: "circle" as const, radius: 10 + (i % 50) };
  } else if (type === 1) {
    return {
      type: "rectangle" as const,
      width: 10 + (i % 50),
      height: 20 + (i % 30),
    };
  } else {
    return {
      type: "triangle" as const,
      base: 15 + (i % 40),
      height: 25 + (i % 35),
    };
  }
});

type EventClick = { event: "click"; x: number; y: number; button: string };
type EventKeypress = { event: "keypress"; key: string; ctrl: boolean };
type EventScroll = { event: "scroll"; deltaX: number; deltaY: number };
type EventResize = { event: "resize"; width: number; height: number };
type DomEvent = EventClick | EventKeypress | EventScroll | EventResize;

const eventPool: DomEvent[] = Array.from({ length: POOL_SIZE }, (_, i) => {
  const type = i % 4;
  if (type === 0) {
    return {
      event: "click" as const,
      x: i % 1920,
      y: i % 1080,
      button: "left",
    };
  } else if (type === 1) {
    return {
      event: "keypress" as const,
      key: String.fromCharCode(65 + (i % 26)),
      ctrl: i % 2 === 0,
    };
  } else if (type === 2) {
    return { event: "scroll" as const, deltaX: i % 100, deltaY: (i * 2) % 100 };
  } else {
    return {
      event: "resize" as const,
      width: 800 + (i % 1120),
      height: 600 + (i % 480),
    };
  }
});

let apiIndex = 0;
let shapeIndex = 0;
let eventIndex = 0;

const getApiResponse = () => apiResponsePool[apiIndex++ % apiResponsePool.length];
const getShape = () => shapePool[shapeIndex++ % shapePool.length];
const getEvent = () => eventPool[eventIndex++ % eventPool.length];

export const discriminatedUnionApiResponseTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = discriminatedUnionV3("status", [
    objectV3({
      status: literalV3("success"),
      data: objectV3({
        id: numberV3(),
        name: stringV3(),
      }),
    }),
    objectV3({
      status: literalV3("error"),
      error: objectV3({
        code: numberV3(),
        message: stringV3(),
      }),
    }),
    objectV3({
      status: literalV3("loading"),
      progress: numberV3(),
    }),
  ]);

  const zodSchema = z.discriminatedUnion("status", [
    z.object({
      status: z.literal("success"),
      data: z.object({ id: z.number(), name: z.string() }),
    }),
    z.object({
      status: z.literal("error"),
      error: z.object({ code: z.number(), message: z.string() }),
    }),
    z.object({
      status: z.literal("loading"),
      progress: z.number(),
    }),
  ]);

  const valibotSchema = v.variant("status", [
    v.object({
      status: v.literal("success"),
      data: v.object({ id: v.number(), name: v.string() }),
    }),
    v.object({
      status: v.literal("error"),
      error: v.object({ code: v.number(), message: v.string() }),
    }),
    v.object({
      status: v.literal("loading"),
      progress: v.number(),
    }),
  ]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getApiResponse()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getApiResponse()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getApiResponse()),
    },
  ];
};

export const discriminatedUnionShapeTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = discriminatedUnionV3("type", [
    objectV3({
      type: literalV3("circle"),
      radius: numberV3(),
    }),
    objectV3({
      type: literalV3("rectangle"),
      width: numberV3(),
      height: numberV3(),
    }),
    objectV3({
      type: literalV3("triangle"),
      base: numberV3(),
      height: numberV3(),
    }),
  ]);

  const zodSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("circle"), radius: z.number() }),
    z.object({
      type: z.literal("rectangle"),
      width: z.number(),
      height: z.number(),
    }),
    z.object({
      type: z.literal("triangle"),
      base: z.number(),
      height: z.number(),
    }),
  ]);

  const valibotSchema = v.variant("type", [
    v.object({ type: v.literal("circle"), radius: v.number() }),
    v.object({
      type: v.literal("rectangle"),
      width: v.number(),
      height: v.number(),
    }),
    v.object({
      type: v.literal("triangle"),
      base: v.number(),
      height: v.number(),
    }),
  ]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getShape()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getShape()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getShape()),
    },
  ];
};

export const discriminatedUnionEventTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = discriminatedUnionV3("event", [
    objectV3({
      event: literalV3("click"),
      x: numberV3(),
      y: numberV3(),
      button: stringV3(),
    }),
    objectV3({
      event: literalV3("keypress"),
      key: stringV3(),
      ctrl: booleanV3(),
    }),
    objectV3({
      event: literalV3("scroll"),
      deltaX: numberV3(),
      deltaY: numberV3(),
    }),
    objectV3({
      event: literalV3("resize"),
      width: numberV3(),
      height: numberV3(),
    }),
  ]);

  const zodSchema = z.discriminatedUnion("event", [
    z.object({
      event: z.literal("click"),
      x: z.number(),
      y: z.number(),
      button: z.string(),
    }),
    z.object({
      event: z.literal("keypress"),
      key: z.string(),
      ctrl: z.boolean(),
    }),
    z.object({
      event: z.literal("scroll"),
      deltaX: z.number(),
      deltaY: z.number(),
    }),
    z.object({
      event: z.literal("resize"),
      width: z.number(),
      height: z.number(),
    }),
  ]);

  const valibotSchema = v.variant("event", [
    v.object({
      event: v.literal("click"),
      x: v.number(),
      y: v.number(),
      button: v.string(),
    }),
    v.object({
      event: v.literal("keypress"),
      key: v.string(),
      ctrl: v.boolean(),
    }),
    v.object({
      event: v.literal("scroll"),
      deltaX: v.number(),
      deltaY: v.number(),
    }),
    v.object({
      event: v.literal("resize"),
      width: v.number(),
      height: v.number(),
    }),
  ]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getEvent()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getEvent()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getEvent()),
    },
  ];
};

export const simpleUnionTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const mixedPool = Array.from({ length: POOL_SIZE }, (_, i) => {
    const type = i % 3;
    if (type === 0) return `string-${i}`;
    if (type === 1) return i * 10;
    return i % 2 === 0;
  });

  let mixedIndex = 0;
  const getMixed = () => mixedPool[mixedIndex++ % mixedPool.length];

  const kanonV3Schema = unionV3_3(stringV3(), numberV3(), booleanV3());
  const zodSchema = z.union([z.string(), z.number(), z.boolean()]);
  const valibotSchema = v.union([v.string(), v.number(), v.boolean()]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getMixed()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getMixed()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getMixed()),
    },
  ];
};

