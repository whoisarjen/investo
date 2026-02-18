import { Container } from '@/components/layout';
import { Skeleton } from '@/components/ui';

/**
 * Loading skeleton for the Dashboard page
 * Displayed while the page is being loaded
 */
export default function DashboardLoading() {
  return (
    <Container as="main" className="py-6 sm:py-8">
      {/* Page header skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton variant="text" width="200px" height={32} />
          <Skeleton variant="text" width="320px" height={20} />
        </div>
        <Skeleton variant="rectangular" width={160} height={40} className="rounded-lg" />
      </div>

      {/* Summary cards skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="40%" height={16} />
              </div>
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Holdings section skeleton */}
      <div className="space-y-4">
        <Skeleton variant="text" width="100px" height={24} />

        {/* Table skeleton */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {/* Table header */}
          <div className="flex gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton variant="text" width="60px" height={12} />
            <Skeleton variant="text" width="50px" height={12} />
            <Skeleton variant="text" width="60px" height={12} />
            <Skeleton variant="text" width="80px" height={12} />
            <Skeleton variant="text" width="80px" height={12} />
            <Skeleton variant="text" width="70px" height={12} />
            <Skeleton variant="text" width="70px" height={12} />
            <Skeleton variant="text" width="50px" height={12} />
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-gray-200 px-6 py-4 last:border-b-0 dark:border-gray-700"
            >
              <div className="flex min-w-[120px] flex-col gap-1">
                <Skeleton variant="text" width="60px" height={18} />
                <Skeleton variant="text" width="100px" height={14} />
              </div>
              <Skeleton variant="text" width="60px" height={16} className="text-right" />
              <Skeleton variant="text" width="70px" height={16} className="text-right" />
              <Skeleton variant="text" width="70px" height={16} className="text-right" />
              <Skeleton variant="text" width="80px" height={16} className="text-right" />
              <Skeleton variant="text" width="70px" height={16} className="text-right" />
              <Skeleton variant="rectangular" width="60px" height={24} className="rounded-full" />
              <Skeleton variant="text" width="50px" height={16} className="text-right" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
