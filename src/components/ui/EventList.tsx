'use client';

import { useState } from 'react';
import EventCard from '@/components/EventCard';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';
import PubCrawlService from '@/services/pubCrawlService';

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

  function handleDeleteConfirm() {
    // TODO: call server action to delete event with deleteTarget.id
    console.log('delete', deleteTarget?.id);
    setDeleteTarget(null);
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
