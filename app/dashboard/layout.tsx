'use client';

import { PortfolioProvider, UIProvider } from '@/contexts';

/**
 * Dashboard Layout
 * Wraps the dashboard pages with necessary providers
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortfolioProvider>
      <UIProvider>{children}</UIProvider>
    </PortfolioProvider>
  );
}
