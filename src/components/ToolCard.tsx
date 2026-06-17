import Link from 'next/link';
import type { IconType } from 'react-icons';
import { MdArrowForward, MdLock } from 'react-icons/md';

export interface ToolCardProps {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  /** Shows a lock badge — use for auth-gated tools */
  locked?: boolean;
  /** Renders as a prominent gradient card */
  featured?: boolean;
}

export default function ToolCard({
  href,
  Icon,
  title,
  description,
  locked = false,
  featured = false
}: ToolCardProps) {
  const inner = (
    <div
      className={[
        'group relative flex flex-col justify-between gap-md p-md rounded-xl border ambient-shadow-hover h-full',
        featured ? 'overflow-hidden' : 'border-outline-variant/20'
      ].join(' ')}
      style={
        featured
          ? {
              background:
                'linear-gradient(135deg, var(--color-primary-container), var(--color-secondary-fixed))',
              borderColor: 'transparent',
              color: 'var(--color-on-primary-container)'
            }
          : {
              background: 'var(--color-surface-container-low)'
            }
      }
    >
      {/* Decorative large background icon for featured */}
      {featured && (
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none select-none">
          <Icon size={120} />
        </div>
      )}

      {/* Top row: icon bubble + optional lock badge */}
      <div className="flex items-start justify-between relative z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: featured
              ? 'color-mix(in srgb, var(--color-on-primary-container) 12%, transparent)'
              : 'var(--color-surface-container)',
            color: featured
              ? 'var(--color-on-primary-container)'
              : 'var(--color-primary)'
          }}
        >
          <Icon size={20} />
        </div>

        {locked && (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm"
            style={{
              background: 'var(--color-surface-container)',
              color: 'var(--color-on-surface-variant)'
            }}
          >
            <MdLock size={13} />
            Inloggning
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3
          className="mb-1 text-headline-md"
          style={{
            fontFamily: 'var(--font-headline)',
            color: featured
              ? 'var(--color-on-primary-container)'
              : 'var(--color-on-surface)'
          }}
        >
          {title}
        </h3>
        <p
          className="text-body-md"
          style={{
            fontFamily: 'var(--font-body)',
            color: featured
              ? 'color-mix(in srgb, var(--color-on-primary-container) 80%, transparent)'
              : 'var(--color-on-surface-variant)'
          }}
        >
          {description}
        </p>
      </div>

      {/* Arrow — appears on hover */}
      <div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-hidden
      >
        <MdArrowForward
          size={22}
          style={{
            color: featured
              ? 'var(--color-on-primary-container)'
              : 'var(--color-primary)'
          }}
        />
      </div>
    </div>
  );

  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
