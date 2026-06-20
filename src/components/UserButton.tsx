'use client';

import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MdLogin, MdLogout } from 'react-icons/md';

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
}

export default function UserButton({ user }: { user?: User | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Logged out: pill button ──────────────────────────────────────────────
  if (!user) {
    return (
      <button
        onClick={async () => {
          // TODO: trigger real login flow
          //setUser({ name: "Demo User", initials: "DU" });
          await authClient.signIn.oauth2({
            providerId: 'gamma'
          });
        }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-label-md transition-all ambient-shadow-hover"
        style={{
          background: 'var(--color-surface-container)',
          color: 'var(--color-on-surface-variant)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600
        }}
      >
        <MdLogin size={16} />
        Logga in
      </button>
    );
  }

  // ── Logged in: avatar button + dropdown ─────────────────────────────────
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Användarmeny"
        aria-expanded={open}
        className="w-9 h-9 rounded-full flex items-center justify-center text-label-sm font-bold transition-all ambient-shadow-hover"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-container), var(--color-secondary-fixed-dim))',
          color: 'var(--color-on-primary-container)',
          fontFamily: 'var(--font-body)'
        }}
      >
        <img
          src={
            user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=128`
          }
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-outline-variant/20 py-1 z-50 ambient-shadow"
          style={{ background: 'var(--color-surface-container-lowest)' }}
        >
          <button
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-label-md transition-colors hover:opacity-80"
            style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-body)'
            }}
          >
            <MdLogout size={16} />
            Logga ut
          </button>
        </div>
      )}
    </div>
  );
}
