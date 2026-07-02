/**
 * FormField — reusable outlined input / textarea / select.
 *
 * Uses design tokens via Tailwind utility classes only (no inline styles).
 * Matches the app's outlined card style: rounded-lg, border-outline-variant,
 * bg-surface-container-low.
 */

import type { ComponentPropsWithoutRef } from 'react';

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

type InputProps = BaseProps &
  ComponentPropsWithoutRef<'input'> & {
    as?: 'input';
  };

type TextareaProps = BaseProps &
  ComponentPropsWithoutRef<'textarea'> & {
    as: 'textarea';
  };

type SelectProps = BaseProps &
  ComponentPropsWithoutRef<'select'> & {
    as: 'select';
    children: React.ReactNode;
  };

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export default function FormField(props: FormFieldProps) {
  const { label, hint, error, className = '', as: Tag = 'input', ...rest } = props;

  const inputClasses = [
    'w-full rounded-lg border px-4 py-3',
    'bg-surface-container-low text-on-surface text-body-md',
    'placeholder:text-outline',
    'focus:outline-none focus:ring-2 focus:ring-primary/40',
    error
      ? 'border-error focus:border-error'
      : 'border-outline-variant focus:border-primary',
    'transition-colors',
    Tag === 'textarea' ? 'resize-y min-h-24' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const id = typeof rest.id === 'string' ? rest.id : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-label-md text-on-surface-variant"
      >
        {label}
      </label>

      {/* @ts-expect-error — union spread is safe here */}
      <Tag id={id} className={inputClasses} {...rest} />

      {hint && !error && (
        <p className="text-label-sm text-outline">{hint}</p>
      )}
      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}
    </div>
  );
}
