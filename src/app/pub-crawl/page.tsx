import TopAppBar from '@/components/TopAppBar';
import BottomNavBar from '@/components/BottomNavBar';
import EventCard from '@/components/EventCard';
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
              Pubrunda
            </h1>
            <p
              className="mt-2 text-body-lg"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-on-surface-variant)'
              }}
            >
              Hantera ekonomi och schema för kommande evenemang.
            </p>
          </section>

          {/* Ongoing event */}
          <Link
            href="/pub-crawl/1"
            className="group rounded-lg p-lg ambient-shadow border border-outline-variant/20 hover:ambient-shadow-hover"
            style={{ background: 'var(--color-tertiary-container)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MdEditCalendar
                  size={28}
                  style={{ color: 'var(--color-on-tertiary-container)' }}
                />
                <h2
                  className="text-headline-md"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    color: 'var(--color-on-tertiary-container)'
                  }}
                >
                  Pågående pubrunda
                </h2>
              </div>
              <span
                className="text-label-md px-3 py-1 rounded-full"
                style={{
                  background: 'var(--color-on-tertiary-container)',
                  color: 'var(--color-tertiary-container)',
                  opacity: 0.8
                }}
              >
                Aktiv
              </span>
            </div>
          </Link>

          {/* Schedule section card */}
          <section
            className="rounded-lg p-lg ambient-shadow border border-outline-variant/20"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-headline-md"
                style={{
                  fontFamily: 'var(--font-headline)',
                  color: 'var(--color-on-surface)'
                }}
              >
                Kommande pubrundor
              </h2>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-full ambient-shadow-hover transition-all text-label-md"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <MdAdd size={20} />
                Nytt Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {events.map((e) => (
                <EventCard key={e.id} {...e} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
