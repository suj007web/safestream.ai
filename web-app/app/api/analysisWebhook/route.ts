import { db } from "@/db/drizzle";
import { videos } from "@/db/video";



export async function POST(req : Request){

        const {status, message, result, videoUrl, filePath, userEmail} = await req.json();
        if(status == 'success'){
            console.log(result);
            
             
              
        
            console.log(userEmail, "email from webhook");
            await db.insert(videos).values({
                title : filePath,
                url : videoUrl,
                timestamps : result,
                firstVisited : new Date(),  
                userEmail : userEmail,
            }).onConflictDoUpdate(
                {
                    target: [videos.url, videos.userEmail],
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