'use client';

import { useEffect, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Dialog content */
  children: ReactNode;
  /** Width constraint, defaults to max-w-[24rem] */
  maxWidth?: string;
}

/**
 * Generic centered modal dialog.
 * Renders as a fixed overlay with a blurred backdrop; must be a client
 * component for open/close state. Clicking the backdrop calls onClose.
 *
 * Note: uses an arbitrary max-w-[…] value because the project's custom
 * spacing tokens (--spacing-sm/md) override Tailwind's max-w-sm/md utilities.
 */
export default function Dialog({
  open,
  onClose,
  children,
  maxWidth = 'max-w-[24rem]'
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const previousOverflow = [html.style.overflow, body.style.overflow];
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previousOverflow[0];
      body.style.overflow = previousOverflow[1];
    };
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-md"
      onClick={onClose}
    >
      {/* Dialog card */}
      <div
        className={`w-full ${maxWidth} rounded-xl p-lg bg-surface-container-lowest ambient-shadow border border-outline-variant/20 flex flex-col gap-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
