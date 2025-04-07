import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();
    if (!userInput) {
      return NextResponse.json({ error: "User input is required" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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
          explaination:[OUTPUT,string]
          ,
              }
        `;
    const data = {
      contents: [{ parts: [{ text: systemPrompt + userInput }] }],
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
    return NextResponse.json({ output: responseData });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
