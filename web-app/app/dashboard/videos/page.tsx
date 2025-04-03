"use client"
import { Spin } from 'antd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Result {
  title: string;
  description: string;
  result: {
    safety_rating: string;
    explaination: string;
  };
}

const Page = () => {
  const [result, setResult] = useState<Result | null>(null)
  const [videoURL, setVideoURL] = useState<string>('');
  const [loading,setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const videoUrl = data.get('url') as string;
    const webhookUrl = 'http://localhost:3000/api/webhook';
  
    const res = await fetch('/api/process-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoUrl, webhookUrl })
    });
    const results = await res.json();
    toast(results.message);
  }

  const handleContent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const videoUrl = data.get('url') as string;
    
    
    const res = await fetch('/api/analyze-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoUrl })
    });
    
    const ans = await res.json();
    setResult(ans);
    setLoading(false);
  }
  
    const blockVideo = async () => {
     const response = await fetch('/api/block-video', {
      method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoURL }),
        });
        const results = await response.json();
        toast(results.message);
  }
      

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    handleContent(e);
  }

  
  const getVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
  }

  const videoId = getVideoId(videoURL);

  return (
    <div>
      <div className='flex flex-col items-center justify-center w-full mt-20 pb-10 '>
        <h1 className="text-4xl font-bold border-b-2">Analyze Videos</h1>
        <form action="" className='mt-20 w-full ' onSubmit={handleFormSubmit}>
          <div className='flex justify-center gap-5'>
            <Input 
              name='url' 
              placeholder='Enter the URL of the video you want to analyze' 
              className='w-3/4'
              value={videoURL}
              onChange={(e) => {
                const newURL = e.target.value;
                setVideoURL(newURL); // Update the video URL
            
                
               
                  setResult(null);  // Clear the previous result
                 
                }}
            />
            <Button className='bg-blue-500 hover:bg-blue-600'>Analyze</Button>
          </div>
        </form>
                {
                  loading?<Spin size="large" className='mt-20'/>:<div>
                  {videoId && result && videoURL && (
                  <div className='mt-20 w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg'>
                      <h2 className='text-2xl font-semibold text-gray-800 mb-10 text-center'>RESULT:</h2>
                      { result && videoURL&& (<div className='flex flex-col md:flex-row gap-8 justify-center items-start m-3'>
                          {videoId  ? (
                            <iframe 
                              className='w-full md:w-3/5 h-64 md:h-96 rounded-lg border' 
                              src={`https://www.youtube.com/embed/${videoId}`}  // Use the video ID extracted from URL
                              title="YouTube video player" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                              referrerPolicy="strict-origin-when-cross-origin" 
                              allowFullScreen>
                            </iframe>
                          ) : (
                            <p className='text-red-500'>Invalid YouTube URL</p>
                          )}
                          <div className='w-full md:w-2/5 p-3 text-justify'>
                              <p className='text-lg font-semibold pb-4'><strong>Title:</strong> {result?.title}</p>
                              <p className='text-lg font-semibold'><strong>Description:</strong> {result?.description || '(No description)'}</p>
                          </div>
                      </div>)}
                      {result.result.safety_rating === 'Safe' ? (
                         <div className='mt-6 p-4 bg-green-100 rounded-lg text-justify'>
                             <p className='text-lg font-semibold text-green-800'><strong>Analysis:</strong> {result?.result?.safety_rating}</p>
                             <p className='text-lg font-semibold text-green-800'><strong>Explaination:</strong> {result?.result?.explaination}</p>
                         </div>
                      ) : (
                        <div className='mt-6 p-4 bg-red-100 rounded-lg text-justify'>
                           <p className='text-lg font-semibold text-red-800'><strong>Analysis:</strong> {result?.result?.safety_rating}</p>
                           <p className='text-lg font-semibold text-red-800'><strong>Explaination:</strong> {result?.result?.explaination}</p>
                           <div className='flex justify-end'>
                           <Button className='bg-red-800 hover:bg-red-700 mt-3 '
                           onClick={blockVideo}>Block Video</Button></div>
                        </div>
                      )}
                  </div>
                  )}</div>
                }
      </div>
    </div>
  )
}

export default Page;
