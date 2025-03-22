import { NextResponse } from "next/server";

export async function POST(req : Request){
    const { status, message, filePath, videoUrl} = await req.json();
    console.log(filePath);
    try{
       if(status === 'success'){
        const response = await fetch(`${process.env.FLASK_API_URL}/analyse`, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filePath,
                webhookUrl : 'http://localhost:3000/api/analysisWebhook',
                videoUrl
            })
        });
 
        const data = await response.json();
        console.log(data);
        return NextResponse.json(
            {
                message : data.message
            },
            {
                status : 200
            }
        )
       }else{
        throw new Error(message);
       }
    }catch(e){
        console.log(e);
        return NextResponse.json(
            {
                message : "Error processing the video",
                error : e
            },
            {
                status : 500
            }
        )
    }
  
}