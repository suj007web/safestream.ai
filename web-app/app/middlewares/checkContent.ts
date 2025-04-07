import { db } from "@/db/drizzle";
import { videos } from "@/db/video";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function checkExistenceInDB(req : NextRequest){


    const [video] = await db.select({
        explanation : videos.explanation,
        safety_rating : videos.safety_rating,
        title : videos.title,
        description : videos.description,
    }).from(videos)
    .where(eq(videos.url , videoUrl as string))
    ;

    if(video.description === null || video.explanation === null || video.safety_rating === null){
            return NextResponse.next();
        }else{
            return NextResponse.json({
                data : video,
                success : true,
                message : "Video fetched from the database"
            });
        }
    }
