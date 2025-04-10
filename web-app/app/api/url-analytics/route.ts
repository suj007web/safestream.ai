import { db } from '@/db/drizzle';
import { urls } from '@/db/urls'; 
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
              
    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());
    const userEmail = user?.email_addresses?.[0]?.email_address;
    const data = await db
    .select().from(urls).where(eq(urls.userEmail, userEmail as string));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching URL analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch URL analytics' }, { status: 500 });
  }
}
