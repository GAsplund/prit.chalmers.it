'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/Card';
import Dialog from '@/components/ui/Dialog';
import { MdOutlineCalendarMonth, MdOpenInFull, MdClose } from 'react-icons/md';

interface Phase {
  id: string;
  label: string;
  time: Date;
}

interface UpcomingScheduleProps {
  phases: Phase[];
}

export default function UpcomingSchedule({ phases }: UpcomingScheduleProps) {
  const [now, setNow] = useState(() => new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingPhases = useMemo(() => {
    return phases.filter((p) => new Date(p.time) > now);
  }, [phases, now]);

  return (
    <>
      <div className="flex justify-between items-end mb-2">
        <h4 className="text-on-surface-variant">Kommande schema</h4>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-label-sm bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
        >
          <MdOpenInFull size={16} />
          Se hela schemat
        </button>
      </div>

      <Card
        variant="surface-variant"
        size="sm"
        className="flex overflow-x-auto gap-3 min-h-15"
      >
        {remainingPhases.length === 0 && (
          <h4 className="text-label-md italic flex-1 text-center">
            Inget mer för denna gången!
          </h4>
        )}

        {remainingPhases.map((phase) => (
          <Card
            size="chip"
            key={phase.id}
            className="flex items-center justify-center gap-2 pl-2 pr-4 py-2 shrink-0"
          >
            <MdOutlineCalendarMonth size={18} />
            <span className="text-label-sm tracking-wider">
              {phase.time.toTimeString().slice(0, 5)}
            </span>
            <h4 className="text-label-md text-on-surface">{phase.label}</h4>
          </Card>
        ))}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="max-w-[28rem]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-headline-md text-on-surface">Schema</h2>
          <button
            type="button"
            onClick={() => setDialogOpen(false)}
            aria-label="Stäng schema"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-sm">
          {phases.map((phase) => (
            <li
              key={phase.id}
              className="flex items-center gap-3 rounded-lg bg-surface-container px-md py-sm"
            >
              <span className="text-label-md tracking-wider text-on-surface-variant whitespace-nowrap">
                {new Date(phase.time).toTimeString().slice(0, 5)}
              </span>
              <h4 className="text-label-md text-on-surface">{phase.label}</h4>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
}
