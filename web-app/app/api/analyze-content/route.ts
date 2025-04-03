import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { videoUrl } = await req.json();
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const videoData = await fetchYouTubeVideoData(videoId);
    const analysis = await geminiQuery(videoData.title, videoData.description);
    return NextResponse.json({
      title: videoData.title,
      description: videoData.description,
      result: analysis
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
  }
}

async function geminiQuery(title: string, description: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `
Analyze the safety of a YouTube video based on its title and description. Your task is to determine if the video might contain offensive content, including but not limited to:

- **Nudity or Sexual Content**
- **Violence or Graphic Content**
- **Hate Speech or Discrimination**
- **Misinformation or Harmful Content**
- **Drug Use or Illegal Activities**
- **Self-harm or Suicide-related Content**
- **Profanity or Inappropriate Language**

### **Video Details**
- **Title:** "${title}"
- **Description:** "${description}"

### **Instructions**
1. **Categorize the content** based on the above risks.
2. **Provide a safety rating** (Safe, Caution, or Unsafe).
3. **Give a short explanation** of why you assigned this rating.
4. **If unsafe, suggest appropriate content moderation actions.**

Now, analyze the given YouTube video and provide a JSON response.
It should be of form :
{
      safety_rating:[OUTPUT,string],
      explaination:[OUTPUT,string]
      ,
          }
    `;
  const data = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const response = await axios.post(url, data, {
    headers: { "Content-Type": "application/json" }
  });

  const jsonText = response.data.candidates[0].content.parts[0].text;
  const extractedData = JSON.parse(jsonText.replace(/```json|```/g, "").trim());
  return extractedData;
}

async function fetchYouTubeVideoData(videoId: string) {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: { part: 'snippet', id: videoId, key: YOUTUBE_API_KEY }
  });

  const videoData = response.data.items[0]?.snippet;
  if (!videoData) {
    throw new Error("Video not found");
  }

  return videoData;
}

function getYouTubeVideoId(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

