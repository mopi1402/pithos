/**
 * TypeScript types for the dashboard
 */

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

export type Post = {
  id: string;
  title: string;
  content: string;
  publishedAt?: string;
  status: string;
};

export type Stats = {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
};

export type RawDashboardData = {
  user: User;
  posts: Post[];
  stats: Stats;
};

export type FormattedUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
};

export type FormattedPosts = {
  published: Post[];
  draft: Post[];
  total: number;
};

export type DashboardData = {
  user: FormattedUser;
  posts: FormattedPosts;
  stats: Stats;
};
