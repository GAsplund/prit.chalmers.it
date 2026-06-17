import Link from 'next/link';
import type { NavItem } from './TopAppBar';

interface BottomNavBarProps {
  items: NavItem[];
}

export default function BottomNavBar({ items }: BottomNavBarProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 w-full z-50 rounded-t shadow-[0px_-10px_30px_rgba(9,205,218,0.08)] backdrop-blur-xl"
      style={{
        backgroundColor:
          'color-mix(in srgb, var(--color-surface) 80%, transparent)'
      }}
    >
      <div className="flex justify-around items-center px-4 pb-4 pt-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex flex-col items-center justify-center rounded-full px-4 py-1.5 transition-all gap-0.5',
              item.active
                ? 'text-on-primary-container'
                : 'text-on-surface-variant'
            ].join(' ')}
            style={
              item.active
                ? {
                    background:
                      'color-mix(in srgb, var(--color-primary-container) 20%, transparent)'
                  }
                : undefined
            }
          >
            <item.Icon size={22} />
            <span className="text-label-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
