import TopAppBar from '@/components/TopAppBar';
import BottomNavBar from '@/components/BottomNavBar';
import type { NavItem } from '@/components/TopAppBar';
import { MdHome, MdViewInAr, MdLocalBar, MdPerson } from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben', active: true },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda' },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

export default async function PubCrawlPage() {
  const isLoggedIn = !!(await UserService.getUser());
  if (!isLoggedIn) {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <TopAppBar />

      <main
        className="w-full mx-auto px-md pb-32 pt-[88px]"
        style={{ maxWidth: 'var(--container-content)' }}
      >
        <div className="py-gutter flex flex-col gap-md">
          {/* Page header card */}
          <section
            className="rounded-lg p-lg ambient-shadow border border-outline-variant/20"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <h1
              className="text-headline-xl"
              style={{
                fontFamily: 'var(--font-headline)',
                color: 'var(--color-on-surface)'
              }}
            >
              Hubben 2.2
            </h1>
            <p
              className="mt-2 text-body-lg"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-on-surface-variant)'
              }}
            >
              IT-sektionens kära lokal!
            </p>
          </section>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
