import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/db/drizzle';
import { videos } from '@/db/video';
import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getYouTubeThumbnail(videoUrl: string): string | null {
  const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*vi\/))([^?&]+)/);
  if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
}
async function geminiRequest(videoUrl: string, userEmail : string) {
  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnail = getYouTubeThumbnail(videoUrl);
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }

  try {
    const videoData = await fetchYouTubeVideoData(videoId);
    if (!videoData) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
 
    const analysis = await geminiQuery(videoData.title, videoData.description);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to analyze video content' },
        { status: 500 }
      );
    }
    
    await db
  .insert(videos)
  .values({
    url: videoUrl,
    userEmail : userEmail,
    explanation: analysis.explanation,
    safety_rating: analysis.safety_rating,
    title: videoData.title,
    description: videoData.description,
    thumbnail : thumbnail,
    timestamps: [],
    firstVisited: new Date(),
    lastVisited: new Date(),
  })
  .onConflictDoUpdate({
    target: [videos.url, videos.userEmail],
    set: {
      explanation: analysis.explanation,
      safety_rating: analysis.safety_rating,
      title: videoData.title,
      thumbnail : thumbnail,
      description: videoData.description,
      lastVisited: new Date(),
    },
  });
  const[video] = await db.select().from(videos).where(
    and(
      eq(videos.url, videoUrl), 
      eq(videos.userEmail , userEmail as string)
    ));

    return NextResponse.json({
      data : video,
      success: true,
      message: 'Fetched Result from gemini API',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch video data ' + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { videoUrl } = await req.json();


  const { userId } = await auth();
  const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).then(res => res.json());
  const userEmail = user?.email_addresses?.[0]?.email_address;
  const [video] = await db
    .select()
    .from(videos)
    .where(
      and(
        eq(videos.url, videoUrl), 
        eq(videos.userEmail , userEmail as string)
      )
    );

 
  if (
    video === undefined ||
    video.description === null ||
    video.explanation === null ||
    video.safety_rating === null
  ) {
    return await geminiRequest(videoUrl, userEmail);
  }else{
    return NextResponse.json({
      data: video,
      success: true,
      message: 'Video fetched from the database',
    });
  }
}

async function geminiQuery(title: string, description: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `
Analyze the safety of a YouTube video based on its title and description. Your task is to determine if the video might contain offensive content, including but not limited to:
db
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
      explanation:[OUTPUT,string]
      ,
          }
    `;
  const data = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/json' },
  });

  const jsonText = response.data.candidates[0].content.parts[0].text;
  const extractedData = JSON.parse(jsonText.replace(/```json|```/g, '').trim());
  return extractedData;
}

async function fetchYouTubeVideoData(videoId: string) {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos`,
    {
      params: { part: 'snippet', id: videoId, key: YOUTUBE_API_KEY },
    }
  );

  const videoData = response.data.items[0]?.snippet;
  if (!videoData) {
    throw new Error('Video not found');
  }

  return videoData;
}

function getYouTubeVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
