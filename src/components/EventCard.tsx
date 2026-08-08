import Link from 'next/link';
import { MdSchedule } from 'react-icons/md';
import EventCardActions from './ui/EventCardActions';

export interface EventCardProps {
  id: string;
  day: number;
  month: string;
  title: string;
  /** @deprecated time is no longer stored at the event level; pass undefined or omit */
  time?: string;
  upcoming?: boolean;
  onDelete?: (id: string, title: string) => void;
}

export default function EventCard({
  id,
  day,
  month,
  title,
  time,
  upcoming = false,
  onDelete
}: EventCardProps) {
  return (
    /*
     * Outer wrapper is a plain div (not a Link) to avoid nested <a> when
     * EventCardActions renders its own <Link>. The detail-page link is an
     * absolutely-positioned overlay that sits behind the action buttons.
     */
    <div className="relative rounded-xl bg-surface-container-lowest border border-outline-variant/20 ambient-shadow group">
      {/* Full-card navigation link — sits behind action buttons (z-0) */}
      <Link
        href={`/pub-crawl/${id}`}
        className="absolute inset-0 rounded-xl z-0"
        aria-label={`Öppna ${title}`}
      />

      {/* Card content — pointer-events-none so clicks pass through to the Link,
          except for the action buttons which restore pointer events via z-10 */}
      <div className="relative flex items-center gap-md p-md pointer-events-none">
        {/* Date badge */}
        <div
          className={[
            'w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
            upcoming
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-highest text-on-surface-variant'
          ].join(' ')}
        >
          <span className="font-black leading-none text-headline-md">
            {day}
          </span>
          <span className="uppercase text-label-sm">{month}</span>
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0">
          <h3 className="mb-1 truncate text-headline-lg-mobile text-on-surface">
            {title}
          </h3>
          {time && (
            <p className="flex items-center gap-1 text-body-md text-on-surface-variant">
              <MdSchedule size={16} />
              {time}
            </p>
          )}
        </div>

        {/* Action buttons restore pointer events so they're clickable */}
        {onDelete && (
          <div className="pointer-events-auto">
            <EventCardActions id={id} title={title} onDelete={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
