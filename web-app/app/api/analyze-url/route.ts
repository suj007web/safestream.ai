import { db } from "@/db/drizzle";
import { urls } from "@/db/urls";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req : Request){
    try{
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "User input is required" }, { status: 400 });
    }

    const [storedUrl] = await db.select().from(urls).where(eq(urls.url, url));
    if (storedUrl) {
      return NextResponse.json({ data : storedUrl, success : true, message : "URL data fetched successfully from DB" }, { status: 200 });
    } 


    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing API key");
    const systemPrompt = `Analyze the safety of a URl. Your task is to determine if the URL might contain offensive content, including but not limited to:

    - **Nudity or Sexual Content**
    - **Violence or Graphic Content**
    - **Hate Speech or Discrimination**
    - **Misinformation or Harmful Content**
    - **Drug Use or Illegal Activities**
    - **Self-harm or Suicide-related Content**
    - **Profanity or Inappropriate Language**
    
    ### **Instructions**
    1. **Categorize the content** based on the above risks.
    2. **Provide a safety rating** (Safe, Caution, or Unsafe).
    3. **Give a short explanation** of why you assigned this rating.
    4. **If unsafe, suggest appropriate content moderation actions.**
    
    Now, analyze the given URL and provide a JSON response.
    It should be of form :
    {
          safety_rating:[OUTPUT,string],
          explanation:[OUTPUT,string]
          ,
              }
        `;
    const data = {
      contents: [{ parts: [{ text: systemPrompt + url }] }],
    };
    

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      
      console.error("Gemini API error:", errorData);
      return NextResponse.json({ error: "Failed to fetch response from Gemini" }, { status: response.status });
    }

    const responseData = await response.json();
    console.log("Gemini API response:", responseData);
    const jsonText = responseData.candidates[0].content.parts[0].text;
    const extractedData = JSON.parse(jsonText.replace(/```json|```/g, '').trim());
    console.log("Extracted data:", extractedData);
    await db.insert(urls).values({
      url: url,
      safety_rating: extractedData.safety_rating,
      explanation: extractedData.explanation,
    })
    const [urlData] = await db.select().from(urls).where(eq(urls.url, url));
    return NextResponse.json({ data : urlData, success : true, message : "URL data fetched successfully from API" }, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}

