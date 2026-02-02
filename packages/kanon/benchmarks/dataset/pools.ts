import { POOL_SIZE } from "./config";
import type {
  StringPool,
  NumberPool,
  BooleanPool,
  SimpleObjectPool,
  ComplexObjectPool,
  StringArrayPool,
  NumberArrayPool,
  BulkObjectPool,
  BulkStringPool,
  InvalidStringPool,
  InvalidObjectPool,
} from "./types";

export const stringPool: StringPool = Array.from(
  { length: POOL_SIZE },
  (_, i) =>
    `test-string-${i}-${Math.random().toString(36).substring(2)}-${
      Date.now() + i
    }`
);

export const longStringPool: StringPool = Array.from(
  { length: POOL_SIZE },
  (_, i) =>
    `long-string-${i}-${"x".repeat(800 + (i % 200))}-${Math.random().toString(
      36
    )}`
);

export const numberPool: NumberPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => Math.random() * 1000000 + i
);

export const booleanPool: BooleanPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => (i + Math.random()) % 2 > 1
);

export const simpleObjectPool: SimpleObjectPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => ({
    name: `User-${i}-${Math.random().toString(36).substring(2)}`,
    age: 18 + (i % 50) + Math.floor(Math.random() * 10),
    active: (i + Math.random()) % 2 > 1,
  })
);

export const complexObjectPool: ComplexObjectPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => {
    const userCount = 3 + (i % 8);
    return {
      id: 1000 + i + Math.floor(Math.random() * 9000),
      name: `Complex-${i}-${Math.random().toString(36).substring(2)}`,
      tags: Array.from(
        { length: 2 + (i % 4) },
        (_, j) => `tag-${i}-${j}-${Math.random().toString(36).substring(2)}`
      ),
      config: {
        enabled: i % 3 !== 0,
        timeout: 1000 + (i % 5000),
        retries: 1 + (i % 5),
      },
      users: Array.from({ length: userCount }, (_, j) => ({
        id: i * 100 + j,
        name: `User-${i}-${j}-${Math.random().toString(36).substring(2)}`,
        active: (i + j) % 3 !== 0,
      })),
    };
  }
);

export const stringArrayPool: StringArrayPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => {
    const length = 3 + (i % 10);
    return Array.from(
      { length },
      (_, j) => `item-${i}-${j}-${Math.random().toString(36).substring(2)}`
    );
  }
);

export const numberArrayPool: NumberArrayPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => {
    const length = 3 + (i % 10);
    return Array.from({ length }, (_, j) => Math.random() * 1000 + j + i * 10);
  }
);

export const largeStringArrayPool: StringArrayPool = Array.from(
  { length: POOL_SIZE / 10 },
  (_, i) => {
    const length = 500 + (i % 1000);
    return Array.from(
      { length },
      (_, j) => `large-${i}-${j}-${Math.random().toString(36).substring(2)}`
    );
  }
);

// Pools pour les données invalides
export const invalidStringPool: InvalidStringPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => 12345 + i + Math.random() * 1000
);

export const invalidObjectPool: InvalidObjectPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `not-object-${i}-${Math.random().toString(36)}`
);

// Pools pour les données en lot
export const bulkStringPools: BulkStringPool = Array.from(
  { length: POOL_SIZE },
  () =>
    Array.from(
      { length: 100 },
      (_, i) => `bulk-${i}-${Math.random().toString(36).substring(2)}`
    )
);

export const bulkObjectPools: BulkObjectPool = Array.from(
  { length: POOL_SIZE },
  () =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i + Math.floor(Math.random() * 10000),
      name: `BulkUser-${i}-${Math.random().toString(36).substring(2)}`,
      active: Math.random() > 0.5,
    }))
);

// ===== USER REGISTRATION POOL =====

export const userRegistrationPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  name: `User-${i}-${Math.random().toString(36).substring(2, 8)}`,
  email: `user${i}@example.com`,
  age: 18 + (i % 80),
  password: `SecureP@ss${i}${Math.random().toString(36).substring(2, 10)}`,
  terms: true,
}));

// ===== NOUVEAUX POOLS POUR V3 =====

export const nullPool = Array.from({ length: POOL_SIZE }, () => null);

export const undefinedPool = Array.from({ length: POOL_SIZE }, () => undefined);

export const anyPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const types = [null, undefined, i, `string-${i}`, i % 2 === 0, { key: i }];
  return types[i % types.length];
});

export const unknownPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const types = [null, undefined, i, `string-${i}`, i % 2 === 0, { key: i }];
  return types[i % types.length];
});

export const datePool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const baseDate = new Date("2023-01-01");
  baseDate.setDate(baseDate.getDate() + i);
  return baseDate;
});

export const bigintPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  return BigInt(i + Math.floor(Math.random() * 1000000));
});
