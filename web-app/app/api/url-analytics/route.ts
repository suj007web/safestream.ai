import { db } from '@/db/drizzle';
import { urls } from '@/db/urls'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db
    .select().from(urls);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching URL analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch URL analytics' }, { status: 500 });
  }
}
