import db from '@/db';
import { pubEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type {
  ZettlePurchase,
  ZettlePurchaseListResponse
} from '@/types/zettle';

const OAUTH_URL = 'https://oauth.zettle.com/token';
const PURCHASE_URL = 'https://purchase.izettle.com/purchases/v2';

let cachedToken: { value: string; expiresAt: number } | null = null;

function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const payload = jwt.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const apiKey = process.env.ZETTLE_API_KEY;
  if (!apiKey) throw new Error('ZETTLE_API_KEY is not configured');

  const claims = decodeJwtPayload(apiKey);
  const clientId = claims.iss ?? claims.client_id;
  if (!clientId || typeof clientId !== 'string') {
    throw new Error('Cannot extract client_id from ZETTLE_API_KEY');
  }

  const response = await fetch(OAUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_id: clientId,
      assertion: apiKey
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zettle OAuth failed (${response.status}): ${error}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000
  };

  return cachedToken.value;
}

async function zettleGetRequest<T>(url: string): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zettle request failed (${response.status}): ${error}`);
  }

  return response.json();
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, '');
}

export default class ZettleService {
  private static async getPurchases(
    startDate: Date,
    endDate: Date
  ): Promise<ZettlePurchase[]> {
    const purchases: ZettlePurchase[] = [];
    let hash: string | undefined;

    do {
      const url = new URL(PURCHASE_URL);
      url.searchParams.set('startDate', formatDate(startDate));
      url.searchParams.set('endDate', formatDate(endDate));
      url.searchParams.set('limit', '1000');
      if (hash) url.searchParams.set('lastPurchaseHash', hash);

      const data: ZettlePurchaseListResponse = await zettleGetRequest(
        url.toString()
      );
      purchases.push(...data.purchases);
      hash = data.lastPurchaseHash;
    } while (hash);

    return purchases;
  }

  static async updateRevenueFromZettle(eventId: string): Promise<number> {
    const event = await db.query.pubEvents.findFirst({
      where: { id: eventId }
    });

    if (!event) throw new Error('Event not found');

    const purchases = await ZettleService.getPurchases(
      event.startTime,
      event.endTime
    );

    const totalRevenue = purchases
      .filter((p) => !p.refund)
      .reduce((sum, p) => sum + p.totalAmount, 0);

    await db
      .update(pubEvents)
      .set({ lastKnownRevenue: totalRevenue })
      .where(eq(pubEvents.id, eventId));

    return totalRevenue;
  }
}
