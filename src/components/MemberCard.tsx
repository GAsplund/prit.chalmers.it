import GammaService from '@/services/gammaService';
import { GammaGroupMember } from '@/types/gamma';

export default function MemberCard({
  user: { id, nick },
  post: { svName },
  unofficialPostName
}: GammaGroupMember) {
  const imageUrl = GammaService.getUserAvatarURL(id);

  return (
    <div
      className="flex flex-row items-center gap-sm p-md rounded-xl border border-outline-variant/20 ambient-shadow"
      style={{ background: 'var(--color-surface-container-low)' }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'var(--color-surface-container-highest)',
          color: 'var(--color-on-surface-variant)'
        }}
      >
        <img
          src={imageUrl}
          alt={`${nick}'s avatar`}
          className="w-full h-full rounded-full"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-xs min-w-0">
        <span
          className="text-headline-md leading-tight truncate"
          style={{
            fontFamily: 'var(--font-headline)',
            color: 'var(--color-on-surface)'
          }}
        >
          {nick}
        </span>

        <span
          className="text-label-md truncate"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-on-surface-variant)'
          }}
        >
          {unofficialPostName ?? svName}
        </span>
      </div>
    </div>
  );
}
