'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS } from '@/lib/constants';

type Status = 'active' | 'void' | 'expired' | 'pending';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const statusLabels: Record<Status, string> = {
  active: 'Active',
  void: 'Voided',
  expired: 'Expired',
  pending: 'Pending',
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'px-1.5 py-0 text-xs' : 'px-2 py-0.5 text-xs',
        className
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}

interface ActiveStatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ActiveStatusBadge({ isActive, size = 'md', className }: ActiveStatusBadgeProps) {
  const status = isActive ? 'active' : 'void';
  const colors = STATUS_COLORS[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'px-1.5 py-0 text-xs' : 'px-2 py-0.5 text-xs',
        className
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
