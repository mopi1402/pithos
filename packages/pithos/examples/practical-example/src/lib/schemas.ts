/**
 * Kanon schemas for validating API responses
 * Using Pithos/Kanon v3 for schema validation
 */
import {
  object,
  string,
  number,
  boolean,
  array,
  optional,
} from "pithos/kanon/v3/index";

// Define the expected API response structure
export const UserSchema = object({
  id: string(),
  firstName: string(),
  lastName: string(),
  email: string().email(),
  role: string(),
  createdAt: string(),
  preferences: optional(
    object({
      theme: optional(string()),
      language: optional(string()),
      notifications: optional(boolean()),
    })
  ),
});

export const PostSchema = object({
  id: string(),
  title: string(),
  content: string(),
  publishedAt: optional(string()),
  status: string(),
});

export const DashboardSchema = object({
  user: UserSchema,
  posts: array(PostSchema),
  stats: object({
    totalViews: number(),
    totalLikes: number(),
    totalComments: number(),
  }),
});
