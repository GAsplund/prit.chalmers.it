import db from '@/db';
import {
  pubEvents,
  timelineStages,
  staffSections,
  staffRows,
  staffSlots
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { PubCrawlEvent, StaffSection } from '@/types/pub-crawl';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

type DbEvent = Awaited<ReturnType<typeof PubCrawlService.getPubCrawlById>>;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTimeLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${formatTime(date)}`;
}

function toPubCrawlEvent(event: NonNullable<DbEvent>): PubCrawlEvent {
  const timeColumns = [
    ...new Set(
      event.sections.flatMap((section) =>
        section.rows.flatMap((row) =>
          row.slots.map((slot) => formatTime(slot.slotTime))
        )
      )
    )
  ].sort();

  const schedule: StaffSection[] = event.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      name: section.name,
      rowCount: section.rows.length,
      slots: section.rows
        .sort((a, b) => a.order - b.order)
        .map((row) => {
          const byTime = new Map(
            row.slots.map((s) => [formatTime(s.slotTime), s.name ?? ''])
          );
          return timeColumns.map((col) => ({
            name: byTime.get(col) ?? ''
          }));
        })
    }));

  return {
    id: event.id,
    title: event.title,
    startTime: formatDateTimeLocal(event.startTime),
    endTime: formatDateTimeLocal(event.endTime),
    upcoming: event.startTime > new Date(),
    phases: event.stages
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .map((stage) => ({
        id: stage.id,
        label: stage.label,
        time: formatTime(stage.startTime)
      })),
    timeColumns,
    schedule
  };
}

export { toPubCrawlEvent };

export interface PubCrawlInput {
  title: string;
  startTime: string;
  endTime: string;
  phases: { id: string; label: string; time: string }[];
  timeColumns: string[];
  schedule: {
    id: string;
    name: string;
    slots: { name: string }[][];
  }[];
}

function eventDate(startTime: string): string {
  return startTime.slice(0, 10);
}

function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

async function replaceChildren(tx: Tx, eventId: string, input: PubCrawlInput) {
  await tx.delete(timelineStages).where(eq(timelineStages.eventId, eventId));
  await tx.delete(staffSections).where(eq(staffSections.eventId, eventId));

  for (const [i, phase] of input.phases.entries()) {
    await tx.insert(timelineStages).values({
      id: phase.id,
      eventId,
      label: phase.label,
      startTime: parseDateTime(eventDate(input.startTime), phase.time),
      order: i
    });
  }

  for (const [sIdx, section] of input.schedule.entries()) {
    const sectionId = section.id;
    await tx.insert(staffSections).values({
      id: sectionId,
      eventId,
      name: section.name,
      order: sIdx
    });

    for (const [rIdx, row] of section.slots.entries()) {
      const rowId = crypto.randomUUID();
      await tx.insert(staffRows).values({
        id: rowId,
        sectionId,
        order: rIdx
      });

      const date = eventDate(input.startTime);
      const slots = row
        .map((slot, cIdx) => {
          if (!slot.name) return null;
          return {
            rowId,
            slotTime: parseDateTime(date, input.timeColumns[cIdx]),
            name: slot.name
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

      if (slots.length > 0) {
        await tx.insert(staffSlots).values(slots);
      }
    }
  }
}

export default class PubCrawlService {
  static async getUpcomingPubCrawls() {
    return db.query.pubEvents.findMany({
      where: {
        startTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  static async getPubCrawlById(id: string) {
    return db.query.pubEvents.findFirst({
      where: {
        id
      },
      with: {
        stages: true,
        sections: {
          with: {
            rows: {
              with: {
                slots: true
              }
            }
          }
        }
      }
    });
  }

  static async createPubCrawl(input: PubCrawlInput): Promise<string> {
    const eventId = crypto.randomUUID();

    return db.transaction(async (tx) => {
      await tx.insert(pubEvents).values({
        id: eventId,
        title: input.title,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime)
      });

      await replaceChildren(tx, eventId, input);

      return eventId;
    });
  }

  static async updatePubCrawl(id: string, input: PubCrawlInput): Promise<void> {
    const event = await PubCrawlService.getPubCrawlById(id);
    if (!event) throw new Error('Event not found');

    await db.transaction(async (tx) => {
      await tx
        .update(pubEvents)
        .set({
          title: input.title,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime)
        })
        .where(eq(pubEvents.id, id));

      await replaceChildren(tx, id, input);
    });
  }
}
