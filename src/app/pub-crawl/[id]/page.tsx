import BottomNavBar from '@/components/BottomNavBar';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import type { NavItem } from '@/components/TopAppBar';
import {
  MdHome,
  MdAccountBalanceWallet,
  MdBarChart,
  MdCheck,
  MdWineBar,
  MdOutlineCleaningServices,
  MdCalendarToday,
  MdPerson,
  MdLocalBar,
  MdViewInAr,
  MdEdit,
  MdArrowBack
} from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';
import Link from 'next/link';

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
                  Pubrunda LP1 2026
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

            {/* Timeline */}
            <div className="relative mt-8 mb-4 z-10">
              <div className="relative flex justify-between gap-gutter">
                {/* Leading line: left edge → item 1 (fades in) */}
                <div className="timeline-connector timeline-lead" />

                {/* Connector line: item 1 → item 2 (solid, done) */}
                <div className="timeline-connector timeline-done" />

                {/* Connector line: item 2 → item 3 (animated dots) */}
                <div className="timeline-connector timeline-active crawling-line" />

                {/* Trailing line: item 3 → right edge (fades out) */}
                <div className="timeline-connector timeline-trailing" />

                {/* Timeline Item 1 — Done */}
                <div className="flex flex-col items-center text-center flex-1 opacity-60">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 mb-3 shadow-sm bg-primary border-surface-container-lowest text-on-primary">
                    <MdCheck size={24} />
                  </div>
                  <span className="text-label-sm block uppercase tracking-wider mb-1 line-through font-body text-on-surface-variant">
                    16:00 – 17:31
                  </span>
                  <h4 className="text-label-md line-through font-body text-on-surface">
                    Genomgång och slutprepp
                  </h4>
                </div>

                {/* Timeline Item 2 — Active */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 mb-1 shadow-md shadow-(--color-ambient-shadow) -translate-y-2 bg-primary-container border-surface-container-lowest text-on-primary-container">
                    <MdWineBar size={32} />
                  </div>
                  <span className="text-label-sm block uppercase tracking-wider mb-1 font-body text-primary">
                    17:31 – 02:00
                  </span>
                  <h4 className="text-headline-md text-on-surface">Öppet!</h4>
                </div>

                {/* Timeline Item 3 — Upcoming */}
                <div className="flex flex-col items-center text-center flex-1 opacity-80">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 mb-3 shadow-sm bg-surface-variant border-surface-container-lowest text-on-surface-variant">
                    <MdOutlineCleaningServices size={24} />
                  </div>
                  <span className="text-label-sm block uppercase tracking-wider mb-1 font-body text-on-surface-variant">
                    02:00 – 07:00
                  </span>
                  <h4 className="text-label-md font-body text-on-surface">
                    Stängning och städ
                  </h4>
                </div>
              </div>
            </div>
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

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-surface-variant">
                  <th className="text-label-md text-on-surface-variant text-center p-sm">
                    19:00
                  </th>
                  <th className="text-label-md text-on-surface-variant text-center p-sm">
                    20:00
                  </th>
                  <th className="text-label-md text-on-surface-variant text-center p-sm">
                    21:00
                  </th>
                  <th className="text-label-md text-on-surface-variant text-center p-sm">
                    22:00
                  </th>
                  <th className="text-label-md text-on-surface-variant text-center p-sm">
                    23:00
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Row 1: Entré */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-xs sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant font-headline"
                  >
                    Släpp
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Anna K.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Anna K.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Erik M.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Erik M.
                  </td>
                </tr>
                <tr className="hover:bg-surface-container/50 transition-colors divide-x border-surface-variant">
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Team Alpha (3 pax)
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Johan L. (Lead)
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Johan L.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                </tr>
                {/* Row 2: Bar */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-xs sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant font-headline"
                  >
                    Bar
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Johan L. (Lead)
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Johan L.
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                </tr>
                {/* Row 3: Kök */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-xs sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant font-headline"
                  >
                    Kök
                  </td>
                </tr>
                <tr className="hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm">
                    Team Alpha (3 pax)
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                  <td className="text-center border-surface-variant p-sm text-label-sm text-on-surface-variant italic">
                    Unassigned
                  </td>
                </tr>
              </tbody>
            </table>
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
                <span className="text-label-sm px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                  Live
                </span>
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
