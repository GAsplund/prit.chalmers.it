import BottomNavBar from '@/components/BottomNavBar';
import MemberCard from '@/components/MemberCard';
import type { NavItem } from '@/components/TopAppBar';
import GammaService from '@/services/gammaService';
import { MdHome, MdViewInAr, MdLocalBar, MdPerson } from 'react-icons/md';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem' },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda' },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar', active: true }
];

export default async function MembersPage() {
  const groups = await GammaService.getAllSuperGroups();

  const sittande = [
    groups.find(
      (g) => g.superGroup.id === process.env.PRIT_GAMMA_SUPER_GROUP_ID
    )!
  ];
  const pateter = [
    groups.find(
      (g) => g.superGroup.id === process.env.SPRIT_GAMMA_SUPER_GROUP_ID
    )!
  ];

  return (
    <>
      <main
        className="w-full mx-auto px-md pb-32 pt-[88px]"
        style={{ maxWidth: 'var(--container-content)' }}
      >
        <div className="py-gutter flex flex-col gap-md">
          {/* ── Hero card ───────────────────────────────────────────────── */}
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
              Sittande och pateter
            </h1>
            <p
              className="mt-2 text-body-lg"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-on-surface-variant)'
              }}
            >
              Information om alla som sitter eller har suttit P.R.I.T.
            </p>
          </section>

          {/* ── Sittande ────────────────────────────────────────────────── */}
          {sittande.map((group) => (
            <section
              key={group.superGroup.id}
              className="rounded-lg p-lg ambient-shadow border border-outline-variant/20"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              <h2
                className="text-headline-md mb-md"
                style={{
                  fontFamily: 'var(--font-headline)',
                  color: 'var(--color-on-surface)'
                }}
              >
                {group.superGroup.prettyName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {group.members.map((m) => (
                  <MemberCard key={m.user.id + group.superGroup.id} {...m} />
                ))}
              </div>
            </section>
          ))}

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-md">
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-outline-variant)' }}
            />
            <span
              className="text-label-md flex-shrink-0"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-on-surface-variant)'
              }}
            >
              Pateter
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-outline-variant)' }}
            />
          </div>

          {/* ── Pateter ─────────────────────────────────────────────────── */}
          {pateter.map((group) => (
            <section
              key={group.superGroup.id}
              className="rounded-lg p-lg ambient-shadow border border-outline-variant/20"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              <h2
                className="text-headline-md mb-md"
                style={{
                  fontFamily: 'var(--font-headline)',
                  color: 'var(--color-on-surface)'
                }}
              >
                {group.superGroup.prettyName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {group.members.map((m) => (
                  <MemberCard key={m.user.id + group.superGroup.id} {...m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
