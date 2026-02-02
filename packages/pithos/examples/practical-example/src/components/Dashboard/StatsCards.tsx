import { Eye, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stats } from "@/lib/types";

type StatsCardsProps = {
  stats: Stats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Total Comments",
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
