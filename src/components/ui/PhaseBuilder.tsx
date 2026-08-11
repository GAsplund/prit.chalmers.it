'use client';

import { useId } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { FormTimelinePhase } from '@/types/pub-crawl';
import FormField from './FormField';

interface PhaseBuilderProps {
  phases: FormTimelinePhase[];
  onChange: (phases: FormTimelinePhase[]) => void;
}

function newPhase(): FormTimelinePhase {
  return { id: crypto.randomUUID(), label: '', time: '' };
}

/**
 * Client component for editing an ordered list of timeline phases.
 * Each phase has a label and a start/end time. Phases can be added and removed.
 */
export default function PhaseBuilder({ phases, onChange }: PhaseBuilderProps) {
  const baseId = useId();

  function update(
    id: string,
    field: keyof Omit<FormTimelinePhase, 'id'>,
    value: string
  ) {
    onChange(phases.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function remove(id: string) {
    onChange(phases.filter((p) => p.id !== id));
  }

  function add() {
    onChange([...phases, newPhase()]);
  }

  return (
    <div className="flex flex-col gap-md">
      {phases.length === 0 && (
        <p className="text-body-md text-outline text-center py-sm">
          Inga faser tillagda än.
        </p>
      )}

      {phases.map((phase, idx) => (
        <div
          key={phase.id}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-md flex flex-col gap-sm"
        >
          {/* Row header */}
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant">
              Fas {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(phase.id)}
              aria-label={`Ta bort fas ${idx + 1}`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors"
            >
              <MdDelete size={18} />
            </button>
          </div>

          {/* Label */}
          <FormField
            id={`${baseId}-phase-${phase.id}-label`}
            label="Namn"
            type="text"
            placeholder="t.ex. Genomgång och slutprepp"
            value={phase.label}
            onChange={(e) => update(phase.id, 'label', e.target.value)}
          />

          {/* Time range */}
          <div className="grid grid-cols-2 gap-sm">
            <FormField
              id={`${baseId}-phase-${phase.id}-start`}
              label="Tid"
              type="datetime-local"
              value={phase.time}
              onChange={(e) => update(phase.id, 'time', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-dashed border-outline-variant text-label-md text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container-low transition-colors"
      >
        <MdAdd size={20} />
        Lägg till fas
      </button>
    </div>
  );
}
