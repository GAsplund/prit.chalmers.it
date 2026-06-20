import TopAppBar from '@/components/TopAppBar';
import BottomNavBar from '@/components/BottomNavBar';
import EventCard from '@/components/EventCard';
import Card from '@/components/Card';
import type { NavItem } from '@/components/TopAppBar';
import {
  MdHome,
  MdEditCalendar,
  MdAdd,
  MdPerson,
  MdLocalBar,
  MdViewInAr
} from 'react-icons/md';
import Link from 'next/link';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda', active: true },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

const events = [
  {
    day: 24,
    month: 'Okt',
    title: 'Höstpubrunda',
    time: '18:00 - 02:00',
    upcoming: true,
    id: '1'
  },
  {
    day: 12,
    month: 'Nov',
    title: 'Städdag Hubben',
    time: '10:00 - 15:00',
    upcoming: false,
    id: '2'
  }
];

export default async function PubCrawlPage() {
  const user = await UserService.getUser();
  if (!user) {
    return <UnauthorizedPage />;
  }

  const isPRIT = await UserService.getIsPRIT();
  if (!isPRIT) {
    return <ForbiddenPage />;
  }

  return (
    <>
      <TopAppBar />

      <main className="w-full mx-auto px-md pb-32 pt-nav-height max-w-content">
        <div className="py-gutter flex flex-col gap-md">
          {/* Page header card */}
          <Card as="section" size="lg">
            <h1 className="text-headline-xl text-on-surface">Pubrunda</h1>
            <p className="mt-2 text-body-lg font-body text-on-surface-variant">
              Hantera ekonomi och schema för kommande evenemang.
            </p>
          </Card>

          {/* Ongoing event */}
          <Card
            as={Link}
            href="/pub-crawl/1"
            variant="tertiary"
            size="lg"
            className="group hover:ambient-shadow-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MdEditCalendar
                  size={28}
                  className="text-on-tertiary-container"
                />
                <h2 className="text-headline-md text-on-tertiary-container">
                  Pågående pubrunda
                </h2>
              </div>
              <span className="text-label-md px-3 py-1 rounded-full opacity-80 bg-on-tertiary-container text-tertiary-container">
                Aktiv
              </span>
            </div>
          </Card>

          {/* Schedule section card */}
          <Card as="section" size="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md text-on-surface">
                Kommande pubrundor
              </h2>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full ambient-shadow-hover transition-all text-label-md bg-primary text-on-primary">
                <MdAdd size={20} />
                Nytt Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {events.map((e) => (
                <EventCard key={e.id} {...e} />
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
