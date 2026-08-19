'use client';

import { useId } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { ImportantContact } from '@/types/pub-crawl';
import FormField from './FormField';

interface ContactBuilderProps {
  contacts: ImportantContact[];
  onChange: (contacts: ImportantContact[]) => void;
}

function newContact(): ImportantContact {
  return { id: crypto.randomUUID(), name: '', phoneNumber: '', description: '' };
}

/**
 * Client component for editing an ordered list of important contacts.
 * Each contact has a name, phone number and optional description.
 */
export default function ContactBuilder({
  contacts,
  onChange
}: ContactBuilderProps) {
  const baseId = useId();

  function update(id: string, field: string, value: string) {
    onChange(
      contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function remove(id: string) {
    onChange(contacts.filter((c) => c.id !== id));
  }

  function add() {
    onChange([...contacts, newContact()]);
  }

  return (
    <div className="flex flex-col gap-md">
      {contacts.length === 0 && (
        <p className="text-body-md text-outline text-center py-sm">
          Inga kontakter tillagda än.
        </p>
      )}

      {contacts.map((contact, idx) => (
        <div
          key={contact.id}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-md flex flex-col gap-sm"
        >
          {/* Row header */}
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant">
              Kontakt {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(contact.id)}
              aria-label={`Ta bort kontakt ${idx + 1}`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors"
            >
              <MdDelete size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <FormField
              id={`${baseId}-contact-${contact.id}-name`}
              label="Namn"
              type="text"
              placeholder="t.ex. Cubsec"
              required
              value={contact.name}
              onChange={(e) => update(contact.id, 'name', e.target.value)}
            />
            <FormField
              id={`${baseId}-contact-${contact.id}-phone`}
              label="Telefonnummer"
              type="tel"
              placeholder="t.ex. 031-772 44 99"
              required
              value={contact.phoneNumber}
              onChange={(e) =>
                update(contact.id, 'phoneNumber', e.target.value)
              }
            />
          </div>
          <FormField
            id={`${baseId}-contact-${contact.id}-desc`}
            label="Beskrivning"
            type="text"
            placeholder="t.ex. Ordningsvakter"
            value={contact.description ?? ''}
            onChange={(e) => update(contact.id, 'description', e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-dashed border-outline-variant text-label-md text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container-low transition-colors"
      >
        <MdAdd size={20} />
        Lägg till kontakt
      </button>
    </div>
  );
}