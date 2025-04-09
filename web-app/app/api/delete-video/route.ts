import { db } from '@/db/drizzle';
import { videos } from '@/db/video';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const result = await db.delete(videos).where(eq(videos.id, id));

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
