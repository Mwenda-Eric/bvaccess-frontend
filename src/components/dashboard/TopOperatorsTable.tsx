'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { Trophy, Medal, Award } from 'lucide-react';
import { TopOperator } from '@/types';

interface TopOperatorsTableProps {
  data?: TopOperator[];
  loading?: boolean;
}

const RankIcon = ({ rank }: { rank: number }) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="flex h-5 w-5 items-center justify-center text-sm font-medium text-muted-foreground">
          {rank}
        </span>
      );
  }
};

export function TopOperatorsTable({ data, loading = false }: TopOperatorsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safely handle data - backend uses totalRevenue, totalSales, fullName
  const operators = data || [];
  const maxRevenue = operators[0]?.totalRevenue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Operators This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {operators.map((operator, index) => (
            <div key={operator.id} className="flex items-center gap-4">
              <RankIcon rank={index + 1} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{operator.fullName}</p>
                  <p className="text-sm font-medium">{formatCurrency(operator.totalRevenue)}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress
                    value={(operator.totalRevenue / maxRevenue) * 100}
                    className="h-2"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {operator.totalSales} sales
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Avg: {formatCurrency(operator.averageTicket)}
                </p>
              </div>
            </div>
          ))}
          {operators.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
