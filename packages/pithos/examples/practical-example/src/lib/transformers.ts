/**
 * Data transformers using Arkhe utilities
 */
import { groupBy } from "pithos/arkhe/array/group-by";
import { capitalize } from "pithos/arkhe/string/capitalize";
import type { User, Post, FormattedUser, FormattedPosts } from "./types";

/**
 * Transform user data for display
 */
export function formatUser(user: User): FormattedUser {
  const defaultPrefs = {
    theme: "light",
    language: "en",
    notifications: true,
  };

  return {
    id: user.id,
    fullName: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
    email: user.email,
    role: capitalize(user.role),
    preferences: {
      theme: user.preferences?.theme ?? defaultPrefs.theme,
      language: user.preferences?.language ?? defaultPrefs.language,
      notifications: user.preferences?.notifications ?? defaultPrefs.notifications,
    },
  };
}

/**
 * Transform posts for the dashboard, grouped by status
 */
export function formatPosts(posts: Post[]): FormattedPosts {
  const grouped = groupBy(posts, (post) => post.status);

  return {
    published: grouped["published"] ?? [],
    draft: grouped["draft"] ?? [],
    total: posts.length,
  };
}
