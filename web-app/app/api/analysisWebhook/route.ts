import { db } from "@/db/drizzle";
import { videos } from "@/db/video";
function getYouTubeThumbnail(videoUrl: string): string | null {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*vi\/))([^?&]+)/);
    if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return null;
}
export async function POST(req : Request){

        const {status, message, result, videoUrl, filePath} = await req.json();
        if(status == 'success'){
            console.log(result);
            const thumbnail = getYouTubeThumbnail(videoUrl);
            await db.insert(videos).values({
                title : filePath,
                url : videoUrl,
                thumbnail : thumbnail,
                timestamps : result,
                firstVisited : new Date(),  
            }).onConflictDoNothing();
            return new Response(JSON.stringify({message : message, data : result}), {
                status : 200
            })

        }else{
            return new Response(JSON.stringify({message : message}), {
                status : 500
            })
        }


    
}