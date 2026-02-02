/**
 * Custom hook for loading dashboard data
 * Demonstrates the Pithos pipeline in a React context
 */
import { useState, useEffect, useCallback } from "react";
import { parse } from "pithos/kanon/index";
import { DashboardSchema } from "@/lib/schemas";
import { formatUser, formatPosts } from "@/lib/transformers";
import { mockDashboardData } from "@/lib/mock-data";
import type { DashboardData, RawDashboardData } from "@/lib/types";

type DashboardState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: DashboardData }
  | { status: "error"; error: string };

/**
 * Simulates the full Pithos pipeline with mock data
 * In production, this would use the loadDashboard function from api.ts
 */
export function useDashboard(userId: string) {
  const [state, setState] = useState<DashboardState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Step 1: Validate with Kanon
      const result = parse(DashboardSchema, mockDashboardData);

      if (!result.success) {
        setState({ status: "error", error: `Validation failed: ${result.error}` });
        return;
      }

      const rawData = result.data as RawDashboardData;

      // Step 2: Transform with Arkhe utilities
      const dashboardData: DashboardData = {
        user: formatUser(rawData.user),
        posts: formatPosts(rawData.posts),
        stats: rawData.stats,
      };

      setState({ status: "success", data: dashboardData });
    } catch (err) {
      setState({ status: "error", error: `Unexpected error: ${err}` });
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
