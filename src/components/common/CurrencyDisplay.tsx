'use client';

import { cn } from '@/lib/utils';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSymbol?: boolean;
  compact?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg font-semibold',
  xl: 'text-2xl font-bold',
};

export function CurrencyDisplay({
  amount,
  size = 'md',
  showSymbol = true,
  compact = false,
  className,
}: CurrencyDisplayProps) {
  const formatted = compact
    ? formatCurrencyCompact(amount)
    : formatCurrency(amount, showSymbol);

  return (
    <span className={cn('tabular-nums', sizeClasses[size], className)}>
      {formatted}
    </span>
  );
}

interface CurrencyChangeProps {
  amount: number;
  percentage: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function CurrencyChange({
  amount,
  percentage,
  size = 'md',
  className,
}: CurrencyChangeProps) {
  const isPositive = percentage >= 0;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span
        className={cn(
          'tabular-nums',
          size === 'sm' ? 'text-xs' : 'text-sm',
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}
      >
        {isPositive ? '+' : ''}
        {formatCurrency(amount)}
      </span>
      <span
        className={cn(
          'tabular-nums',
          size === 'sm' ? 'text-xs' : 'text-sm',
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}
      >
        ({isPositive ? '+' : ''}
        {percentage.toFixed(1)}%)
      </span>
    </div>
  );
}
