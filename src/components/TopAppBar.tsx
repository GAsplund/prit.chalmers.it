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
    <nav className="fixed top-0 w-full z-50 shadow-sm backdrop-blur-xl bg-nav-glass">
      <div className="flex items-center justify-between px-md py-sm w-full max-w-content mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-[28px] font-bold tracking-tight font-zyzol text-primary">
            P.R.I.T.
          </span>
        </Link>

        {/* Right-side controls — visible on all breakpoints */}
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          <UserButton user={user} />
        </div>
      </div>
    </nav>
  );
}
