import BottomNavBar from '@/components/BottomNavBar';
import PubCrawlForm from '@/components/ui/PubCrawlForm';
import type { NavItem } from '@/components/TopAppBar';
import { MdHome, MdPerson, MdLocalBar, MdViewInAr } from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';
import PubCrawlService, { toPubCrawlEvent } from '@/services/pubCrawlService';
import { notFound } from 'next/navigation';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda', active: true },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

interface EditPubCrawlPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPubCrawlPage({
  params
}: EditPubCrawlPageProps) {
  const user = await UserService.getUser();
  if (!user) return <UnauthorizedPage />;

  const isPRIT = await UserService.getIsPRIT();
  if (!isPRIT) return <ForbiddenPage />;

  const { id } = await params;
  const dbEvent = await PubCrawlService.getPubCrawlById(id);
  if (!dbEvent) notFound();

  const event = toPubCrawlEvent(dbEvent);

  return (
    <>
      <main className="w-full mx-auto px-sm sm:px-md pb-32 pt-[88px] content-container">
        <div className="py-gutter">
          <PubCrawlForm initialData={event} />
        </div>
      </main>
      <BottomNavBar items={navItems} />
    </>
  );
}
