import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "../../components/card";
import { Skeleton } from "../../components/skeleton";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: number;
  icon: LucideIcon;
  isLoading?: boolean;
}

export function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  isLoading = false,
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            {title}
          </span>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <span className="text-3xl font-bold">{value.toLocaleString()}</span>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-32 mt-1" />
          ) : (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
