'use server';

import { revalidatePath } from 'next/cache';
import PubCrawlService, {
  type PubCrawlInput
} from '@/services/pubCrawlService';

export async function createPubCrawl(input: PubCrawlInput) {
  const id = await PubCrawlService.createPubCrawl(input);
  revalidatePath('/pub-crawl');
  return id;
}

export async function updatePubCrawl(id: string, input: PubCrawlInput) {
  await PubCrawlService.updatePubCrawl(id, input);
  revalidatePath('/pub-crawl');
  revalidatePath(`/pub-crawl/${id}`);
}
