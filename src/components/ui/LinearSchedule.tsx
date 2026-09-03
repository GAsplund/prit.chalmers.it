'use client';

import { useState, useEffect, useMemo } from 'react';
import { MdAccessTime } from 'react-icons/md';
import type { StaffSection } from '@/types/pub-crawl';

interface LinearScheduleProps {
  timeColumns: Date[];
  schedule: StaffSection[];
  eventEndTime: Date;
  selectedUser: string;
}

interface Assignment {
  time: Date;
  section: string;
}

export default function LinearSchedule({
  timeColumns,
  schedule,
  eventEndTime,
  selectedUser
}: LinearScheduleProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const assignments = useMemo(() => {
    if (!selectedUser) return [];
    const result: Assignment[] = [];
    for (const section of schedule) {
      for (const row of section.slots) {
        row.forEach((slot, colIdx) => {
          if (slot.name === selectedUser) {
            result.push({ time: timeColumns[colIdx], section: section.name });
          }
        });
      }
    }
    result.sort((a, b) => a.time.getTime() - b.time.getTime());
    return result;
  }, [schedule, timeColumns, selectedUser]);

  if (!selectedUser) {
    return (
      <p className="text-label-md italic text-on-surface-variant text-center py-lg">
        Välj en person i listan
      </p>
    );
  }

  if (assignments.length === 0) {
    return (
      <p className="text-label-md italic text-on-surface-variant text-center py-lg">
        Inga schemalagda pass hittades
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-xs">
      {assignments.map((item, idx) => {
        const nextItem = assignments.at(idx + 1);
        const isActive =
          now >= item.time &&
          (nextItem ? now < nextItem.time : true) &&
          now <= eventEndTime;

        return (
          <div
            key={`${item.section}-${item.time.toISOString()}-${idx}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <MdAccessTime
              size={16}
              className={
                isActive ? 'text-on-primary-container' : 'text-outline'
              }
            />
            <span className="text-label-md tracking-wider whitespace-nowrap">
              {item.time.toLocaleTimeString(['sv-SE'], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {item.section}
            </span>
          </div>
        );
      })}
    </div>
  );
}
