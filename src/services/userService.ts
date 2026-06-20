import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import GammaService from './gammaService';

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

/**
 * Service for handling the session of the current user
 */
export default class UserService {
  private static async getSession() {
    return await auth.api.getSession({
      headers: await headers()
    });
  }

  static async getUser(s?: Session | null) {
    const session = s ?? (await this.getSession());
    return session?.user ?? null;
  }

  static async getIsPRIT(s?: Session | null) {
    const session = s ?? (await this.getSession());

    const userId = session?.user?.externalId;
    if (!userId) return false;

    const gammaUser = await GammaService.getUser(userId);
    return gammaUser.groups.some(
      (g) => g.group.superGroup.id === process.env.PRIT_GAMMA_SUPER_GROUP_ID
    );
  }
}
