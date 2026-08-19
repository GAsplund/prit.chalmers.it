'use server';

import { revalidatePath } from 'next/cache';
import PubCrawlService, {
  type PubCrawlInput
} from '@/services/pubCrawlService';
import UserService from '@/services/userService';

export async function createPubCrawl(input: PubCrawlInput) {
  if (!(await UserService.getIsPRIT())) {
    throw new Error('Unauthorized');
  }

  const id = await PubCrawlService.createPubCrawl(input);
  revalidatePath('/pub-crawl');
  return id;
}

export async function updatePubCrawl(id: string, input: PubCrawlInput) {
  if (!(await UserService.getIsPRIT())) {
    throw new Error('Unauthorized');
  }

  await PubCrawlService.updatePubCrawl(id, input);
  revalidatePath('/pub-crawl');
  revalidatePath(`/pub-crawl/${id}`);
}
