import { forwardRef, type HTMLAttributes } from 'react';

export type SkeletonVariant = 'rectangular' | 'circular' | 'text';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  rectangular: 'rounded-lg',
  circular: 'rounded-full',
  text: 'rounded',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'rectangular',
      width,
      height,
      lines = 1,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const computedStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={`space-y-2 ${className}`} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`
                animate-pulse bg-gray-200
                dark:bg-gray-700
                ${variantStyles.text}
                ${index === lines - 1 ? 'w-3/4' : 'w-full'}
              `}
              style={{
                height: typeof height === 'number' ? `${height}px` : height || '1em',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          animate-pulse bg-gray-200
          dark:bg-gray-700
          ${variantStyles[variant]}
          ${className}
        `}
        style={computedStyle}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  showAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ showAvatar = false, lines = 3, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl border border-gray-200 bg-white p-6
          dark:border-gray-800 dark:bg-gray-900
          ${className}
        `}
        {...props}
      >
        <div className="flex items-start gap-4">
          {showAvatar && (
            <Skeleton variant="circular" width={48} height={48} />
          )}
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" lines={lines} height={16} />
          </div>
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';
