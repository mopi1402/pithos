import { describe, it, expect } from "vitest";
import { remove } from "./remove";

describe("remove", () => {
  it("removes elements matching predicate", () => {
    const array = [1, 2, 3, 4];
    const removed = remove(array, (n) => n % 2 === 0);
    expect(removed).toEqual([2, 4]);
    expect(array).toEqual([1, 3]);
  });

  it("returns empty array when no matches", () => {
    const array = [1, 3, 5];
    const removed = remove(array, (n) => n % 2 === 0);
    expect(removed).toEqual([]);
    expect(array).toEqual([1, 3, 5]);
  });

  it("removes all elements when all match", () => {
    const array = [2, 4, 6];
    const removed = remove(array, (n) => n % 2 === 0);
    expect(removed).toEqual([2, 4, 6]);
    expect(array).toEqual([]);
  });

  it("provides index to predicate", () => {
    const array = ["a", "b", "c", "d"];
    const removed = remove(array, (_, index) => index % 2 === 1);
    expect(removed).toEqual(["b", "d"]);
    expect(array).toEqual(["a", "c"]);
  });

  it("provides array to predicate", () => {
    const array = [1, 2, 3];
    const removed = remove(array, (_, __, arr) => arr.length === 3);
    expect(removed).toEqual([1, 2, 3]);
    expect(array).toEqual([]);
  });

  it("[🎯] handles empty array", () => {
    const array: number[] = [];
    const removed = remove(array, (n) => n > 0);
    expect(removed).toEqual([]);
    expect(array).toEqual([]);
  });

  it("[🎯] handles single element array - matching", () => {
    const array = [2];
    const removed = remove(array, (n) => n % 2 === 0);
    expect(removed).toEqual([2]);
    expect(array).toEqual([]);
  });

  it("[🎯] handles single element array - not matching", () => {
    const array = [1];
    const removed = remove(array, (n) => n % 2 === 0);
    expect(removed).toEqual([]);
    expect(array).toEqual([1]);
  });

  it("mutates original array", () => {
    const array = [1, 2, 3, 4, 5];
    remove(array, (n) => n > 3);
    expect(array).toEqual([1, 2, 3]);
  });
});
