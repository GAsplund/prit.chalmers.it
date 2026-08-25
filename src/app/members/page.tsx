import BottomNavBar from '@/components/BottomNavBar';
import MemberCard from '@/components/MemberCard';
import Card from '@/components/Card';
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
      <main className="w-full mx-auto px-sm sm:px-md pb-32 pt-nav-height max-w-content">
        <div className="py-gutter flex flex-col gap-md">
          {/* ── Hero card ───────────────────────────────────────────────── */}
          <Card as="section" size="lg">
            <h1 className="text-headline-xl text-on-surface">
              Sittande och pateter
            </h1>
            <p className="mt-2 text-body-lg font-body text-on-surface-variant">
              Information om alla som sitter eller har suttit P.R.I.T.
            </p>
          </Card>

          {/* ── Sittande ────────────────────────────────────────────────── */}
          {sittande.map((group) => (
            <Card as="section" key={group.superGroup.id} size="lg">
              <h2 className="text-headline-md mb-md text-on-surface">
                {group.superGroup.prettyName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {group.members.map((m) => (
                  <MemberCard key={m.user.id + group.superGroup.id} {...m} />
                ))}
              </div>
            </Card>
          ))}

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-md">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-label-md flex-shrink-0 font-body text-on-surface-variant">
              Pateter
            </span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* ── Pateter ─────────────────────────────────────────────────── */}
          {pateter.map((group) => (
            <Card as="section" key={group.superGroup.id} size="lg">
              <h2 className="text-headline-md mb-md text-on-surface">
                {group.superGroup.prettyName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {group.members.map((m) => (
                  <MemberCard key={m.user.id + group.superGroup.id} {...m} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
