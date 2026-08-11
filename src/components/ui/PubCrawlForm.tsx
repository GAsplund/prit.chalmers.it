'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MdArrowBack,
  MdCalendarToday,
  MdGroup,
  MdTimeline
} from 'react-icons/md';
import type {
  PubCrawlEvent,
  TimelinePhase,
  StaffSection,
  FormTimelinePhase
} from '@/types/pub-crawl';
import { createPubCrawl, updatePubCrawl } from '@/app/actions/pubCrawls';
import Card from '@/components/Card';
import FormField from '@/components/ui/FormField';
import PhaseBuilder from '@/components/ui/PhaseBuilder';
import SectionBuilder from '@/components/ui/SectionBuilder';
import LocaleService from '@/services/localeService';

interface PubCrawlFormProps {
  /** Existing event to edit; undefined = creating new */
  initialData?: PubCrawlEvent;
}

const DEFAULT_COLUMN_COUNT = 5;

function makeDefaultPhases(): TimelinePhase[] {
  return [{ id: crypto.randomUUID(), label: '', time: new Date() }];
}

function makeDefaultSections(colCount: number): StaffSection[] {
  return [
    {
      id: crypto.randomUUID(),
      name: '',
      rowCount: 1,
      slots: [Array.from({ length: colCount }, () => ({ name: '' }))]
    }
  ];
}

function toFormTimelinePhases(phases: TimelinePhase[]): FormTimelinePhase[] {
  return phases.map((p) => ({
    id: p.id,
    label: p.label,
    time: LocaleService.dateToInputString(p.time)
  }));
}

function toTimelinePhases(phases: FormTimelinePhase[]): TimelinePhase[] {
  return phases.map((p) => ({
    id: p.id,
    label: p.label,
    time: LocaleService.inputStringToDate(p.time)
  }));
}

/**
 * Shared create/edit form for pub-crawl events.
 * Calls server actions on submit, then redirects to the event page.
 */
export default function PubCrawlForm({ initialData }: PubCrawlFormProps) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Core state (Date objects) ──────────────────────────────────────────────
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [startTime, setStartTime] = useState<Date>(
    initialData?.startTime ?? new Date()
  );
  const [endTime, setEndTime] = useState<Date>(
    initialData?.endTime ?? new Date()
  );

  // Schedule start time: initialized from first timeColumn or event start
  const [scheduleStartTime, setScheduleStartTime] = useState<Date>(() => {
    if (initialData?.timeColumns?.length && initialData?.startTime) {
      return LocaleService.timeStringToDate(
        LocaleService.dateToTimeString(initialData.timeColumns[0]),
        initialData.startTime
      );
    }
    return initialData?.startTime ?? new Date();
  });

  // ── Timeline phases ────────────────────────────────────────────────────────
  const [phases, setPhases] = useState<FormTimelinePhase[]>(() =>
    toFormTimelinePhases(initialData?.phases ?? makeDefaultPhases())
  );

  // ── Sections (staff schedule data) ─────────────────────────────────────────
  const [sections, setSections] = useState<StaffSection[]>(
    () => initialData?.schedule ?? makeDefaultSections(DEFAULT_COLUMN_COUNT)
  );

  // ── Derived: column count from sections ─────────────────────────────────────
  const columnCount = useMemo(
    () => sections[0]?.slots[0]?.length ?? DEFAULT_COLUMN_COUNT,
    [sections]
  );

  // ── Derived: time columns from scheduleStartTime + columnCount ─────────────
  const timeColumns = useMemo<Date[]>(() => {
    return Array.from({ length: columnCount }, (_, i) => {
      const date = new Date(scheduleStartTime);
      date.setHours(date.getHours() + i, 0, 0, 0);
      return date;
    });
  }, [scheduleStartTime, columnCount]);

  // ── Derived: display labels for SectionBuilder ──────────────────────────────
  const columnLabels = useMemo(
    () => timeColumns.map((d) => LocaleService.dateToTimeString(d)),
    [timeColumns]
  );

  // ── Column add/remove ───────────────────────────────────────────────────────
  function addColumn() {
    setSections(
      sections.map((s) => ({
        ...s,
        slots: s.slots.map((row) => [...row, { name: '' }])
      }))
    );
  }

  function removeColumn(idx: number) {
    setSections(
      sections.map((s) => ({
        ...s,
        slots: s.slots.map((row) => row.filter((_, i) => i !== idx))
      }))
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const convPhases = toTimelinePhases(phases);
    startTransition(async () => {
      const input = {
        title,
        startTime,
        endTime,
        phases: convPhases,
        timeColumns,
        schedule: sections.map((s) => ({
          id: s.id,
          name: s.name,
          slots: s.slots
        }))
      };

      if (isEdit) {
        await updatePubCrawl(initialData.id, input);
        router.push(`/pub-crawl/${initialData.id}`);
      } else {
        const id = await createPubCrawl(input);
        router.push(`/pub-crawl/${id}`);
      }
    });
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
          id="event-start"
          label="Start"
          type="datetime-local"
          required
          value={LocaleService.dateToInputString(startTime)}
          onChange={(e) => setStartTime(LocaleService.inputStringToDate(e.target.value))}
        />

        <FormField
          id="event-end"
          label="Slut"
          type="datetime-local"
          required
          value={LocaleService.dateToInputString(endTime)}
          onChange={(e) => setEndTime(LocaleService.inputStringToDate(e.target.value))}
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

        <FormField
          id="schedule-start-time"
          label="Schema startar"
          type="time"
          required
          value={LocaleService.dateToTimeString(scheduleStartTime)}
          onChange={(e) => {
            const [h, m] = e.target.value.split(':').map(Number);
            const updated = new Date(startTime);
            updated.setHours(h, m, 0, 0);
            setScheduleStartTime(updated);
          }}
        />

        <SectionBuilder
          columnLabels={columnLabels}
          sections={sections}
          onSectionsChange={setSections}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
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
            disabled={isPending}
            className="px-6 py-2.5 rounded-full text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Sparar…' : isEdit ? 'Spara ändringar' : 'Skapa event'}
          </button>
        </div>
      </Card>
    </form>
  );
}
