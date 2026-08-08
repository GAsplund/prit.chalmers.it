import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
  check,
  index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';

// Pub Events

export const pubEvents = pgTable(
  'pub_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    startTime: timestamp('start_time', {
      withTimezone: true,
      mode: 'date'
    }).notNull(),
    endTime: timestamp('end_time', {
      withTimezone: true,
      mode: 'date'
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [
    check(
      'enforce_start_before_end',
      sql`${table.startTime} < ${table.endTime}`
    )
  ]
);

// Timeline Stages

export const timelineStages = pgTable(
  'timeline_stages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => pubEvents.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    startTime: timestamp('start_time', {
      withTimezone: true,
      mode: 'date'
    }).notNull(),
    order: integer('order').notNull()
  },
  (table) => [index('idx_timeline_stages_event').on(table.eventId)]
);

// Staff Sections

export const staffSections = pgTable(
  'staff_sections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => pubEvents.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    order: integer('order').notNull()
  },
  (table) => [unique('uniq_event_section_order').on(table.eventId, table.order)]
);

// Staff Rows

export const staffRows = pgTable(
  'staff_rows',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sectionId: uuid('section_id')
      .notNull()
      .references(() => staffSections.id, { onDelete: 'cascade' }),
    roleLabel: text('role_label'),
    order: integer('order').notNull()
  },
  (table) => [unique('uniq_section_row_order').on(table.sectionId, table.order)]
);

// Staff Slots

export const staffSlots = pgTable(
  'staff_slots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    rowId: uuid('row_id')
      .notNull()
      .references(() => staffRows.id, { onDelete: 'cascade' }),
    slotTime: timestamp('slot_time', {
      withTimezone: true,
      mode: 'date'
    }).notNull(),
    gammaUserId: uuid('gamma_user_id'),
    name: text('name')
  },
  (table) => [
    unique('uniq_row_time_slot').on(table.rowId, table.slotTime),
    check(
      'enforce_top_of_hour',
      sql`date_trunc('hour', ${table.slotTime}) = ${table.slotTime}`
    ),
    check(
      'mutually_exclusive_gamma_or_anonymous',
      sql`${table.gammaUserId} IS NULL OR ${table.name} IS NULL`
    ),
    index('idx_slots_gamma_user')
      .on(table.gammaUserId)
      .where(sql`${table.gammaUserId} IS NOT NULL`)
  ]
);
