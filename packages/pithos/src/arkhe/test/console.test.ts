// INTENTIONAL: Testing console methods requires using console statements
/* eslint-disable no-console */
import { describe, it, expect, beforeEach } from "vitest";
import { mockConsole, silenceConsole, withSilentConsole } from "./console";
import { __autoRestoreAll } from "./globals";

describe("console", () => {
  beforeEach(() => {
    __autoRestoreAll();
  });

  describe("mockConsole", () => {
    it("captures console calls", () => {
      const { mocks, restore } = mockConsole("log");
      console.log("test", 123);
      expect(mocks.log.callCount).toBe(1);
      expect(mocks.log.calls[0].args).toEqual(["test", 123]);
      restore();
    });

    it("defaults to log method", () => {
      const { mocks, restore } = mockConsole();
      console.log("test");
      expect(mocks.log.callCount).toBe(1);
      restore();
    });

    it("mocks multiple methods", () => {
      const { mocks, restore } = mockConsole("log", "warn", "error");
      console.log("log");
      console.warn("warn");
      console.error("error");
      expect(mocks.log.callCount).toBe(1);
      expect(mocks.warn.callCount).toBe(1);
      expect(mocks.error.callCount).toBe(1);
      restore();
    });

    it("records timestamp", () => {
      const { mocks, restore } = mockConsole("log");
      const before = Date.now();
      console.log("test");
      const after = Date.now();
      expect(mocks.log.calls[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(mocks.log.calls[0].timestamp).toBeLessThanOrEqual(after);
      restore();
    });

    it("clear resets mock state", () => {
      const { mocks, restore } = mockConsole("log");
      console.log("test");
      mocks.log.clear();
      expect(mocks.log.callCount).toBe(0);
      expect(mocks.log.calls).toEqual([]);
      restore();
    });

    it("clearAll resets all mocks", () => {
      const { mocks, clearAll, restore } = mockConsole("log", "warn");
      console.log("test");
      console.warn("test");
      clearAll();
      expect(mocks.log.callCount).toBe(0);
      expect(mocks.warn.callCount).toBe(0);
      restore();
    });

    it("passthrough still calls original method", () => {
      const originalLog = console.log;
      let originalCalled = false;
      let originalArgs: unknown[] | null = null;
      console.log = (...args: unknown[]) => {
        originalCalled = true;
        originalArgs = args;
      };

      const { mocks, restore } = mockConsole("log", { passthrough: true });
      console.log("test", 123);
      restore();

      expect(mocks.log.callCount).toBe(1);
      expect(mocks.log.calls[0].args).toEqual(["test", 123]);
      expect(originalCalled).toBe(true);
      expect(originalArgs).toEqual(["test", 123]);
      console.log = originalLog;
    });

    it("restores original methods", () => {
      const originalLog = console.log;
      const { restore } = mockConsole("log");
      restore();
      expect(console.log).toBe(originalLog);
    });

    it("[👾] does not call original when passthrough is false", () => {
      const originalLog = console.log;
      let originalCalled = false;
      console.log = () => {
        originalCalled = true;
      };

      const { restore } = mockConsole("log", { passthrough: false });
      console.log("test");
      restore();

      expect(originalCalled).toBe(false);
      console.log = originalLog;
    });

    it("[🎯] handles all console methods", () => {
      const { mocks, restore } = mockConsole(
        "log",
        "warn",
        "error",
        "info",
        "debug",
        "trace"
      );
      console.log("log");
      console.warn("warn");
      console.error("error");
      console.info("info");
      console.debug("debug");
      console.trace("trace");
      expect(mocks.log.callCount).toBe(1);
      expect(mocks.warn.callCount).toBe(1);
      expect(mocks.error.callCount).toBe(1);
      expect(mocks.info.callCount).toBe(1);
      expect(mocks.debug.callCount).toBe(1);
      expect(mocks.trace.callCount).toBe(1);
      restore();
    });

    it("[🎯] handles options as last argument", () => {
      const { mocks, restore } = mockConsole("log", "warn", { passthrough: false });
      console.log("test");
      expect(mocks.log.callCount).toBe(1);
      restore();
    });
  });

  describe("silenceConsole", () => {
    it("silences specified methods", () => {
      let output: unknown[] | null = null;
      const originalLog = console.log;
      console.log = (...args: unknown[]) => {
        output = args;
      };

      const restore = silenceConsole("log");
      console.log("should be silenced");

      restore();
      console.log = originalLog;

      expect(output).toBeNull();
    });

    it("defaults to all methods", () => {
      const restore = silenceConsole();
      // All methods silenced
      restore();
    });

    it("[👾] silences all 6 methods by default", () => {
      const outputs: Record<string, boolean> = {
        log: false,
        warn: false,
        error: false,
        info: false,
        debug: false,
        trace: false,
      };

      const originals = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
      };

      // Setup tracking
      console.log = () => { outputs.log = true; };
      console.warn = () => { outputs.warn = true; };
      console.error = () => { outputs.error = true; };
      console.info = () => { outputs.info = true; };
      console.debug = () => { outputs.debug = true; };
      console.trace = () => { outputs.trace = true; };

      const restore = silenceConsole();

      // Call all methods
      console.log("test");
      console.warn("test");
      console.error("test");
      console.info("test");
      console.debug("test");
      console.trace("test");

      restore();

      // Restore originals
      console.log = originals.log;
      console.warn = originals.warn;
      console.error = originals.error;
      console.info = originals.info;
      console.debug = originals.debug;
      console.trace = originals.trace;

      // None should have been called
      expect(outputs.log).toBe(false);
      expect(outputs.warn).toBe(false);
      expect(outputs.error).toBe(false);
      expect(outputs.info).toBe(false);
      expect(outputs.debug).toBe(false);
      expect(outputs.trace).toBe(false);
    });

    it("[👾] only silences specified method, not others", () => {
      let warnCalled = false;
      const originalWarn = console.warn;
      console.warn = () => { warnCalled = true; };

      const restore = silenceConsole("log"); // Only silence log
      console.warn("should print");
      restore();

      console.warn = originalWarn;
      expect(warnCalled).toBe(true);
    });

    it("restores original methods", () => {
      const originalWarn = console.warn;
      const restore = silenceConsole("warn");
      restore();
      expect(console.warn).toBe(originalWarn);
    });
  });

  describe("withSilentConsole", () => {
    it("executes function with silenced console", () => {
      const result = withSilentConsole(() => {
        console.log("silenced");
        return 42;
      });
      expect(result).toBe(42);
    });

    it("restores console after execution", () => {
      const originalLog = console.log;
      withSilentConsole(() => { });
      expect(console.log).toBe(originalLog);
    });

    it("restores console on error", () => {
      const originalLog = console.log;
      expect(() => {
        withSilentConsole(() => {
          throw new Error("test");
        });
      }).toThrow("test");
      expect(console.log).toBe(originalLog);
    });

    it("handles async functions", async () => {
      const result = await withSilentConsole(async () => {
        console.log("silenced");
        return Promise.resolve(42);
      });
      expect(result).toBe(42);
    });

    it("restores console after async rejection", async () => {
      const originalLog = console.log;
      await expect(
        withSilentConsole(async () => {
          throw new Error("async error");
        })
      ).rejects.toThrow("async error");
      expect(console.log).toBe(originalLog);
    });

    it("silences only specified methods", () => {
      const originalError = console.error;
      withSilentConsole(() => { }, "log");
      expect(console.error).toBe(originalError);
    });

    it("[👾] restores console only after async function resolves", async () => {
      const originalLog = console.log;
      let logWasSilencedDuringAsync = false;

      const promise = withSilentConsole(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        // Check if console is still silenced during async execution
        logWasSilencedDuringAsync = console.log !== originalLog;
        return 42;
      });

      // Console should still be silenced while promise is pending
      expect(console.log).not.toBe(originalLog);

      await promise;

      // Now it should be restored
      expect(console.log).toBe(originalLog);
      expect(logWasSilencedDuringAsync).toBe(true);
    });

    it("[🎯] silences specific methods only", () => {
      const originalError = console.error;
      const originalLog = console.log;

      withSilentConsole(() => {
        // log should be silenced, error should not
        expect(console.log).not.toBe(originalLog);
        expect(console.error).toBe(originalError);
      }, "log");
    });
  });
});
