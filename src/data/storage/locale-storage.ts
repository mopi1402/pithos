import { Nullable } from "../../types/common";

/**
 * Utility class for safe localStorage operations with automatic JSON serialization.
 *
 * This class provides a type-safe wrapper around the browser's localStorage API,
 * automatically handling JSON serialization/deserialization and error handling.
 * All methods are static and include try-catch blocks to prevent crashes
 * when localStorage is unavailable or throws errors.
 *
 * @example
 * ```typescript
 * // Store user preferences
 * LocalStorage.set('userTheme', 'dark');
 * LocalStorage.set('userSettings', { fontSize: 14, notifications: true });
 *
 * // Retrieve data with type safety
 * const theme = LocalStorage.get('userTheme', 'light'); // string
 * const settings = LocalStorage.get('userSettings', { fontSize: 12, notifications: false }); // UserSettings
 *
 * // Remove specific items
 * LocalStorage.remove('userTheme');
 *
 * // Clear all stored data
 * LocalStorage.clear();
 * ```
 * @since 1.0.0
 */
export class LocalStorage {
  /**
   * Retrieves a value from localStorage with automatic JSON parsing.
   *
   * Attempts to retrieve and parse a value from localStorage. If the key doesn't exist
   * or parsing fails, returns the provided default value or null.
   *
   * @param key - The storage key to retrieve
   * @param defaultValue - Optional default value to return if key doesn't exist or parsing fails
   * @returns The parsed value, default value, or null if neither exists
   * @since 1.0.0
   *
   * @example
   * ```typescript
   * // Basic retrieval
   * const theme = LocalStorage.get('theme'); // string | null
   *
   * // With default value
   * const fontSize = LocalStorage.get('fontSize', 14); // number
   *
   * // Complex objects
   * const user = LocalStorage.get('user', { name: 'Guest', role: 'user' }); // User
   *
   * // Type safety
   * const settings = LocalStorage.get<Settings>('settings'); // Settings | null
   * ```
   */
  static get<T>(key: string, defaultValue?: T): Nullable<T> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  }

  /**
   * Stores a value in localStorage with automatic JSON serialization.
   *
   * Converts the value to JSON string and stores it in localStorage. If storage
   * is full or unavailable, the operation fails silently.
   *
   * @param key - The storage key to use
   * @param value - The value to store (will be JSON serialized)
   * @since 1.0.0
   *
   * @example
   * ```typescript
   * // Store primitive values
   * LocalStorage.set('username', 'john_doe');
   * LocalStorage.set('isLoggedIn', true);
   *
   * // Store objects and arrays
   * LocalStorage.set('userPreferences', { theme: 'dark', language: 'en' });
   * LocalStorage.set('recentItems', ['item1', 'item2', 'item3']);
   *
   * // Store complex nested structures
   * LocalStorage.set('appState', {
   *   user: { id: 1, name: 'John' },
   *   settings: { notifications: true, theme: 'dark' }
   * });
   * ```
   */
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  /**
   * Removes a specific key-value pair from localStorage.
   *
   * Attempts to remove the specified key from localStorage. If the key doesn't exist
   * or removal fails, the operation fails silently.
   *
   * @param key - The storage key to remove
   * @since 1.0.0
   *
   * @example
   * ```typescript
   * // Remove specific items
   * LocalStorage.remove('userToken');
   * LocalStorage.remove('temporaryData');
   *
   * // Clean up user data
   * LocalStorage.remove('userPreferences');
   * LocalStorage.remove('recentSearches');
   * ```
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  /**
   * Clears all data from localStorage.
   *
   * Removes all key-value pairs from localStorage. This is a destructive operation
   * that will clear all stored data for the current domain.
   *
   * @since 1.0.0
   *
   * @example
   * ```typescript
   * // Clear all stored data (use with caution!)
   * LocalStorage.clear();
   *
   * // Common use cases
   * // - User logout
   * // - App reset
   * // - Privacy cleanup
   * // - Development/testing
   * ```
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch {}
  }
}
