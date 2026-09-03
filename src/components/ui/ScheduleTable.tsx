'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MdPerson, MdViewList } from 'react-icons/md';
import type { StaffSection } from '@/types/pub-crawl';
import LinearSchedule from './LinearSchedule';

interface ScheduleTableProps {
  timeColumns: Date[];
  schedule: StaffSection[];
  eventEndTime: Date;
  currentUserName?: string;
}

export default function ScheduleTable({
  timeColumns,
  schedule,
  eventEndTime,
  currentUserName
}: ScheduleTableProps) {
  const [now, setNow] = useState(() => new Date());
  const [linearView, setLinearView] = useState(false);

  const uniqueNames = useMemo(() => {
    const names = new Set<string>();
    for (const section of schedule) {
      for (const row of section.slots) {
        for (const slot of row) {
          if (slot.name) names.add(slot.name);
        }
      }
    }
    return [...names].sort();
  }, [schedule]);

  const [selectedUser, setSelectedUser] = useState<string>(() => {
    if (currentUserName && uniqueNames.includes(currentUserName)) {
      return currentUserName;
    }
    return '';
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeColumnIndex = useMemo(() => {
    return now > eventEndTime ||
      now < timeColumns[0] ||
      timeColumns.length === 0
      ? -1
      : timeColumns.findLastIndex((colTime) => now >= colTime);
  }, [timeColumns, now, eventEndTime]);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <MdPerson size={20} className="text-on-surface-variant" />
        <select
          autoComplete="off"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 rounded-full text-label-sm bg-surface-container-low text-on-surface-variant border border-outline-variant/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Ingen</option>
          {uniqueNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setLinearView((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-label-sm font-semibold transition-colors border ${
            linearView
              ? 'bg-primary-container text-on-primary-container border-primary/40'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container'
          }`}
        >
          <MdViewList size={16} />
          Visa som lista
        </button>
      </div>

      {linearView ? (
        <LinearSchedule
          timeColumns={timeColumns}
          schedule={schedule}
          eventEndTime={eventEndTime}
          selectedUser={selectedUser}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-surface-variant">
                {timeColumns.map((col, colIdx) => (
                  <th
                    key={col.getTime()}
                    className={`text-label-md text-center p-sm transition-colors ${
                      colIdx === activeColumnIndex
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {col.toLocaleTimeString(['sv-SE'], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedule.map((section) => (
                <React.Fragment key={section.id}>
                  <tr>
                    <td
                      colSpan={timeColumns.length}
                      className="text-headline-sm text-center font-bold p-xs sticky left-0 bg-surface-container-low z-10 border-b border-t border-surface-variant font-headline"
                    >
                      {section.name}
                    </td>
                  </tr>
                  {section.slots.map((row, rIdx) => (
                    <tr
                      key={`${section.id}-row-${rIdx}`}
                      className="border-surface-variant hover:bg-surface-container/50 transition-colors divide-x"
                    >
                      {row.map((slot, cIdx) => {
                        const isSelected =
                          selectedUser && slot.name === selectedUser;
                        const isActiveColumn = cIdx === activeColumnIndex;

                        return (
                          <td
                            key={`${section.id}-${rIdx}-${cIdx}`}
                            className={`text-center border-surface-variant p-sm text-label-sm transition-colors text-nowrap ${
                              isSelected
                                ? 'bg-primary-container text-on-primary-container font-semibold'
                                : isActiveColumn
                                  ? 'bg-primary/5'
                                  : ''
                            } ${slot.name ? '' : 'text-on-surface-variant italic'}`}
                          >
                            {slot.name || 'Ej tilldelad'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
