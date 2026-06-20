import TopAppBar from '@/components/TopAppBar';
import BottomNavBar from '@/components/BottomNavBar';
import StatCard from '@/components/StatCard';
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
  MdViewInAr
} from 'react-icons/md';
import UserService from '@/services/userService';
import UnauthorizedPage from '@/components/ErrorPages/401';
import ForbiddenPage from '@/components/ErrorPages/403';

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
          {/* Page header card with event schedule */}
          <section
            className="rounded-lg p-lg ambient-shadow border border-outline-variant/20 relative overflow-hidden"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <h1
              className="text-headline-xl mb-lg relative z-10"
              style={{
                fontFamily: 'var(--font-headline)',
                color: 'var(--color-on-surface)'
              }}
            >
              Pubrunda LP1 2026
            </h1>
            {/* Timeline */}
            <div className="relative mt-8 mb-4 z-10">
              <div className="relative flex justify-between gap-gutter">
                {/* Leading line: left edge → item 1 (fades in) */}
                <div
                  className="absolute top-6 -translate-y-1/2 h-[2px] z-0"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, var(--color-primary))',
                    left: 0,
                    width: 'calc(16.66% - 48px)'
                  }}
                />

                {/* Connector line: item 1 → item 2 (solid, done) */}
                <div
                  className="absolute top-6 -translate-y-1/2 h-[2px] z-0"
                  style={{
                    background: 'var(--color-primary)',
                    left: 'calc(16.66% + 32px)',
                    width: 'calc(33.33% - 72px)'
                  }}
                />

                {/* Connector line: item 2 → item 3 (animated dots) */}
                <div
                  className="absolute top-6 -translate-y-1/2 crawling-line z-0"
                  style={{
                    left: 'calc(50% + 40px)',
                    width: 'calc(33.33% - 72px)'
                  }}
                />

                {/* Trailing line: item 3 → right edge (fades out) */}
                <div
                  className="absolute top-6 -translate-y-1/2 h-[2px] z-0"
                  style={{
                    background:
                      'linear-gradient(to right, var(--color-primary-container), transparent)',
                    left: 'calc(83.33% + 48px)',
                    right: 0,
                    width: 'calc(16.66% - 48px)'
                  }}
                />

                {/* Timeline Item 1 — Done */}
                <div
                  className="flex flex-col items-center text-center flex-1"
                  style={{ opacity: 0.6 }}
                >
                  <div
                    className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 mb-3 shadow-sm"
                    style={{
                      background: 'var(--color-primary)',
                      borderColor: 'var(--color-surface-container-lowest)',
                      color: 'var(--color-on-primary)'
                    }}
                  >
                    <MdCheck size={24} />
                  </div>
                  <span
                    className="text-label-sm block uppercase tracking-wider mb-1 line-through"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-on-surface-variant)'
                    }}
                  >
                    16:00 – 17:31
                  </span>
                  <h4
                    className="text-label-md line-through"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Genomgång och slutprepp
                  </h4>
                </div>

                {/* Timeline Item 2 — Active */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 mb-1 shadow-md -translate-y-2"
                    style={{
                      background: 'var(--color-primary-container)',
                      borderColor: 'var(--color-surface-container-lowest)',
                      color: 'var(--color-on-primary-fixed-variant)'
                    }}
                  >
                    <MdWineBar size={32} />
                  </div>
                  <span
                    className="text-label-sm block uppercase tracking-wider mb-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    17:31 – 02:00
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '20px',
                      lineHeight: '1.3',
                      fontWeight: '700',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Öppet!
                  </h4>
                  {/*<p
                    className="text-body-md mt-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-on-surface-variant)'
                    }}
                  >
                    Kolla kylar och kassa
                  </p>*/}
                </div>

                {/* Timeline Item 3 — Upcoming */}
                <div
                  className="flex flex-col items-center text-center flex-1"
                  style={{ opacity: 0.8 }}
                >
                  <div
                    className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 mb-3 shadow-sm"
                    style={{
                      background: 'var(--color-surface-variant)',
                      borderColor: 'var(--color-surface-container-lowest)',
                      color: 'var(--color-on-surface-variant)'
                    }}
                  >
                    <MdOutlineCleaningServices size={24} />
                  </div>
                  <span
                    className="text-label-sm block uppercase tracking-wider mb-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-on-surface-variant)'
                    }}
                  >
                    02:00 – 07:00
                  </span>
                  <h4
                    className="text-label-md"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Stängning och städ
                  </h4>
                </div>
              </div>
            </div>
          </section>

          {/* Schedule Grid */}
          <section
            className="rounded-xl p-md ambient-shadow border border-outline-variant/20"
            style={{
              background: 'var(--color-surface-container-lowest)',
              gridColumn: '1 / 3'
            }}
          >
            <div className="flex gap-3 items-center mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-secondary)'
                }}
              >
                <MdCalendarToday size={20} />
              </div>
              <h2
                className="text-headline-md"
                style={{
                  fontFamily: 'var(--font-headline)',
                  color: 'var(--color-on-surface)'
                }}
              >
                Personalschema
              </h2>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-surface-variant">
                  <th className="font-label-md text-label-md text-on-surface-variant text-center p-2">
                    19:00
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant text-center p-2">
                    20:00
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant text-center p-2">
                    21:00
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant text-center p-2">
                    22:00
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant text-center p-2">
                    23:00
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Row 1: Entré */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-2 sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Släpp
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Anna K.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Anna K.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Erik M.
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Erik M.
                  </td>
                </tr>
                <tr className="hover:bg-surface-container/50 transition-colors divide-x border-surface-variant">
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Team Alpha (3 pax)
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Johan L. (Lead)
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Johan L.
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                </tr>
                {/* Row 2: Bar */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-2 sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Bar
                  </td>
                </tr>
                <tr className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Johan L. (Lead)
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Maria S.
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Johan L.
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                </tr>
                {/* Row 3: Kök */}
                <tr>
                  <td
                    colSpan={5}
                    className="text-headline-sm text-center font-bold p-2 sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Kök
                  </td>
                </tr>
                <tr className="hover:bg-surface-container/50 transition-colors divide-x">
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant p-sm font-label-sm text-label-sm">
                    Team Alpha (3 pax)
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                  <td className="p-2 text-center border-surface-variant text-on-surface-variant p-sm font-label-sm text-label-sm italic">
                    Unassigned
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Financial health grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div
              className="rounded-xl p-md ambient-shadow flex flex-col justify-between border border-outline-variant/20"
              style={{
                background: 'var(--color-surface-container-lowest)',
                gridColumn: '1 / 3'
              }}
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'var(--color-surface-container)',
                      color: 'var(--color-secondary)'
                    }}
                  >
                    <MdBarChart size={20} />
                  </div>
                  <h2
                    className="text-headline-md"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    Ekonomi
                  </h2>
                </div>
                <span
                  className="text-label-sm px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--color-secondary-container)',
                    color: 'var(--color-on-secondary-container)'
                  }}
                >
                  Live
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body-md)',
                      lineHeight: 'var(--text-body-md--line-height)',
                      color: 'var(--color-outline)'
                    }}
                  >
                    Intäkter
                  </p>
                  <h2
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'var(--text-headline-lg)',
                      lineHeight: 'var(--text-headline-lg--line-height)',
                      letterSpacing: 'var(--text-headline-lg--letter-spacing)',
                      fontWeight: 'var(--text-headline-lg--font-weight)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    10 000 kr
                  </h2>
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body-md)',
                      lineHeight: 'var(--text-body-md--line-height)',
                      color: 'var(--color-outline)'
                    }}
                  >
                    Kostnader
                  </p>
                  <h2
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'var(--text-headline-lg)',
                      lineHeight: 'var(--text-headline-lg--line-height)',
                      letterSpacing: 'var(--text-headline-lg--letter-spacing)',
                      fontWeight: 'var(--text-headline-lg--font-weight)',
                      color: 'var(--color-on-surface)'
                    }}
                  >
                    25 000 kr
                  </h2>
                </div>
              </div>

              {/* Value */}
              <div className="flex justify-between">
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-md)',
                    lineHeight: 'var(--text-body-md--line-height)',
                    color: 'var(--color-outline)'
                  }}
                >
                  Mål: 50 000 kr
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-md)',
                    lineHeight: 'var(--text-body-md--line-height)',
                    color: 'var(--color-outline)'
                  }}
                >
                  90% nått
                </p>
              </div>
              <div
                className="w-full h-4 rounded-full overflow-hidden"
                style={{
                  background: 'var(--color-surface-container)'
                }}
              >
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: '90%', color: 'var(--color-on-primary)' }}
                ></div>
              </div>
            </div>
            <StatCard {...stat} />
          </div>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
