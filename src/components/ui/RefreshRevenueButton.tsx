'use client';

import { useTransition } from 'react';
import { updateRevenueFromZettle } from '@/app/actions/pubCrawls';
import { MdRefresh } from 'react-icons/md';

export default function RefreshRevenueButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => {
          void updateRevenueFromZettle(eventId);
        })
      }
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-label-sm bg-secondary-container text-on-secondary-container hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      <MdRefresh size={16} className={isPending ? 'animate-spin' : ''} />
    </button>
  );
}
