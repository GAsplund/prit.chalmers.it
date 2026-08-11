'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/Card';
import { MdCalendarToday, MdCheck, MdHourglassBottom } from 'react-icons/md';
import { TimelinePhase } from '@/types/pub-crawl';

interface PubCrawlProgressProps {
  phases: TimelinePhase[];
  endTime: Date;
}

export default function PubCrawlProgress({
  phases,
  endTime
}: PubCrawlProgressProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedPhases = useMemo(
    () => phases.map((p) => ({ ...p, time: new Date(p.time) })),
    [phases]
  );
  const parsedEndTime = useMemo(() => new Date(endTime), [endTime]);

  const currentPhase = useMemo(() => {
    return parsedPhases.find((phase) => {
      const idx = parsedPhases.indexOf(phase);
      const nextPhaseTime = parsedPhases[idx + 1]?.time ?? parsedEndTime;
      return now >= phase.time && now < nextPhaseTime;
    });
  }, [parsedPhases, parsedEndTime, now]);

  const nextPhase = useMemo(() => {
    if (!currentPhase) return undefined;
    const idx = parsedPhases.indexOf(currentPhase);
    return parsedPhases[idx + 1];
  }, [parsedPhases, currentPhase]);

  const phaseCompletionPercentage = useMemo(() => {
    if (!currentPhase) return 0;
    const duration = nextPhase
      ? nextPhase.time.getTime() - currentPhase.time.getTime()
      : parsedEndTime.getTime() - currentPhase.time.getTime();
    const elapsed = now.getTime() - currentPhase.time.getTime();
    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  }, [currentPhase, nextPhase, parsedEndTime, now]);

  const eventCompleted = now > parsedEndTime;

  const timeUntilStart = useMemo(() => {
    if (phases[0].time < now) return 0;
    return Math.max(0, new Date(phases[0].time).getTime() - now.getTime());
  }, [phases, now]);

  return (
    <Card
      variant="surface"
      size="md"
      className="flex-1 flex flex-col items-center justify-center gap-4 min-w-0"
    >
      {currentPhase ? (
        <>
          <p className="text-body-md text-on-primary-container truncate">
            {currentPhase.time.toTimeString().slice(0, 5)} -{' '}
            {nextPhase
              ? nextPhase.time.toTimeString().slice(0, 5)
              : parsedEndTime.toTimeString().slice(0, 5)}
          </p>
          <div className="relative w-22 h-22 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-surface-variant"
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle
                className="text-primary-container"
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="currentColor"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 * (1 - phaseCompletionPercentage / 100)}
                strokeLinecap="round"
                strokeWidth="6"
                suppressHydrationWarning
              />
            </svg>
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-primary-container border-surface-container-lowest text-on-primary-container">
              <MdCalendarToday size={32} />
            </div>
          </div>
          <h2 className="text-headline-md text-on-primary-container wrap text-center">
            {currentPhase.label}
          </h2>
        </>
      ) : (
        <>
          {!eventCompleted && (
            <p
              className="text-body-md text-on-primary-container truncate"
              suppressHydrationWarning
            >
              {new Date(timeUntilStart).toISOString().slice(11, 19)}
            </p>
          )}
          <div className="relative w-22 h-22 flex items-center justify-center">
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-primary-container border-surface-container-lowest text-on-primary-container">
              {eventCompleted ? (
                <MdCheck className="text-success" size={32} />
              ) : (
                <MdHourglassBottom className="animate-pulse" size={32} />
              )}
            </div>
          </div>
          <h2 className="text-headline-md text-on-primary-container truncate">
            {eventCompleted ? 'Avslutad' : 'Väntar på start'}
          </h2>
        </>
      )}
    </Card>
  );
}
