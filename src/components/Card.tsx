import type { ComponentPropsWithoutRef, ElementType } from 'react';

type CardVariant =
  | 'surface'
  | 'gradient'
  | 'tertiary'
  | 'highlight'
  | 'surface-variant';
type CardSize = 'sm' | 'md' | 'lg' | 'chip';

type CardProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'variant' | 'size' | 'className'>;

const variantClasses: Record<CardVariant, string> = {
  surface: 'bg-surface-container-lowest border border-outline-variant/20',
  highlight: 'bg-primary-container/10 border-2 border-primary-container', // bg-[rgba(9,205,218,0.05)]
  gradient:
    'bg-primary-container border-transparent text-on-primary-container overflow-hidden',
  tertiary:
    'bg-tertiary-container border border-outline-variant/20 text-on-tertiary-container',
  'surface-variant':
    'bg-surface-variant/50 border border-outline-variant/20 text-on-surface-variant'
};

const sizeClasses: Record<CardSize, string> = {
  sm: 'rounded-2xl p-sm',
  md: 'rounded-xl p-md',
  lg: 'rounded-lg p-lg',
  chip: 'rounded-full px-4 py-2'
};

/**
 * Base card surface component.
 *
 * All named card components (EventCard, MemberCard, StatCard, ToolCard) and
 * page-level section cards build on this to ensure a consistent surface
 * pattern (background, border, shadow, padding, radius).
 *
 * @param as       — rendered element or component (default: 'div')
 * @param variant  — 'surface' (default) | 'gradient' | 'tertiary'
 * @param size     — 'sm' (p-sm, rounded-2xl) | 'md' (p-md, rounded-xl) | 'lg' (p-lg, rounded-lg) | 'chip' (rounded-full)
 * @param className — additional Tailwind classes
 */
export default function Card<T extends ElementType = 'div'>({
  as,
  variant = 'surface',
  size = 'md',
  className = '',
  ...props
}: CardProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    sizeClasses[size],
    variantClasses[variant],
    'ambient-shadow',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes} {...props} />;
}
