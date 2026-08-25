import db from '@/db';
import {
  importantContacts,
  pubEvents,
  timelineStages,
  staffSections,
  staffRows,
  staffSlots
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type {
  ImportantContact,
  PubCrawlEvent,
  StaffSection
} from '@/types/pub-crawl';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

type DbEvent = Awaited<ReturnType<typeof PubCrawlService.getPubCrawlById>>;

function toPubCrawlEvent(event: NonNullable<DbEvent>): PubCrawlEvent {
  const seen = new Map<number, Date>();
  event.sections.forEach((section) =>
    section.rows.forEach((row) =>
      row.slots.forEach((slot) => {
        const t = slot.slotTime.getTime();
        if (!seen.has(t)) seen.set(t, slot.slotTime);
      })
    )
  );
  const timeColumns = [...seen.values()].sort(
    (a, b) => a.getTime() - b.getTime()
  );

  const schedule: StaffSection[] = event.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      name: section.name,
      rowCount: section.rows.length,
      slots: section.rows
        .sort((a, b) => a.order - b.order)
        .map((row) => {
          const byTime = new Map<number, string>();
          row.slots.forEach((s) =>
            byTime.set(s.slotTime.getTime(), s.name ?? '')
          );
          return timeColumns.map((col) => ({
            name: byTime.get(col.getTime()) ?? ''
          }));
        })
    }));

  return {
    id: event.id,
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime,
    upcoming: event.startTime > new Date(),
    phases: event.stages
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .map((stage) => ({
        id: stage.id,
        label: stage.label,
        time: stage.startTime
      })),
    contacts: event.contacts
      .sort((a, b) => a.order - b.order)
      .map((contact) => ({
        id: contact.id,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        description: contact.description ?? undefined
      })),
    timeColumns,
    schedule,
    costs: event.lastKnownCosts,
    revenue: event.lastKnownRevenue,
    revenueGoal: event.revenueGoal
  };
}

export { toPubCrawlEvent };

export interface PubCrawlInput {
  title: string;
  startTime: Date;
  endTime: Date;
  phases: { id: string; label: string; time: Date }[];
  timeColumns: Date[];
  schedule: {
    id: string;
    name: string;
    slots: { name: string }[][];
  }[];
  contacts: Omit<ImportantContact, 'id'>[];
  costs: number;
  revenueGoal: number;
}

async function replaceChildren(tx: Tx, eventId: string, input: PubCrawlInput) {
  await tx.delete(timelineStages).where(eq(timelineStages.eventId, eventId));
  await tx.delete(staffSections).where(eq(staffSections.eventId, eventId));
  await tx
    .delete(importantContacts)
    .where(eq(importantContacts.eventId, eventId));

  for (const phase of input.phases) {
    await tx.insert(timelineStages).values({
      id: phase.id,
      eventId,
      label: phase.label,
      startTime: phase.time
    });
  }

  for (const [contactIdx, contact] of input.contacts.entries()) {
    await tx.insert(importantContacts).values({
      eventId,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      description: contact.description ?? null,
      order: contactIdx
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

      const slots = row
        .map((slot, cIdx) => {
          if (!slot.name) return null;
          const slotTime = new Date(input.timeColumns[cIdx]);
          slotTime.setSeconds(0, 0);
          return {
            rowId,
            slotTime,
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
  static async getOngoingPubCrawls() {
    return db.query.pubEvents.findMany({
      where: {
        startTime: {
          lte: new Date()
        },
        endTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  static async getUpcomingPubCrawls() {
    return db.query.pubEvents.findMany({
      where: {
        endTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  static async getPastPubCrawls() {
    return db.query.pubEvents.findMany({
      where: {
        endTime: {
          lt: new Date()
        }
      },
      orderBy: {
        startTime: 'desc'
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
        contacts: true,
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
        endTime: new Date(input.endTime),
        lastKnownCosts: input.costs,
        revenueGoal: input.revenueGoal
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
          endTime: new Date(input.endTime),
          lastKnownCosts: input.costs,
          revenueGoal: input.revenueGoal
        })
        .where(eq(pubEvents.id, id));

      await replaceChildren(tx, id, input);
    });
  }

  static async deletePubCrawl(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(pubEvents).where(eq(pubEvents.id, id));
    });
  }
}
