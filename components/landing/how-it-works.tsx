interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Add your ETF purchases',
    description:
      'Enter your ETF ticker symbol, purchase date, quantity, and price. Track each purchase individually for accurate cost basis calculations.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Track performance in real-time',
    description:
      'Watch your investments grow with live price updates. See gains, losses, YTD returns, and portfolio allocation at a glance.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Export or manage your portfolio',
    description:
      'Download your data as JSON for backup or analysis. Edit purchases, add new ones, or remove positions anytime.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20 dark:bg-gray-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Get started in minutes with three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16">
          <div className="relative">
            {/* Connection line (hidden on mobile) */}
            <div
              className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-600 via-blue-400 to-emerald-600 lg:block"
              aria-hidden="true"
            />

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center gap-6 lg:flex-row lg:gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 text-center lg:text-left ${
                      index % 2 === 1 ? 'lg:text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-3 ${
                        index % 2 === 1
                          ? 'lg:flex-row-reverse'
                          : ''
                      }`}
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>

                  {/* Center icon */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 text-white shadow-lg">
                    {step.icon}
                    {/* Pulse animation ring */}
                    <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-blue-400/30" />
                  </div>

                  {/* Empty space for alignment */}
                  <div className="hidden flex-1 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
