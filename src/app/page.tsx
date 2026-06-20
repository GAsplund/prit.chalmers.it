import BottomNavBar from '@/components/BottomNavBar';
import ToolCard from '@/components/ToolCard';
import type { NavItem } from '@/components/TopAppBar';
import { MdHome, MdViewInAr, MdLocalBar, MdPerson } from 'react-icons/md';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import UserService from '@/services/userService';

const navItems: NavItem[] = [
  { href: '/', Icon: MdHome, label: 'Hem', active: true },
  { href: '/hubben', Icon: MdViewInAr, label: 'Hubben' },
  { href: '/pub-crawl', Icon: MdLocalBar, label: 'Pubrunda' },
  { href: '/members', Icon: MdPerson, label: 'Medlemmar' }
];

export default async function HomePage() {
  const isLoggedIn = !!(await UserService.getUser());
  const isPRIT = await UserService.getIsPRIT();

  return (
    <>
      <main
        className="w-full mx-auto px-md pb-32 pt-[88px]"
        style={{ maxWidth: 'var(--container-content)' }}
      >
        <div className="py-gutter flex flex-col gap-md">
          {/* ── Hero card ───────────────────────────────────────────────── */}
          <section
            className="rounded-lg p-lg ambient-shadow border border-outline-variant/20 relative overflow-hidden"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <div className="relative z-10" style={{ maxWidth: '38ch' }}>
              <p className="text-label-md mb-2 text-on-surface">
                Välkommen till
              </p>

              <h1
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-zyzol, var(--font-headline))',
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  fontWeight: 700,
                  color: 'var(--color-on-surface)'
                }}
              >
                P.R.I.T.
              </h1>

              <p
                className="text-body-lg mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-on-surface-variant)'
                }}
              >
                Vi är PR- och rustmästeriet på IT-sektionen vid Chalmers. Vi
                arrangerar olika arr, ansvarar för sektionens pubrundor och
                håller Hubben 2.2 levande.
              </p>

              <div className="flex flex-wrap items-center gap-sm">
                <Link
                  href="/members"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-label-md transition-all ambient-shadow-hover"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary-container), var(--color-secondary-fixed-dim))',
                    color: 'var(--color-on-primary-container)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600
                  }}
                >
                  <MdPerson size={18} />
                  Sittande och pateter
                </Link>

                <a
                  href="https://www.facebook.com/PRITChalmers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ambient-shadow-hover"
                  style={{
                    background: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)'
                  }}
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>

                <a
                  href="https://www.youtube.com/@prit_it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ambient-shadow-hover"
                  style={{
                    background: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)'
                  }}
                  aria-label="YouTube"
                >
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
          </section>

          {/* ── Verktyg ─────────────────────────────────────────────────── */}
          <section
            className="rounded-lg p-lg ambient-shadow border border-outline-variant/20"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <h2
              className="text-headline-md mb-sm"
              style={{
                fontFamily: 'var(--font-headline)',
                color: 'var(--color-on-surface)'
              }}
            >
              Verktyg
            </h2>
            <p
              className="text-body-md mb-md"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-on-surface-variant)',
                maxWidth: '60ch'
              }}
            >
              Praktiska hjälpmedel för oss i P.R.I.T. och för sektionens
              medlemmar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <ToolCard
                href="/pub-crawl"
                Icon={MdLocalBar}
                title="Pubrunda"
                description="Planera rutten, håll koll på ekonomin och koordinera deltagarna under en pubrunda."
                locked={!isPRIT}
              />
              <ToolCard
                href="/hubben"
                Icon={MdViewInAr}
                title="Hubben 2.2 i 3D"
                description="Utforska sektionslokalen i en interaktiv 3D-modell."
                locked={!isLoggedIn}
              />
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
