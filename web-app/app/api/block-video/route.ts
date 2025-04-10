import {  NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { videos } from "@/db/video";
import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
export async function POST(req: Request){
    const { videoURL } = await req.json();
    const { userId } = await auth();
              
    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());
    const userEmail = user?.email_addresses?.[0]?.email_address;
      try {
       await db
        .update(videos)
        .set({isBlocked: true })
        .where(and(eq(videos.url, videoURL), eq(videos.userEmail, userEmail ))) 
        .execute();
        
        
        return NextResponse.json(
            { 
                message: "Video blocked successfully"
            },
            {status : 200}
        )
    }
    catch(e){
      return NextResponse.json(
                {
                    message : "Internal Server Error" ,
                    error : e
                },
                {status : 500}
            )
        }
}
   