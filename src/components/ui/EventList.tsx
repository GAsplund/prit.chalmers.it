'use client';

import { useState } from 'react';
import EventCard from '@/components/EventCard';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';
import type { PubCrawlEvent } from '@/types/pub-crawl';

interface EventListProps {
  events: PubCrawlEvent[];
}

/** Formats a "YYYY-MM-DD" date to a short Swedish month abbreviation. */
function formatMonth(date: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const m = parseInt(date.split('-')[1], 10) - 1;
  return months[m] ?? '';
}

/**
 * Client component that renders the event grid and owns the delete dialog state.
 * Lets EventCard remain a server component while still supporting delete.
 */
export default function EventList({ events }: EventListProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  function handleDeleteRequest(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  function handleDeleteConfirm() {
    // TODO: call server action to delete event with deleteTarget.id
    console.log('delete', deleteTarget?.id);
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {events.map((event) => {
          const day = parseInt(event.date.split('-')[2], 10);
          const month = formatMonth(event.date);
          return (
            <EventCard
              key={event.id}
              id={event.id}
              day={day}
              month={month}
              title={event.title}
              upcoming={event.upcoming}
              onDelete={handleDeleteRequest}
            />
          );
        })}
      </div>

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        eventTitle={deleteTarget?.title ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
