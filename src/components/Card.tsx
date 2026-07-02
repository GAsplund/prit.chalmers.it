import type { ComponentPropsWithoutRef, ElementType } from 'react';

type CardVariant = 'surface' | 'gradient' | 'tertiary';
type CardSize = 'md' | 'lg';

type CardProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'variant' | 'size' | 'className'>;

const variantClasses: Record<CardVariant, string> = {
  surface: 'bg-surface-container-lowest border border-outline-variant/20',
  gradient:
    'bg-primary-container border-transparent text-on-primary-container overflow-hidden',
  tertiary:
    'bg-tertiary-container border border-outline-variant/20 text-on-tertiary-container'
};

const sizeClasses: Record<CardSize, string> = {
  md: 'rounded-xl p-md',
  lg: 'rounded-lg p-lg'
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
 * @param size     — 'md' (p-md, rounded-xl) | 'lg' (p-lg, rounded-lg)
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
