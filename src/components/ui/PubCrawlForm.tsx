'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MdArrowBack,
  MdCalendarToday,
  MdGroup,
  MdTimeline
} from 'react-icons/md';
import type {
  PubCrawlEvent,
  TimelinePhase,
  StaffSection
} from '@/types/pub-crawl';
import Card from '@/components/Card';
import FormField from '@/components/ui/FormField';
import PhaseBuilder from '@/components/ui/PhaseBuilder';
import SectionBuilder from '@/components/ui/SectionBuilder';

interface PubCrawlFormProps {
  /** Existing event to edit; undefined = creating new */
  initialData?: PubCrawlEvent;
}

const DEFAULT_TIME_COLUMNS = ['19:00', '20:00', '21:00', '22:00', '23:00'];

function makeDefaultPhases(): TimelinePhase[] {
  return [{ id: crypto.randomUUID(), label: '', startTime: '', endTime: '' }];
}

function makeDefaultSections(): StaffSection[] {
  return [
    {
      id: crypto.randomUUID(),
      name: '',
      rowCount: 1,
      slots: [
        Array.from({ length: DEFAULT_TIME_COLUMNS.length }, () => ({
          name: ''
        }))
      ]
    }
  ];
}

/**
 * Shared create/edit form for pub-crawl events.
 * Non-functional (no server action wired) — manages state locally.
 */
export default function PubCrawlForm({ initialData }: PubCrawlFormProps) {
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [date, setDate] = useState(initialData?.date ?? '');
  // Use lazy initialisers so crypto.randomUUID() runs only on the client,
  // avoiding a server/client hydration mismatch on the generated IDs.
  const [phases, setPhases] = useState<TimelinePhase[]>(
    () => initialData?.phases ?? makeDefaultPhases()
  );
  const [timeColumns, setTimeColumns] = useState<string[]>(
    () => initialData?.timeColumns ?? DEFAULT_TIME_COLUMNS
  );
  const [sections, setSections] = useState<StaffSection[]>(
    () => initialData?.schedule ?? makeDefaultSections()
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call server action
    console.log('submit', { title, date, phases, timeColumns, sections });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      {/* ── Header card: back link + title ───────────────────────────────── */}
      <Card as="section" size="lg">
        {isEdit ? (
          <Link
            href={`/pub-crawl/${initialData?.id}`}
            className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary transition-colors w-fit mb-sm"
          >
            <MdArrowBack size={18} />
            Tillbaka till pubrunda
          </Link>
        ) : (
          <Link
            href="/pub-crawl"
            className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary transition-colors w-fit mb-sm"
          >
            <MdArrowBack size={18} />
            Tillbaka till pubrundor
          </Link>
        )}
        <h1 className="text-headline-xl text-on-surface">
          {isEdit ? `Redigera: ${initialData.title}` : 'Nytt event'}
        </h1>
      </Card>

      {/* ── Card 1: Basic info ────────────────────────────────────────────── */}
      <Card size="lg" className="flex flex-col gap-md">
        <div className="flex items-center gap-3 mb-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-secondary flex-shrink-0">
            <MdCalendarToday size={20} />
          </div>
          <h2 className="text-headline-md text-on-surface">Eventinfo</h2>
        </div>

        <FormField
          id="event-title"
          label="Namn"
          type="text"
          placeholder="t.ex. Höstpubrunda LP1"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormField
          id="event-date"
          label="Datum"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Card>

      {/* ── Card 2: Timeline phases ───────────────────────────────────────── */}
      <Card size="lg" className="flex flex-col gap-md">
        <div className="flex items-center gap-3 mb-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-secondary flex-shrink-0">
            <MdTimeline size={20} />
          </div>
          <h2 className="text-headline-md text-on-surface">Tidslinje</h2>
        </div>

        <PhaseBuilder phases={phases} onChange={setPhases} />
      </Card>

      {/* ── Card 3: Staff schedule ────────────────────────────────────────── */}
      <Card size="lg" className="flex flex-col gap-md">
        <div className="flex items-center gap-3 mb-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-secondary flex-shrink-0">
            <MdGroup size={20} />
          </div>
          <h2 className="text-headline-md text-on-surface">Personalschema</h2>
        </div>

        <SectionBuilder
          timeColumns={timeColumns}
          onTimeColumnsChange={setTimeColumns}
          sections={sections}
          onSectionsChange={setSections}
        />
      </Card>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <Card size="lg">
        <div className="flex gap-sm justify-end">
          <Link
            href={isEdit ? `/pub-crawl/${initialData?.id}` : '/pub-crawl'}
            className="px-6 py-2.5 rounded-full text-label-md text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Avbryt
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            {isEdit ? 'Spara ändringar' : 'Skapa event'}
          </button>
        </div>
      </Card>
    </form>
  );
}
