'use client';

import Link from 'next/link';

export interface FooterProps {
  className?: string;
}

const footerLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/whoisarjen/investo',
    external: true,
  },
  {
    label: 'MIT License',
    href: 'https://opensource.org/licenses/MIT',
    external: true,
  },
];

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950
        ${className}
      `}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Investo. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
