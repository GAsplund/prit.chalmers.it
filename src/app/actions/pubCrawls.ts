'use server';

import { revalidatePath } from 'next/cache';
import PubCrawlService, {
  type PubCrawlInput
} from '@/services/pubCrawlService';
import ZettleService from '@/services/zettleService';
import UserService from '@/services/userService';

export async function createPubCrawl(input: PubCrawlInput) {
  if (!(await UserService.getIsPRIT())) {
    throw new Error('Unauthorized');
  }

  const id = await PubCrawlService.createPubCrawl(input);
  revalidatePath('/pub-crawl');
  revalidatePath(`/pub-crawl/${id}`);
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

export async function deletePubCrawl(id: string) {
  if (!(await UserService.getIsPRIT())) {
    throw new Error('Unauthorized');
  }

  await PubCrawlService.deletePubCrawl(id);
  revalidatePath('/pub-crawl');
}

export async function updateRevenueFromZettle(id: string) {
  if (!(await UserService.getIsPRIT())) {
    throw new Error('Unauthorized');
  }

  const revenue = await ZettleService.updateRevenueFromZettle(id);
  revalidatePath(`/pub-crawl/${id}`);
  return revenue;
}
