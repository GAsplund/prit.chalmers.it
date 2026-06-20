import Link from 'next/link';
import { MdSchedule, MdEdit } from 'react-icons/md';
import Card from './Card';

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
    <Card
      as={Link}
      href={`/pub-crawl/${id}`}
      className="flex items-center gap-md ambient-shadow-hover border border-outline-variant/20 group cursor-pointer"
    >
      {/* Date badge — square with rounded corners, not circular */}
      <div
        className={[
          'w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
          upcoming
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-highest text-on-surface-variant'
        ].join(' ')}
      >
        <span className="font-black leading-none text-headline-md">{day}</span>
        <span className="uppercase text-label-sm">{month}</span>
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h3 className="mb-1 truncate text-headline-lg-mobile text-on-surface">
          {title}
        </h3>
        <p className="flex items-center gap-1 text-body-md text-on-surface-variant">
          <MdSchedule size={16} />
          {time}
        </p>
      </div>

      {/* Edit button — visible on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1 flex-shrink-0">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-primary bg-surface-container"
          aria-label={`Redigera ${title}`}
        >
          <MdEdit size={18} />
        </button>
      </div>
    </Card>
  );
}
