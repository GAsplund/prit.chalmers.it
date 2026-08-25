import BottomNavBar from '@/components/BottomNavBar';
import Card from '@/components/Card';
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
      <main className="w-full mx-auto px-sm sm:px-md pb-32 pt-nav-height max-w-content">
        <div className="py-gutter flex flex-col gap-md">
          {/* Page header card */}
          <Card as="section" size="lg">
            <h1 className="text-headline-xl text-on-surface">Hubben 2.2</h1>
            <p className="mt-2 text-body-lg font-body text-on-surface-variant">
              IT-sektionens kära lokal!
            </p>
          </Card>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
