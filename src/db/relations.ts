import { defineRelations } from 'drizzle-orm/relations';
import * as schema from './schema';

export default defineRelations(schema, (r) => ({
  pubEvents: {
    stages: r.many.timelineStages(),
    sections: r.many.staffSections()
  },
  timelineStages: {
    event: r.one.pubEvents({
      from: [r.timelineStages.eventId],
      to: [r.pubEvents.id]
    })
  },
  staffSections: {
    event: r.one.pubEvents({
      from: [r.staffSections.eventId],
      to: [r.pubEvents.id]
    }),
    rows: r.many.staffRows()
  },
  staffRows: {
    section: r.one.staffSections({
      from: [r.staffRows.sectionId],
      to: [r.staffSections.id]
    }),
    slots: r.many.staffSlots()
  },
  staffSlots: {
    row: r.one.staffRows({
      from: [r.staffSlots.rowId],
      to: [r.staffRows.id]
    })
  }
}));
