import type { IconType } from 'react-icons';

export interface StatCardProps {
  Icon: IconType;
  tag?: string;
  value: string;
  description?: string;
  highlight?: boolean;
}

export default function StatCard({
  Icon,
  tag,
  value,
  description,
  highlight = false
}: StatCardProps) {
  if (highlight) {
    return (
      <div
        className="rounded-xl p-md ambient-shadow flex flex-col justify-between relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-container), var(--color-secondary-fixed))',
          color: 'var(--color-on-primary-container)'
        }}
      >
        {/* Header row */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
            style={{
              background:
                'color-mix(in srgb, var(--color-on-primary-container) 10%, transparent)'
            }}
          >
            <Icon size={20} />
          </div>
          {tag && (
            <span
              className="text-label-sm px-3 py-1 rounded-full"
              style={{
                background: 'var(--color-on-primary-container)',
                color: 'var(--color-primary-container)'
              }}
            >
              {tag}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="relative z-10">
          <h2
            className="font-black"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'var(--text-headline-xl)',
              lineHeight: 'var(--text-headline-xl--line-height)',
              letterSpacing: 'var(--text-headline-xl--letter-spacing)',
              fontWeight: 'var(--text-headline-xl--font-weight)'
            }}
          >
            {value}
          </h2>
          <p
            className="opacity-90 font-semibold mt-1"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 'var(--text-body-lg--line-height)'
            }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-md ambient-shadow flex flex-col justify-between border border-outline-variant/20"
      style={{ background: 'var(--color-surface-container-lowest)' }}
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'var(--color-surface-container)',
            color: 'var(--color-secondary)'
          }}
        >
          <Icon size={20} />
        </div>
        <span
          className="text-label-sm px-3 py-1 rounded-full"
          style={{
            background: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)'
          }}
        >
          {tag}
        </span>
      </div>

      {/* Value */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'var(--text-headline-lg)',
            lineHeight: 'var(--text-headline-lg--line-height)',
            letterSpacing: 'var(--text-headline-lg--letter-spacing)',
            fontWeight: 'var(--text-headline-lg--font-weight)',
            color: 'var(--color-on-surface)'
          }}
        >
          {value}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--text-body-md--line-height)',
            color: 'var(--color-outline)'
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
