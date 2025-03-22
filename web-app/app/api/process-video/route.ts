import { NextResponse } from "next/server";


export async function POST(req: Request){
        try{
            const {videoUrl, webhookUrl} = await req.json();
            console.log(videoUrl, webhookUrl, "HI");
            const flaskResponse = await fetch(`${process.env.FLASK_API_URL}/download`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({videoUrl, webhookUrl})
            })

            const flaskData = await flaskResponse.json();
            return NextResponse.json(
                {
                    message : "Video processing started",
                    data : flaskData
                }
            )
        }catch(e){
            return NextResponse.json(
                {
                    message : "Error processing the video",
                    error : e
                },
                {status : 500}
            )
        }
}