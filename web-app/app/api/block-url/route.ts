import {  NextResponse } from 'next/server';
import { db } from "@/db/drizzle";

import { eq } from 'drizzle-orm';
import { urls } from '@/db/urls';
export async function POST(req: Request){
    const { url } = await req.json();
   
      try {
       await db
        .update(urls)
        .set({isBlocked: true })
        .where(eq(urls.url, url)) 
        .execute();
        
        
        return NextResponse.json(
            { 
                message: "URL blocked successfully"
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
   