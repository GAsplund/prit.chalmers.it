import Link from 'next/link';
import { MdSchedule, MdEdit } from 'react-icons/md';

export interface EventCardProps {
  day: number;
  month: string;
  title: string;
  time: string;
  upcoming?: boolean;
  onEdit?: () => void;
  id: string;
}

export default function EventCard({
  day,
  month,
  title,
  time,
  upcoming = false,
  id
}: EventCardProps) {
  return (
    <Link
      href={`/pub-crawl/${id}`}
      className="rounded-xl p-sm flex items-center gap-md ambient-shadow-hover border border-outline-variant/20 group cursor-pointer"
      style={{ background: 'var(--color-surface-container-low)' }}
    >
      {/* Date badge — square with rounded corners, not circular */}
      <div
        className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
        style={{
          background: upcoming
            ? 'var(--color-primary-container)'
            : 'var(--color-surface-container-highest)',
          color: upcoming
            ? 'var(--color-on-primary-container)'
            : 'var(--color-on-surface-variant)'
        }}
      >
        <span
          className="font-black leading-none"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'var(--text-headline-md)',
            fontWeight: 'var(--text-headline-md--font-weight)'
          }}
        >
          {day}
        </span>
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label-sm)',
            fontWeight: 'var(--text-label-sm--font-weight)',
            lineHeight: 'var(--text-label-sm--line-height)'
          }}
        >
          {month}
        </span>
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h3
          className="mb-1 truncate"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'var(--text-headline-lg-mobile)',
            fontWeight: 'var(--text-headline-lg-mobile--font-weight)',
            lineHeight: 'var(--text-headline-lg-mobile--line-height)',
            color: 'var(--color-on-surface)'
          }}
        >
          {title}
        </h3>
        <p
          className="flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--text-body-md--line-height)',
            color: 'var(--color-on-surface-variant)'
          }}
        >
          <MdSchedule size={16} />
          {time}
        </p>
      </div>

      {/* Edit button — visible on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1 flex-shrink-0">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            color: 'var(--color-primary)',
            background: 'var(--color-surface-container)'
          }}
          aria-label={`Redigera ${title}`}
        >
          <MdEdit size={18} />
        </button>
      </div>
    </Link>
  );
}
