import { FileText, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/types";

type PostsListProps = {
  posts: Post[];
  title: string;
  description: string;
  variant: "published" | "draft";
};

export function PostsList({ posts, title, description, variant }: PostsListProps) {
  const badgeVariant = variant === "published" ? "success" : "warning";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={badgeVariant}>{posts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-start justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.content}
                  </p>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
