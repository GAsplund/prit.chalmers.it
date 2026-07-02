'use client';

import Link from 'next/link';
import { MdEdit, MdDelete } from 'react-icons/md';

interface EventCardActionsProps {
  id: string;
  title: string;
  onDelete: (id: string, title: string) => void;
}

/**
 * Client component for the edit + delete action buttons on EventCard.
 * The edit link and delete button sit on top of the card's full-cover <Link>
 * (pointer-events-auto in the parent), so no stopPropagation is needed.
 */
export default function EventCardActions({ id, title, onDelete }: EventCardActionsProps) {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1 flex-shrink-0 flex items-center gap-1">
      <Link
        href={`/pub-crawl/${id}/edit`}
        aria-label={`Redigera ${title}`}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-primary bg-surface-container hover:bg-surface-container-high"
      >
        <MdEdit size={18} />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(id, title)}
        aria-label={`Ta bort ${title}`}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-error bg-surface-container hover:bg-error-container"
      >
        <MdDelete size={18} />
      </button>
    </div>
  );
}
