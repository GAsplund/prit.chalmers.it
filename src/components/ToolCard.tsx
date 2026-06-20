import Link from 'next/link';
import type { IconType } from 'react-icons';
import { MdArrowForward, MdLock } from 'react-icons/md';
import Card from './Card';

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
    <Card
      variant={featured ? 'gradient' : 'surface'}
      className="group relative flex flex-col justify-between gap-md h-full"
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
          className={[
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            featured
              ? 'bg-icon-featured text-on-primary-container'
              : 'bg-surface-container text-primary'
          ].join(' ')}
        >
          <Icon size={20} />
        </div>

        {locked && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm bg-surface-container text-on-surface-variant">
            <MdLock size={13} />
            Inloggning
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3
          className={[
            'mb-1 text-headline-md',
            featured ? 'text-on-primary-container' : 'text-on-surface'
          ].join(' ')}
        >
          {title}
        </h3>
        <p
          className={[
            'text-body-md font-body',
            featured
              ? 'text-on-primary-container opacity-80'
              : 'text-on-surface-variant'
          ].join(' ')}
        >
          {description}
        </p>
      </div>

      {/* Arrow — appears on hover */}
      {!locked && (
        <div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-hidden
        >
          <MdArrowForward
            size={22}
            className={featured ? 'text-on-primary-container' : 'text-primary'}
          />
        </div>
      )}
    </Card>
  );

  return locked ? (
    inner
  ) : (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
