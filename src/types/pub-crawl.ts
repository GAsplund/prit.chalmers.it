export interface TimelinePhase {
  id: string;
  label: string;
  time: string;
}

export interface StaffSlot {
  name: string; // empty string = unassigned
}

export interface StaffSection {
  id: string;
  name: string; // e.g. "Bar", "Släpp", "Kök"
  /** Number of staff rows in this section */
  rowCount: number;
  /** slots[rowIdx][colIdx] — columns align with the event-level timeColumns */
  slots: StaffSlot[][];
}

export interface PubCrawlEvent {
  id: string;
  title: string;
  /** ISO datetime string */
  startTime: string;
  /** ISO datetime string */
  endTime: string;
  upcoming: boolean;
  /** Ordered list of timeline phases (prep → open → cleanup etc.) */
  phases: TimelinePhase[];
  /** Shared time-column headers across all schedule sections, e.g. ["19:00","20:00","23:00"] */
  timeColumns: string[];
  /** Staff schedule sections (Släpp, Bar, Kök …) */
  schedule: StaffSection[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: PubCrawlEvent[] = [
  {
    id: '1',
    title: 'Höstpubrunda',
    startTime: '2026-10-24T16:00',
    endTime: '2026-10-25T07:00',
    upcoming: true,
    phases: [
      { id: 'p1', label: 'Genomgång och slutprepp', time: '16:00' },
      { id: 'p2', label: 'Öppet!', time: '17:31' },
      { id: 'p3', label: 'Stängning och städ', time: '02:00' }
    ],
    timeColumns: ['19:00', '20:00', '21:00', '22:00', '23:00'],
    schedule: [
      {
        id: 's1',
        name: 'Släpp',
        rowCount: 3,
        slots: [
          [
            { name: 'Anna K.' },
            { name: 'Anna K.' },
            { name: 'Erik M.' },
            { name: '' },
            { name: 'Erik M.' }
          ],
          [
            { name: '' },
            { name: 'Team Alpha (3 pax)' },
            { name: '' },
            { name: '' },
            { name: '' }
          ],
          [
            { name: 'Johan L. (Lead)' },
            { name: 'Maria S.' },
            { name: 'Maria S.' },
            { name: 'Johan L.' },
            { name: '' }
          ]
        ]
      },
      {
        id: 's2',
        name: 'Bar',
        rowCount: 1,
        slots: [
          [
            { name: 'Johan L. (Lead)' },
            { name: 'Maria S.' },
            { name: 'Maria S.' },
            { name: 'Johan L.' },
            { name: '' }
          ]
        ]
      },
      {
        id: 's3',
        name: 'Kök',
        rowCount: 1,
        slots: [
          [
            { name: '' },
            { name: 'Team Alpha (3 pax)' },
            { name: '' },
            { name: '' },
            { name: '' }
          ]
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Städdag Hubben',
    startTime: '2026-11-12T10:00',
    endTime: '2026-11-12T15:00',
    upcoming: false,
    phases: [
      { id: 'p1', label: 'Förberedelse', time: '10:00' },
      { id: 'p2', label: 'Städning', time: '11:00' },
      { id: 'p3', label: 'Avslutning', time: '14:00' }
    ],
    timeColumns: ['10:00', '11:00', '12:00', '13:00', '14:00'],
    schedule: [
      {
        id: 's1',
        name: 'Städ',
        rowCount: 2,
        slots: [
          [
            { name: 'Anna K.' },
            { name: 'Anna K.' },
            { name: '' },
            { name: '' },
            { name: '' }
          ],
          [
            { name: '' },
            { name: '' },
            { name: 'Erik M.' },
            { name: 'Erik M.' },
            { name: '' }
          ]
        ]
      }
    ]
  }
];
