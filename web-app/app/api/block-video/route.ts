import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { videos } from "@/db/video";
import { eq } from 'drizzle-orm';
export async function POST(req: Request){
    const { videoURL } = await req.json();
   
      try {
       const result = await db
        .update(videos)
        .set({isBlocked: true })
        .where(eq(videos.url, videoURL)) 
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
   