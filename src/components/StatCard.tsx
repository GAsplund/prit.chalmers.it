import type { IconType } from 'react-icons';
import Card from './Card';

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
      <Card
        variant="gradient"
        className="flex flex-col justify-between relative"
      >
        {/* Header row */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm bg-icon-highlight">
            <Icon size={20} />
          </div>
          {tag && (
            <span className="text-label-sm px-3 py-1 rounded-full bg-on-primary-container text-primary-container">
              {tag}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="relative z-10">
          <h2 className="font-black text-headline-xl">{value}</h2>
          <p className="opacity-90 font-semibold mt-1 text-body-lg">
            {description}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between">
      {/* Header row */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container text-secondary">
          <Icon size={20} />
        </div>
        <span className="text-label-sm px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
          {tag}
        </span>
      </div>

      {/* Value */}
      <div>
        <h2 className="text-headline-lg text-on-surface">{value}</h2>
        <p className="text-body-md text-outline">{description}</p>
      </div>
    </Card>
  );
}
