'use client';

/**
 * ETF Search Component
 * Combobox/autocomplete for ETF symbol search with suggestions
 */

import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import { POPULAR_ETFS, type PopularETF } from '@/data/popular-etfs';
import { Input } from '@/components/ui';

interface ETFSearchProps {
  /** Current value of the input */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Error message to display */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * ETF Search with autocomplete suggestions
 * Shows suggestions from POPULAR_ETFS as user types
 * Allows custom symbols not in the list
 */
export function ETFSearch({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = 'Search ETF symbol...',
}: ETFSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter ETFs based on input value
  const filteredETFs = value.trim()
    ? POPULAR_ETFS.filter(
        (etf) =>
          etf.symbol.toLowerCase().includes(value.toLowerCase()) ||
          etf.name.toLowerCase().includes(value.toLowerCase())
      )
    : POPULAR_ETFS;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectETF = (etf: PopularETF) => {
    onChange(etf.symbol);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredETFs.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredETFs[highlightedIndex]) {
          handleSelectETF(filteredETFs[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        ref={inputRef}
        label="ETF Symbol"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="etf-suggestions"
        aria-activedescendant={
          highlightedIndex >= 0 ? `etf-option-${highlightedIndex}` : undefined
        }
      />

      {isOpen && filteredETFs.length > 0 && (
        <ul
          ref={listRef}
          id="etf-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {filteredETFs.map((etf, index) => (
            <li
              key={etf.symbol}
              id={`etf-option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSelectETF(etf)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                cursor-pointer px-4 py-2 transition-colors
                ${
                  highlightedIndex === index
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }
                ${value === etf.symbol ? 'font-medium' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {etf.symbol}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {etf.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {etf.name}
              </p>
            </li>
          ))}
        </ul>
      )}

      {isOpen && value.trim() && filteredETFs.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No matching ETFs found. You can still use &quot;{value}&quot; as a custom symbol.
          </p>
        </div>
      )}
    </div>
  );
}
