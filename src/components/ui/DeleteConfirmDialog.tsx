'use client';

import { MdWarning } from 'react-icons/md';

interface DeleteConfirmDialogProps {
  open: boolean;
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Small centered confirmation dialog for deleting a pub-crawl event.
 * Renders as a fixed overlay; must be a client component for open/close state.
 */
export default function DeleteConfirmDialog({
  open,
  eventTitle,
  onConfirm,
  onCancel
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-md"
      onClick={onCancel}
    >
      {/* Dialog card */}
      <div
        className="w-full max-w-sm rounded-xl p-lg bg-surface-container-lowest ambient-shadow border border-outline-variant/20 flex flex-col gap-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-sm text-center">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
            <MdWarning size={24} />
          </div>
          <h2 className="text-headline-md text-on-surface">Ta bort event?</h2>
          <p className="text-body-md text-on-surface-variant">
            <span className="font-semibold text-on-surface">{eventTitle}</span> kommer att tas
            bort permanent. Detta kan inte ångras.
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
      </div>
    </div>
  );
}
