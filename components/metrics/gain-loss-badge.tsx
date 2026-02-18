'use client';

import { Badge } from '@/components/ui';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

export interface GainLossBadgeProps {
  /** The gain/loss value (positive for gain, negative for loss) */
  value: number;
  /** Display as percentage instead of currency */
  isPercent?: boolean;
  /** Size of the badge */
  size?: 'sm' | 'md';
  /** Show plus sign for positive values */
  showSign?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Badge component that displays gain or loss with appropriate coloring
 * Green for positive (gains), red for negative (losses)
 *
 * @example
 * // Currency display
 * <GainLossBadge value={1234.56} />
 *
 * // Percentage display
 * <GainLossBadge value={0.0523} isPercent />
 *
 * // Small size
 * <GainLossBadge value={-500} size="sm" />
 */
export function GainLossBadge({
  value,
  isPercent = false,
  size = 'md',
  showSign = true,
  className,
}: GainLossBadgeProps) {
  const isPositive = value >= 0;
  const variant = isPositive ? 'success' : 'danger';

  let displayValue: string;

  if (isPercent) {
    // formatPercent expects a decimal (e.g., 0.05 for 5%)
    // If value is already a percentage (e.g., 5.23), divide by 100
    const percentValue = Math.abs(value) > 1 ? value / 100 : value;
    displayValue = formatPercent(percentValue);
  } else {
    const sign = showSign && isPositive ? '+' : '';
    displayValue = `${sign}${formatCurrency(value)}`;
  }

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn('font-medium', className)}
    >
      {displayValue}
    </Badge>
  );
}
