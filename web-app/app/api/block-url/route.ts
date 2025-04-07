import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { sites } from '@/db/sites';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { siteURL } = await req.json();

  try {
     await db
      .update(sites)
      .set({ isBlocked: true })
      .where(eq(sites.url, siteURL))
      .execute();

    return NextResponse.json(
      { message: "Site blocked successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Internal Server Error", error: e },
      { status: 500 }
    );
  }
}
