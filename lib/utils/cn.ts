/**
 * Tailwind class merge utility
 * Concatenates class names smartly, filtering out falsy values
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Combines multiple class values into a single class string
 * Handles conditional classes, arrays, and filters out falsy values
 *
 * @example
 * cn('base', condition && 'conditional', 'always')
 * cn(['array', 'of', 'classes'], 'more')
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) {
        classes.push(nested);
      }
    }
  }

  // Remove duplicates and extra whitespace
  const uniqueClasses = [...new Set(
    classes
      .join(' ')
      .split(/\s+/)
      .filter(Boolean)
  )];

  return uniqueClasses.join(' ');
}
