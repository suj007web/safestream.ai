import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { urls } from '@/db/urls';
import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    const { userId } = await auth();
              
    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());
    const userEmail = user?.email_addresses?.[0]?.email_address;
    await db.delete(urls).where(and(eq(urls.id, id), eq(urls.userEmail, userEmail)));

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