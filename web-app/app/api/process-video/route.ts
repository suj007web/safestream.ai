import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request){
        try{
            const { userId } = await auth();
              
            const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              },
            }).then(res => res.json());
            const userEmail = user?.email_addresses?.[0]?.email_address;
            const {videoUrl, webhookUrl} = await req.json();
            console.log(videoUrl, webhookUrl, "HI");
            const flaskResponse = await fetch(`${process.env.FLASK_API_URL}/download`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({videoUrl, webhookUrl, userEmail})
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