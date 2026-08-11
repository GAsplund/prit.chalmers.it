import BottomNavBar from '@/components/BottomNavBar';
import Card from '@/components/Card';
import EventList from '@/components/ui/EventList';
import type { NavItem } from '@/components/TopAppBar';
import {
  MdHome,
  MdAdd,
  MdPerson,
  MdLocalBar,
  MdViewInAr,
  MdArrowForward,
  MdArrowBack
} from 'react-icons/md';
import Link from 'next/link';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';
import { MOCK_EVENTS } from '@/types/pub-crawl';
import PubCrawlService from '@/services/pubCrawlService';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda', active: true },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

function formatEventDate(d: Date): string {
  const s = d.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function PubCrawlPage() {
  const user = await UserService.getUser();
  if (!user) return <UnauthorizedPage />;

  const isPRIT = await UserService.getIsPRIT();
  if (!isPRIT) return <ForbiddenPage />;

  const activeEvent = MOCK_EVENTS.find((e) => e.upcoming);
  const upcomingEvents = await PubCrawlService.getUpcomingPubCrawls();

  return (
    <>
      <main className="w-full mx-auto px-md pb-32 pt-[88px] content-container">
        {/* Ongoing event banner */}
        {activeEvent && (
          <Card
            as={Link}
            href={`/pub-crawl/${activeEvent.id}`}
            variant="gradient"
            size="md"
            className="block group mb-md"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Icon + text */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-on-primary-container/10 flex-shrink-0">
                  <MdLocalBar size={26} className="text-on-primary-container" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-on-primary-container animate-pulse flex-shrink-0" />
                    <span className="text-label-sm text-on-primary-container/70 tracking-wider">
                      Pågår nu
                    </span>
                  </div>
                  <h2 className="text-headline-md text-on-primary-container truncate">
                    {activeEvent.title}
                  </h2>
                  <p className="mt-0.5 text-label-md text-on-primary-container/70">
                    {formatEventDate(activeEvent.startTime)}
                  </p>
                </div>
              </div>
              {/* Navigation arrow */}
              <MdArrowForward
                size={24}
                className="text-on-primary-container/60 flex-shrink-0 transition-transform group-hover:translate-x-1.5"
              />
            </div>
          </Card>
        )}

        {/* Events section */}
        <Card as="section" size="lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary transition-colors w-fit mb-sm"
              >
                <MdArrowBack size={18} />
                Tillbaka till hem
              </Link>
              <h1 className="text-headline-xl text-on-surface">Pubrunda</h1>
            </div>
            <Link
              href="/pub-crawl/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <MdAdd size={20} />
              Nytt event
            </Link>
          </div>
          <EventList events={upcomingEvents} />
        </Card>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
