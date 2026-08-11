'use client';

import { MdWarning } from 'react-icons/md';
import Dialog from '@/components/ui/Dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog for deleting a pub-crawl event.
 * Built on the generic Dialog overlay.
 */
export default function DeleteConfirmDialog({
  open,
  eventTitle,
  onConfirm,
  onCancel
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-sm text-center">
        <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
          <MdWarning size={24} />
        </div>
        <h2 className="text-headline-md text-on-surface">Ta bort event?</h2>
        <p className="text-body-md text-on-surface-variant">
          <span className="font-semibold text-on-surface">{eventTitle}</span>{' '}
          kommer att tas bort permanent. Detta kan inte ångras.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-sm justify-end">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full text-label-md text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors"
        >
          Avbryt
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-full text-label-md bg-error text-on-error hover:opacity-90 transition-opacity"
        >
          Ta bort
        </button>
      </div>
    </Dialog>
  );
}
