import BottomNavBar from '@/components/BottomNavBar';
import ToolCard from '@/components/ToolCard';
import Card from '@/components/Card';
import type { NavItem } from '@/components/TopAppBar';
import { MdHome, MdViewInAr, MdLocalBar, MdPerson } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
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
      <main className="w-full mx-auto px-md pb-32 pt-nav-height max-w-content">
        <div className="py-gutter flex flex-col gap-md">
          {/* ── Hero card ───────────────────────────────────────────────── */}
          <Card as="section" size="lg" className="relative overflow-hidden">
            <div className="relative z-10 max-w-[38ch]">
              <p className="text-label-md mb-2 text-on-surface">
                Välkommen till
              </p>

              <h1 className="mb-4 font-zyzol text-on-surface text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.05] tracking-[-0.03em] font-bold">
                P.R.I.T.
              </h1>

              <p className="text-body-lg mb-6 font-body text-on-surface-variant">
                Vi är PR- och rustmästeriet på IT-sektionen vid Chalmers. Vi
                arrangerar olika arr, ansvarar för sektionens pubrundor och
                håller Hubben 2.2 levande.
              </p>

              <div className="flex flex-wrap items-center gap-sm">
                <Link
                  href="/members"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-label-md transition-all ambient-shadow-hover bg-gradient-brand-dim text-on-primary-container font-semibold"
                >
                  <MdPerson size={18} />
                  Sittande och pateter
                </Link>

                { process.env.INSTAGRAM_URL && <Link
                  href={process.env.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ambient-shadow-hover bg-surface-container text-on-surface-variant"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </Link> }

                <Link
                  href="https://www.facebook.com/PRITChalmers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ambient-shadow-hover bg-surface-container text-on-surface-variant"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </Link>

                <Link
                  href="https://www.youtube.com/@prit_it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ambient-shadow-hover bg-surface-container text-on-surface-variant"
                  aria-label="YouTube"
                >
                  <FaYoutube size={20} />
                </Link>
              </div>
            </div>
          </Card>

          {/* ── Verktyg ─────────────────────────────────────────────────── */}
          <Card as="section" size="lg">
            <h2 className="text-headline-md mb-sm text-on-surface">Verktyg</h2>
            <p className="text-body-md mb-md font-body text-on-surface-variant max-w-[60ch]">
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
          </Card>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </>
  );
}
