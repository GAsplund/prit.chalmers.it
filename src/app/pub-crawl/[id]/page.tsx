import BottomNavBar from '@/components/BottomNavBar';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import type { NavItem } from '@/components/TopAppBar';
import {
  MdHome,
  MdAccountBalanceWallet,
  MdBarChart,
  MdCalendarToday,
  MdPerson,
  MdLocalBar,
  MdViewInAr,
  MdEdit,
  MdArrowBack,
  MdPhone,
  MdGroup
} from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';
import Link from 'next/link';
import PubCrawlService, { toPubCrawlEvent } from '@/services/pubCrawlService';
import { notFound } from 'next/navigation';
import PubCrawlProgress from '@/components/ui/PubCrawlProgress';
import UpcomingSchedule from '@/components/ui/UpcomingSchedule';
import ScheduleTable from '@/components/ui/ScheduleTable';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda', active: true },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

const stat = {
  Icon: MdAccountBalanceWallet,
  value: '10 000 kr',
  description: 'Resultat',
  highlight: true
};

export default async function PubCrawlPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await UserService.getUser();
  if (!user) {
    return <UnauthorizedPage />;
  }

  const isPRIT = await UserService.getIsPRIT();
  if (!isPRIT) {
    return <ForbiddenPage />;
  }

  const dbEvent = await PubCrawlService.getPubCrawlById(id);
  if (!dbEvent) {
    notFound();
  }

  const event = toPubCrawlEvent(dbEvent);

  return (
    <>
      <main className="w-full mx-auto px-md pb-32 pt-nav-height max-w-content">
        <div className="py-gutter flex flex-col gap-md">
          {/* Page header card with event schedule */}
          <Card as="section" size="lg" className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <Link
                  href="/pub-crawl"
                  className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary transition-colors w-fit mb-sm"
                >
                  <MdArrowBack size={18} />
                  Tillbaka till pubrundor
                </Link>
                <h1 className="text-headline-xl relative z-10 text-on-surface">
                  {event.title}
                </h1>
              </div>
              <Link
                href={`/pub-crawl/${id}/edit`}
                className="flex items-center gap-2 px-5 px-6 py-2.5 rounded-full text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity"
              >
                <MdEdit size={20} />
                Redigera
              </Link>
            </div>

            <div className="flex gap-4 mb-6 h-70">
              <PubCrawlProgress phases={event.phases} endTime={event.endTime} />
              <Card
                variant="surface"
                size="md"
                className="flex-2 min-h-0 flex flex-col"
              >
                <div className="flex gap-3 items-center mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container text-secondary">
                    <MdGroup size={20} />
                  </div>
                  <h2 className="text-headline-md text-on-surface">
                    Viktiga kontakter
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 content-start gap-2 overflow-y-auto min-h-0 flex-1">
                  <Card
                    size="chip"
                    variant="surface-variant"
                    className="flex flex-row gap-2 justify-between items-center flex"
                  >
                    <div>
                      <h2 className="font-semibold">112</h2>
                      <p className="text-label-sm text-on-surface-variant">
                        Vid nödsituation
                      </p>
                    </div>
                    <Link
                      href="tel:112"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary border border-primary/40 hover:bg-surface-container-low transition-colors"
                    >
                      <MdPhone size={16} />
                    </Link>
                  </Card>
                  <Card
                    size="chip"
                    variant="surface-variant"
                    className="flex flex-row gap-2 justify-between items-center"
                  >
                    <div>
                      <h2 className="font-semibold">Cubsec</h2>
                      <p className="text-label-sm text-on-surface-variant">
                        Ordningsvakter
                      </p>
                    </div>
                    <Link
                      href="tel:031-772 44 99"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary border border-primary/40 hover:bg-surface-container-low transition-colors"
                    >
                      <MdPhone size={16} />
                    </Link>
                  </Card>
                  <Card
                    size="chip"
                    variant="surface-variant"
                    className="flex flex-row gap-2 justify-between items-center"
                  >
                    <div>
                      <h2 className="font-semibold">Linus Ordal (Skaut)</h2>
                      <p className="text-label-sm text-on-surface-variant">
                        Serveringsansvarig
                      </p>
                    </div>
                    <Link
                      href="tel:070-123 45 67"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary border border-primary/40 hover:bg-surface-container-low transition-colors"
                    >
                      <MdPhone size={16} />
                    </Link>
                  </Card>
                </div>
              </Card>
            </div>

            <UpcomingSchedule phases={event.phases} />
          </Card>

          {/* Schedule Grid */}
          <Card as="section">
            <div className="flex gap-3 items-center mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container text-secondary">
                <MdCalendarToday size={20} />
              </div>
              <h2 className="text-headline-md text-on-surface">
                Personalschema
              </h2>
            </div>

            <ScheduleTable
              timeColumns={event.timeColumns}
              schedule={event.schedule}
              eventEndTime={event.endTime}
            />
          </Card>

          {/* Financial health grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <Card className="flex flex-col justify-between col-start-1 col-end-3">
              {/* Header row */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container text-secondary">
                    <MdBarChart size={20} />
                  </div>
                  <h2 className="text-headline-md text-on-surface">Ekonomi</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container">
                  <span className="w-2 h-2 rounded-full bg-on-primary-container animate-pulse flex-shrink-0" />
                  <span className="text-label-sm text-on-secondary-container">
                    Live
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex-1">
                  <p className="text-body-md font-body text-outline">
                    Intäkter
                  </p>
                  <h2 className="text-headline-lg text-on-surface">
                    10 000 kr
                  </h2>
                </div>
                <div className="flex-1">
                  <p className="text-body-md font-body text-outline">
                    Kostnader
                  </p>
                  <h2 className="text-headline-lg text-on-surface">
                    25 000 kr
                  </h2>
                </div>
              </div>

              {/* Progress */}
              <div className="flex justify-between mb-2">
                <p className="text-body-md font-body text-outline">
                  Mål: 50 000 kr
                </p>
                <p className="text-body-md font-body text-outline">90% nått</p>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden bg-surface-container">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out w-[90%]" />
              </div>
            </Card>

            <StatCard {...stat} />
          </div>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
