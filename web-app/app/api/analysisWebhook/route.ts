import { db } from "@/db/drizzle";
import { videos } from "@/db/video";

export async function POST(req : Request){

        const {status, message, result, videoUrl, filePath} = await req.json();
        if(status == 'success'){
            console.log(result);
            
          
            await db.insert(videos).values({
                title : filePath,
                url : videoUrl,
                timestamps : result,
                firstVisited : new Date(),  
            }).onConflictDoUpdate(
                {
                    target : videos.url,
                    set : {
                        timestamps : result,
                        firstVisited : new Date(),
                    }
                }
            );
            return new Response(JSON.stringify({message : message, data : result}), {
                status : 200
            })

        }else{
            return new Response(JSON.stringify({message : message}), {
                status : 500
            })
        }


    
}