import Link from 'next/link';
import type { IconType } from 'react-icons';
import ThemeToggle from './ThemeToggle';
import UserButton from './UserButton';
import UserService from '@/services/userService';

export interface NavItem {
  href: string;
  Icon: IconType;
  label: string;
  active?: boolean;
}

export default async function TopAppBar() {
  const user = await UserService.getUser();

  return (
    <nav
      className="fixed top-0 w-full z-50 shadow-sm backdrop-blur-xl"
      style={{
        backgroundColor:
          'color-mix(in srgb, var(--color-surface) 80%, transparent)'
      }}
    >
      <div className="flex items-center justify-between px-md py-sm w-full max-w-content mx-auto">
        {/* Logo — Zyzol only for the wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <span
            className="text-[28px] font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-zyzol, var(--font-headline))',
              color: 'var(--color-primary)'
            }}
          >
            P.R.I.T.
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1 items-center">
          {/*items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-full transition-opacity hover:opacity-80 text-label-md",
                item.active ? "font-bold" : "text-on-surface-variant",
              ].join(" ")}
              style={item.active ? {
                color: "var(--color-primary)",
                background: "color-mix(in srgb, var(--color-primary-container) 20%, transparent)",
              } : undefined}
            >
              <item.Icon size={20} />
              {item.label}
            </Link>
          ))*/}
        </div>

        {/* Right-side controls — visible on all breakpoints */}
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          <UserButton user={user} />
        </div>
      </div>
    </nav>
  );
}
