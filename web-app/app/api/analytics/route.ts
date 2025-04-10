import { db } from '@/db/drizzle';
import { videos } from '@/db/video';
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
      const data = await db.select().from(videos).where(eq(videos.userEmail, userEmail as string));
      return NextResponse.json(data,
        {
            status: 200
        }
      );
    } catch (err) {
      console.error('Error fetching videos:', err);
      return NextResponse.json(
        { error: 'Failed to fetch videos' }
        ,
         { 
            status: 500 
        }
        );
    }
  }
