import { NextResponse } from 'next/server';
import { fetchPortalStars } from '@/lib/stars';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const stars = await fetchPortalStars();

    return NextResponse.json(stars, {
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
