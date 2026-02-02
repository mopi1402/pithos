/**
 * Mock data for demonstration
 * In a real app, this would come from an API
 */
import type { RawDashboardData } from "./types";

export const mockDashboardData: RawDashboardData = {
  user: {
    id: "user-123",
    firstName: "john",
    lastName: "doe",
    email: "john.doe@pithos.dev",
    role: "admin",
    createdAt: "2024-01-15T10:30:00Z",
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true,
    },
  },
  posts: [
    {
      id: "post-1",
      title: "Getting Started with Pithos",
      content: "Learn how to use Pithos for type-safe development...",
      publishedAt: "2024-03-10T14:00:00Z",
      status: "published",
    },
    {
      id: "post-2",
      title: "Advanced Validation Patterns",
      content: "Deep dive into Kanon schema validation...",
      publishedAt: "2024-03-12T09:00:00Z",
      status: "published",
    },
    {
      id: "post-3",
      title: "Error Handling Best Practices",
      content: "Using Zygos ResultAsync for elegant error handling...",
      status: "draft",
    },
    {
      id: "post-4",
      title: "Data Transformation with Arkhe",
      content: "Utility functions that make your code cleaner...",
      publishedAt: "2024-03-15T11:30:00Z",
      status: "published",
    },
    {
      id: "post-5",
      title: "Building Type-Safe APIs",
      content: "End-to-end type safety from API to UI...",
      status: "draft",
    },
  ],
  stats: {
    totalViews: 12847,
    totalLikes: 892,
    totalComments: 156,
  },
};
