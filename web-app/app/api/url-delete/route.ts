import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { urls } from '@/db/urls';
import { eq } from 'drizzle-orm';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const result = await db.delete(urls).where(eq(urls.id, id));

    return NextResponse.json({ message: 'Url deleted successfully' },
        {
            status:200
        }
    );
  } catch (err) {
    console.error('Error deleting Url:', err);
    return NextResponse.json(
        { 
            error: 'Failed to delete Url' 
        }, 
        { 
            status: 500 
        }
    );
  }
}