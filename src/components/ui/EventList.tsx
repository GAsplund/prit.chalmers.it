'use client';

import { useState } from 'react';
import EventCard from '@/components/EventCard';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';
import PubCrawlService from '@/services/pubCrawlService';
import { deletePubCrawl } from '@/app/actions/pubCrawls';

interface EventListProps {
  events: Awaited<ReturnType<typeof PubCrawlService.getUpcomingPubCrawls>>;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Maj',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dec'
];

/**
 * Client component that renders the event grid and owns the delete dialog state.
 * Lets EventCard remain a server component while still supporting delete.
 */
export default function EventList({ events }: EventListProps) {
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  function handleDeleteRequest(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    await deletePubCrawl(deleteTarget!.id);
    setDeleteTarget(null);
  }

  if (events.length === 0) {
    return (
      <p className="text-on-surface-variant text-body-md">
        Inga pubrundor att visa.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {events.map((event) => {
          const day = event.startTime.getDate();
          const month = months[event.startTime.getMonth()] ?? '';
          return (
            <EventCard
              key={event.id}
              id={event.id}
              day={day}
              month={month}
              title={event.title}
              upcoming={/*event.upcoming*/ false}
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
