import Link from 'next/link';
import { Button } from '@/components/ui';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 dark:bg-gray-900 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/5 ring-1 ring-blue-50 dark:bg-gray-950 dark:ring-gray-800 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ready to take control of your ETF portfolio?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Start tracking your investments today. It&apos;s completely free, requires
            no signup, and your data never leaves your browser.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg">Start Tracking Now</Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>100% Private</span>
            <span>No Credit Card</span>
            <span>MIT Licensed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
