import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  importantContacts,
  pubEvents,
  staffRows,
  staffSections,
  staffSlots,
  timelineStages
} from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle({ client: pool });

const SLOT_DATE = '2026-10-24';
const TZ = '+02:00';

const gammaUser = (seq: number) =>
  `00000000-0000-4000-8000-${seq.toString().padStart(12, '0')}`;

const gammaUsers = {
  anna: gammaUser(1),
  erik: gammaUser(2),
  johan: gammaUser(3),
  maria: gammaUser(4)
};

const slotTime = (hour: number) =>
  new Date(`${SLOT_DATE}T${String(hour).padStart(2, '0')}:00:00${TZ}`);

type Assignment =
  | { kind: 'user'; userId: string }
  | { kind: 'name'; name: string };

const U = (userId: string): Assignment => ({ kind: 'user', userId });
const N = (name: string): Assignment => ({ kind: 'name', name });

interface RowDef {
  hours: number[];
  assignments: Record<number, Assignment>;
}

interface SectionDef {
  name: string;
  rows: RowDef[];
}

const barRow: RowDef = {
  hours: [19, 20, 21, 22, 23],
  assignments: {
    19: U(gammaUsers.johan),
    20: U(gammaUsers.maria),
    21: U(gammaUsers.maria),
    22: N('Johan L.')
  }
};

const sectionDefs: SectionDef[] = [
  {
    name: 'Släpp',
    rows: [
      {
        hours: [19, 20, 21, 22, 23],
        assignments: {
          19: U(gammaUsers.anna),
          20: U(gammaUsers.anna),
          21: U(gammaUsers.erik),
          23: U(gammaUsers.erik)
        }
      },
      {
        hours: [19, 20, 21, 22, 23],
        assignments: { 20: N('Team Alpha (3 pax)') }
      },
      {
        hours: [19, 20, 21, 22, 23],
        assignments: {
          19: N('Johan L. (Lead)'),
          20: U(gammaUsers.maria),
          21: U(gammaUsers.maria),
          22: N('Johan L.')
        }
      }
    ]
  },
  { name: 'Bar', rows: [barRow] },
  {
    name: 'Kök',
    rows: [
      {
        hours: [19, 20, 21, 22, 23],
        assignments: { 20: N('Team Alpha (3 pax)') }
      }
    ]
  }
];

async function seed() {
  await db.transaction(async (tx) => {
    await tx.delete(staffSlots);
    await tx.delete(staffRows);
    await tx.delete(staffSections);
    await tx.delete(timelineStages);
    await tx.delete(importantContacts);

    const [event] = await tx
      .insert(pubEvents)
      .values({
        title: 'Höstpubrunda',
        startTime: new Date(`2026-10-24T16:00:00${TZ}`),
        endTime: new Date(`2026-10-25T02:00:00${TZ}`),
        lastKnownCosts: 25000,
        lastKnownRevenue: 10000,
        revenueGoal: 50000
      })
      .returning();

    await tx.insert(importantContacts).values([
      {
        eventId: event.id,
        name: '112',
        phoneNumber: '112',
        description: 'Vid nödsituation',
        order: 0
      },
      {
        eventId: event.id,
        name: 'Cubsec',
        phoneNumber: '031-772 44 99',
        description: 'Ordningsvakter',
        order: 1
      },
      {
        eventId: event.id,
        name: 'Lucas Lindberg',
        phoneNumber: '070-123 45 67',
        description: 'Serveringsansvarig',
        order: 2
      }
    ]);

    await tx.insert(timelineStages).values([
      {
        eventId: event.id,
        label: 'Genomgång och slutprepp',
        startTime: new Date(`2026-10-24T16:00:00${TZ}`)
      },
      {
        eventId: event.id,
        label: 'Öppet!',
        startTime: new Date(`2026-10-24T17:31:00${TZ}`)
      },
      {
        eventId: event.id,
        label: 'Stängning och städ',
        startTime: new Date(`2026-10-25T02:00:00${TZ}`)
      }
    ]);

    for (const [sectionIdx, sectionDef] of sectionDefs.entries()) {
      const [section] = await tx
        .insert(staffSections)
        .values({ eventId: event.id, name: sectionDef.name, order: sectionIdx })
        .returning();

      for (const [rowIdx, rowDef] of sectionDef.rows.entries()) {
        const [row] = await tx
          .insert(staffRows)
          .values({ sectionId: section.id, order: rowIdx })
          .returning();

        const slots = rowDef.hours
          .filter((hour) => rowDef.assignments[hour])
          .map((hour) => {
            const assignment = rowDef.assignments[hour];
            return {
              rowId: row.id,
              slotTime: slotTime(hour),
              gammaUserId:
                assignment.kind === 'user' ? assignment.userId : null,
              name: assignment.kind === 'name' ? assignment.name : null
            };
          });

        if (slots.length > 0) {
          await tx.insert(staffSlots).values(slots);
        }
      }
    }
  });

  console.log('Seed complete.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => pool.end());
