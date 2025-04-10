import { db } from '@/db/drizzle';
import { videos } from '@/db/video';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { userId } = await auth();
              
    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());
    const userEmail = user?.email_addresses?.[0]?.email_address;
    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    await db.delete(videos).where(and(eq(videos.id, id), eq(videos.userEmail, userEmail)));

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
