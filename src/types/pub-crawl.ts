export interface TimelinePhase {
  id: string;
  label: string;
  time: Date;
}

export interface FormTimelinePhase {
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

export interface ImportantContact {
  id: string;
  name: string;
  phoneNumber: string;
  description?: string;
}

export interface PubCrawlEvent {
  id: string;
  title: string;
  /** ISO datetime string */
  startTime: Date;
  /** ISO datetime string */
  endTime: Date;
  upcoming: boolean;
  /** Ordered list of timeline phases (prep → open → cleanup etc.) */
  phases: TimelinePhase[];
  /** Shared time-column headers across all schedule sections, e.g. ["19:00","20:00","23:00"] */
  timeColumns: Date[];
  /** Staff schedule sections (Släpp, Bar, Kök …) */
  schedule: StaffSection[];
  /** Ordered list of important contacts (112, security, etc.) */
  contacts: ImportantContact[];
  /** Last known costs for the event (in SEK) */
  costs: number;
  /** Last known revenue for the event (in SEK) */
  revenue: number;
  /** Revenue goal for the event (in SEK) */
  revenueGoal: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: PubCrawlEvent[] = [
  {
    id: '1',
    title: 'Höstpubrunda',
    startTime: new Date('2026-10-24T16:00'),
    endTime: new Date('2026-10-25T07:00'),
    upcoming: true,
    costs: 10000,
    revenue: 45000,
    revenueGoal: 50000,
    phases: [
      {
        id: 'p1',
        label: 'Genomgång och slutprepp',
        time: new Date('2026-10-24T16:00')
      },
      { id: 'p2', label: 'Öppet!', time: new Date('2026-10-24T17:31') },
      {
        id: 'p3',
        label: 'Stängning och städ',
        time: new Date('2026-10-25T02:00')
      }
    ],
    timeColumns: [
      new Date('2026-10-24T19:00'),
      new Date('2026-10-24T20:00'),
      new Date('2026-10-24T21:00'),
      new Date('2026-10-24T22:00'),
      new Date('2026-10-24T23:00')
    ],
    contacts: [
      {
        id: 'c1',
        name: '112',
        phoneNumber: '112',
        description: 'Vid nödsituation'
      },
      {
        id: 'c2',
        name: 'Cubsec',
        phoneNumber: '031-772 44 99',
        description: 'Ordningsvakter'
      },
      {
        id: 'c3',
        name: 'Lucas Lindberg',
        phoneNumber: '070-123 45 67',
        description: 'Serveringsansvarig'
      }
    ],
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
    startTime: new Date('2026-11-12T10:00'),
    endTime: new Date('2026-11-12T15:00'),
    upcoming: false,
    costs: 5000,
    revenue: 20000,
    revenueGoal: 25000,
    phases: [
      { id: 'p1', label: 'Förberedelse', time: new Date('2026-11-12T10:00') },
      { id: 'p2', label: 'Städning', time: new Date('2026-11-12T11:00') },
      { id: 'p3', label: 'Avslutning', time: new Date('2026-11-12T14:00') }
    ],
    timeColumns: [
      new Date('2026-11-12T10:00'),
      new Date('2026-11-12T11:00'),
      new Date('2026-11-12T12:00'),
      new Date('2026-11-12T13:00'),
      new Date('2026-11-12T14:00')
    ],
    contacts: [
      {
        id: 'c1',
        name: '112',
        phoneNumber: '112',
        description: 'Vid nödsituation'
      }
    ],
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
