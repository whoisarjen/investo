# Investo

An open source ETF investment tracking web application. Track your portfolio with comprehensive metrics, all stored locally in your browser.

**Live Demo:** [investo.whoisarjen.com](https://investo.whoisarjen.com)

## Features

- **No Account Required** - All data is stored in your browser's localStorage. Your financial data never leaves your device.
- **Real-Time Prices** - Track current ETF values with live price updates during market hours.
- **Comprehensive Metrics** - View total invested, current value, gain/loss, YTD performance, and portfolio allocation.
- **Multiple Purchases** - Track every purchase of the same ETF separately. Perfect for dollar-cost averaging strategies.
- **Export Your Data** - Download your complete portfolio as JSON for backup or migration.
- **Dark Mode** - Full dark mode support for comfortable viewing.
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile devices.

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/whoisarjen/investo.git
cd investo
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI**: Custom component library built with React 19
- **State**: React Context with localStorage persistence

## Project Structure

```
investo/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── landing/          # Landing page sections
│   ├── portfolio/        # Portfolio components
│   ├── forms/            # Form components
│   └── metrics/          # Metrics display components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Business logic
│   ├── storage/          # localStorage services
│   ├── api/              # API utilities
│   ├── calculations/     # Metrics calculations
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
└── data/                  # Static data (ETF lists, mock prices)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Price data provided by financial APIs
- Built with Next.js by Vercel
- Icons and design inspiration from the open source community
