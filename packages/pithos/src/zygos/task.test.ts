/**
 * Tests pour Task - Fonctionnalités essentielles
 */

import { describe, it, expect } from "vitest";

import * as T from "@zygos/task"; // "fp-ts/Task" or "@zygos/task"
import { pipe } from "@arkhe/function/pipe"; // "fp-ts/function" or "@arkhe/function/pipe"

// ============================================================================
// 1. MODÈLE DE BASE
// ============================================================================

describe("Modèle de base", () => {
  it("type Task", async () => {
    const task: T.Task<number> = async () => 42;
    const result = await task();

    expect(result).toBe(42);
  });

  it("type Task avec différents types", async () => {
    const numberTask: T.Task<number> = async () => 42;
    const stringTask: T.Task<string> = async () => "hello";
    const objectTask: T.Task<{ x: number }> = async () => ({ x: 1 });

    expect(await numberTask()).toBe(42);
    expect(await stringTask()).toBe("hello");
    expect(await objectTask()).toEqual({ x: 1 });
  });
});

// ============================================================================
// 2. CONSTRUCTEURS
// ============================================================================

describe("Constructeurs", () => {
  it("of crée un Task avec une valeur", async () => {
    const task = T.of(42);
    const result = await task();

    expect(result).toBe(42);
  });

  it("of avec différents types", async () => {
    const numberTask = T.of(42);
    const stringTask = T.of("hello");
    const objectTask = T.of({ x: 1 });

    expect(await numberTask()).toBe(42);
    expect(await stringTask()).toBe("hello");
    expect(await objectTask()).toEqual({ x: 1 });
  });

  it("Task peut être créé directement depuis une Promise", async () => {
    const promise = Promise.resolve(42);
    const task: T.Task<number> = async () => promise;
    const result = await task();

    expect(result).toBe(42);
  });

  it("Task propage les erreurs de Promise", async () => {
    const promise = Promise.reject(new Error("test error"));
    const task: T.Task<number> = async () => promise;

    await expect(task()).rejects.toThrow("test error");
  });
});

// ============================================================================
// 3. TRANSFORMATIONS
// ============================================================================

describe("Transformations", () => {
  it("map transforme la valeur", async () => {
    const double = (n: number) => n * 2;
    const task = T.of(21);
    const result = await pipe(task, T.map(double))();

    expect(result).toBe(42);
  });

  it("map avec différents types", async () => {
    const toString = (n: number) => n.toString();
    const task = T.of(42);
    const result = await pipe(task, T.map(toString))();

    expect(result).toBe("42");
  });

  it("map chaîne plusieurs transformations", async () => {
    const addOne = (n: number) => n + 1;
    const double = (n: number) => n * 2;
    const task = T.of(10);
    const result = await pipe(task, T.map(addOne), T.map(double))();

    expect(result).toBe(22);
  });

  it("flatMap chaîne des Tasks", async () => {
    const divide = (x: number) => (y: number) => T.of(y / x);
    const task = T.of(10);
    const result = await pipe(task, T.flatMap(divide(2)))();

    expect(result).toBe(5);
  });

  it("flatMap avec plusieurs chaînages", async () => {
    const addOne = (n: number) => T.of(n + 1);
    const multiplyByTwo = (n: number) => T.of(n * 2);
    const task = T.of(10);
    const result = await pipe(
      task,
      T.flatMap(addOne),
      T.flatMap(multiplyByTwo)
    )();

    expect(result).toBe(22);
  });

  it("flatMap avec Task qui échoue", async () => {
    const failingTask = (): T.Task<number> => async () =>
      Promise.reject(new Error("flatMap error"));
    const task = T.of(10);
    const resultTask = pipe(task, T.flatMap(failingTask));

    await expect(resultTask()).rejects.toThrow("flatMap error");
  });
});

// ============================================================================
// 4. UTILITAIRES
// ============================================================================

describe("Utilitaires", () => {
  it("ap applique une fonction dans un Task à une valeur dans un Task", async () => {
    const double = (n: number) => n * 2;
    const valueTask = T.of(5);
    const functionTask = T.of(double);
    const result = await pipe(functionTask, T.ap(valueTask))();

    expect(result).toBe(10);
  });

  it("ap avec fonctions complexes", async () => {
    const createUser = (name: string) => (age: number) => ({ name, age });
    const nameTask = T.of("John");
    const ageTask = T.of(30);
    const functionTask = T.of(createUser);

    const partialResult = await pipe(functionTask, T.ap(nameTask))();
    const result = await pipe(T.of(partialResult), T.ap(ageTask))();

    expect(result).toEqual({ name: "John", age: 30 });
  });
});
