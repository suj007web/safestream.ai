import { db } from '@/db/drizzle';
import { videos } from '@/db/video';

import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const data = await db.select().from(videos);
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
