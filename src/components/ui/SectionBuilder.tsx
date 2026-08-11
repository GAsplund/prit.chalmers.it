'use client';

import { MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md';
import type { StaffSection, StaffSlot } from '@/types/pub-crawl';
import React, { useState } from 'react';

interface SectionBuilderProps {
  /** Derived "HH:MM" labels for each column, read-only */
  columnLabels: string[];
  sections: StaffSection[];
  onSectionsChange: (sections: StaffSection[]) => void;
  onAddColumn: () => void;
  onRemoveColumn: (idx: number) => void;
}

function newSection(colCount: number): StaffSection {
  return {
    id: crypto.randomUUID(),
    name: '',
    rowCount: 1,
    slots: [Array.from({ length: colCount }, () => ({ name: '' }))]
  };
}

function createEmptyRow(colCount: number): StaffSlot[] {
  return Array.from({ length: colCount }, (): StaffSlot => ({ name: '' }));
}

const inputBase =
  'w-full rounded border border-outline-variant/40 bg-surface-container-lowest px-2 py-1.5 text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors text-label-sm';

export default function SectionBuilder({
  columnLabels,
  sections,
  onSectionsChange,
  onAddColumn,
  onRemoveColumn
}: SectionBuilderProps) {
  const [draggedRow, setDraggedRow] = useState<{
    sectionId: string;
    rowIdx: number;
  } | null>(null);

  // ── Section helpers ──────────────────────────────────────────────────────────

  function updateSectionName(id: string, value: string) {
    onSectionsChange(
      sections.map((s) => (s.id === id ? { ...s, name: value } : s))
    );
  }

  function addSectionRow(id: string, afterRowIdx: number) {
    onSectionsChange(
      sections.map((section) => {
        if (section.id !== id) return section;
        const slots = [...section.slots];
        slots.splice(afterRowIdx + 1, 0, createEmptyRow(columnLabels.length));
        return {
          ...section,
          rowCount: slots.length,
          slots
        };
      })
    );
  }

  function removeSectionRow(id: string, rowIdx: number) {
    onSectionsChange(
      sections.map((section) => {
        if (section.id !== id || section.slots.length <= 1) return section;
        const slots = section.slots.filter((_, idx) => idx !== rowIdx);
        return {
          ...section,
          rowCount: slots.length,
          slots
        };
      })
    );
  }

  function moveSectionRow(id: string, fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;

    onSectionsChange(
      sections.map((section) => {
        if (section.id !== id) return section;
        const slots = [...section.slots];
        const [row] = slots.splice(fromIdx, 1);
        slots.splice(toIdx, 0, row);
        return {
          ...section,
          rowCount: slots.length,
          slots
        };
      })
    );
    setDraggedRow(null);
  }

  function removeSection(id: string) {
    onSectionsChange(sections.filter((s) => s.id !== id));
  }

  function addSection() {
    onSectionsChange([...sections, newSection(columnLabels.length)]);
  }

  function updateSlot(
    sectionId: string,
    rowIdx: number,
    colIdx: number,
    value: string
  ) {
    onSectionsChange(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        const slots = s.slots.map((row, r) =>
          r === rowIdx
            ? row.map((slot, c) => (c === colIdx ? { name: value } : slot))
            : row
        );
        return { ...s, slots };
      })
    );
  }

  // total columns: 1 (station stub) + N (time cols) + 1 (add-col)
  const totalCols = 1 + columnLabels.length + 1;

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
      <table className="w-full border-collapse text-label-sm">
        {/* ── Header: time column labels ─────────────────────────────────── */}
        <thead>
          <tr className="border-b border-outline-variant/40">
            {/* Stub cell */}
            <th className="bg-surface-container px-3 py-2 text-left text-on-surface-variant font-semibold whitespace-nowrap border-r border-outline-variant/30">
              Station / Rader
            </th>

            {/* One label per column */}
            {columnLabels.map((label, idx) => (
              <th
                key={idx}
                className="bg-surface-container px-3 py-2 text-center border-r border-outline-variant/20 min-w-[80px]"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-on-surface-variant font-medium">
                    {label}
                  </span>
                  {columnLabels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveColumn(idx)}
                      aria-label={`Ta bort kolumn ${label}`}
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors"
                    >
                      <MdDelete size={12} />
                    </button>
                  )}
                </div>
              </th>
            ))}

            {/* Add-column cell */}
            <th className="bg-surface-container px-2 py-2 text-center w-10">
              <button
                type="button"
                onClick={onAddColumn}
                aria-label="Lägg till tidskolumn"
                className="w-7 h-7 rounded-full flex items-center justify-center text-primary border border-primary/40 hover:bg-surface-container-low transition-colors mx-auto"
              >
                <MdAdd size={16} />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {sections.length === 0 && (
            <tr>
              <td
                colSpan={totalCols}
                className="py-sm text-center text-body-md text-outline"
              >
                Inga stationer tillagda än.
              </td>
            </tr>
          )}

          {sections.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              {/* ── Section header row ─────────────────────────────────── */}
              <tr
                key={`header-${section.id}`}
                className="bg-surface-container border-y border-outline-variant/40"
              >
                {/* Span remaining columns with a subtle label */}
                <td
                  colSpan={columnLabels.length + 1}
                  className="px-3 py-2 text-outline border-r border-outline-variant/30"
                >
                  <input
                    type="text"
                    placeholder="Stationsnamn"
                    value={section.name}
                    onChange={(e) =>
                      updateSectionName(section.id, e.target.value)
                    }
                    aria-label={`Namn på station ${sIdx + 1}`}
                    className={inputBase + ' flex-1'}
                  />
                </td>

                {/* Station delete */}
                <td className="px-3 py-2 border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    aria-label={`Ta bort ${section.name || `station ${sIdx + 1}`}`}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors"
                  >
                    <MdDelete size={16} />
                  </button>
                </td>
              </tr>

              {/* ── Staff rows ─────────────────────────────────────────── */}
              {section.slots.map((row, rIdx) => (
                <React.Fragment key={`${section.id}-row-${rIdx}`}>
                  <tr
                    className="border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedRow?.sectionId !== section.id) return;
                      moveSectionRow(section.id, draggedRow.rowIdx, rIdx);
                    }}
                  >
                    {/* Drag handle */}
                    <td
                      draggable
                      onDragStart={() =>
                        setDraggedRow({
                          sectionId: section.id,
                          rowIdx: rIdx
                        })
                      }
                      onDragEnd={() => setDraggedRow(null)}
                      aria-label={`Dra ${section.name || `station ${sIdx + 1}`} rad ${rIdx + 1}`}
                      className="px-3 py-1.5 text-outline text-center border-r border-outline-variant/30 cursor-grab active:cursor-grabbing"
                    >
                      <MdDragIndicator size={18} />
                    </td>

                    {/* Slot inputs */}
                    {row.map((slot, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-1.5 py-1.5 border-r border-outline-variant/20 last:border-r-0"
                      >
                        <input
                          type="text"
                          placeholder="–"
                          value={slot.name}
                          onChange={(e) =>
                            updateSlot(section.id, rIdx, cIdx, e.target.value)
                          }
                          aria-label={`${section.name || `Station ${sIdx + 1}`} rad ${rIdx + 1} kol. ${cIdx + 1}`}
                          className={inputBase}
                        />
                      </td>
                    ))}

                    {/* Remove row button */}
                    <td className="px-3 py-2 border-outline-variant/30">
                      <button
                        type="button"
                        disabled={section.slots.length <= 1}
                        onClick={() => removeSectionRow(section.id, rIdx)}
                        aria-label={`Ta bort ${section.name || `station ${sIdx + 1}`} rad ${rIdx + 1}`}
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors disabled:cursor-not-allowed disabled:text-outline disabled:hover:bg-transparent"
                      >
                        <MdDelete size={16} />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              {section.slots.length > 0 && (
                <tr className="border-b border-outline-variant/20 last:border-outline-variant/40">
                  <td />
                  <td colSpan={columnLabels.length} className="px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        addSectionRow(section.id, section.slots.length - 1)
                      }
                      className="flex w-full items-center gap-3 rounded-md border border-dashed border-outline-variant/50 px-4 py-2 text-left text-label-md text-on-surface-variant transition-colors hover:border-primary/60 hover:bg-surface-container-low"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant/50 text-primary">
                        <MdAdd size={16} />
                      </span>
                      <span>Lägg till rad</span>
                    </button>
                  </td>
                  <td />
                </tr>
              )}
            </React.Fragment>
          ))}

          {/* ── Add-section footer row ──────────────────────────────────────── */}
          <tr className="border-t border-outline-variant/40">
            <td colSpan={totalCols} className="py-2 px-3">
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                <MdAdd size={18} />
                Lägg till station
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
