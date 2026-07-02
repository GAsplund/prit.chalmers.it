import BottomNavBar from '@/components/BottomNavBar';
import PubCrawlForm from '@/components/ui/PubCrawlForm';
import type { NavItem } from '@/components/TopAppBar';
import { MdHome, MdPerson, MdLocalBar, MdViewInAr } from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda', active: true },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

export default async function NewPubCrawlPage() {
  const user = await UserService.getUser();
  if (!user) return <UnauthorizedPage />;

  const isPRIT = await UserService.getIsPRIT();
  if (!isPRIT) return <ForbiddenPage />;

  return (
    <>
      <main className="w-full mx-auto px-md pb-32 pt-[88px] content-container">
        <div className="py-gutter">
          <PubCrawlForm />
        </div>
      </main>
      <BottomNavBar items={navItems} />
    </>
  );
}
