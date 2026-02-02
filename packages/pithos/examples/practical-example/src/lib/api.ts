/**
 * Safe API helpers using Zygos ResultAsync
 * 
 * This file demonstrates the Zygos pattern for type-safe async operations.
 * In this example, we use mock data, but the pattern works identically with real APIs.
 */
import { ResultAsync, errAsync, okAsync } from "pithos/zygos/result/result-async";
import { parse } from "pithos/kanon/index";
import { DashboardSchema } from "./schemas";
import { formatUser, formatPosts } from "./transformers";
import type { DashboardData, RawDashboardData } from "./types";

/**
 * Load dashboard data with full error handling pipeline
 * 
 * This demonstrates the Zygos ResultAsync pattern:
 * 1. Wrap async operations in ResultAsync
 * 2. Chain with andThen for sequential operations
 * 3. Use map for transformations
 * 4. All errors are captured and typed
 */
export function loadDashboard(userId: string): ResultAsync<DashboardData, string> {
  return ResultAsync.fromPromise(
    fetch(`/api/dashboard/${userId}`),
    (error) => `Network error: ${error}`
  )
    .andThen((response) => {
      if (!response.ok) {
        return errAsync(`HTTP error: ${response.status}`);
      }
      return ResultAsync.fromPromise(
        response.json() as Promise<unknown>,
        (error) => `JSON parse error: ${error}`
      );
    })
    .andThen((data) => {
      const result = parse(DashboardSchema, data);

      if (!result.success) {
        return errAsync(`Invalid data: ${result.error}`);
      }

      // Safe cast: parse() validates that data matches RawDashboardData structure
      return okAsync(result.data as RawDashboardData);
    })
    .map((data) => ({
      user: formatUser(data.user),
      posts: formatPosts(data.posts),
      stats: data.stats,
    }));
}
