import GammaService from '@/services/gammaService';
import { GammaGroupMember } from '@/types/gamma';
import Card from './Card';

export default function MemberCard({
  user: { id, nick },
  post: { svName },
  unofficialPostName
}: GammaGroupMember) {
  const imageUrl = GammaService.getUserAvatarURL(id);

  return (
    <Card className="flex flex-row items-center gap-sm">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-highest text-on-surface-variant">
        <img
          src={imageUrl}
          alt={`${nick}'s avatar`}
          className="w-full h-full rounded-full"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-xs min-w-0">
        <span className="text-headline-md leading-tight truncate text-on-surface">
          {nick}
        </span>
        <span className="text-label-md truncate font-body text-on-surface-variant">
          {unofficialPostName ?? svName}
        </span>
      </div>
    </Card>
  );
}
