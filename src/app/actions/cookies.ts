'use server';

import { cookies } from 'next/headers';

export async function setLinearScheduleView(value: boolean) {
  const cookieStore = await cookies();
  cookieStore.set('linearScheduleView', value ? 'true' : 'false');
}
