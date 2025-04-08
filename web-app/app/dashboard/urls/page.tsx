"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spin } from 'antd';
import React, {  useState } from 'react'
import { toast } from 'sonner';

interface Result {
  data : {
    safety_rating: string;
    explanation: string;
  }
}


const Page = () => {
    const [url, setUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<Result | null>(null);

    const handleBlockUrl = async () =>{
      const res = await fetch('/api/block-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      console.log(data);
      toast(data.message)
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/analyze-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        const data = await res.json();
        setResult(data);
        console.log(data);
        setLoading(false);
        
    }
  return (
    <div className='flex flex-col items-center justify-center w-full mt-20 pb-10 '>
    <h1 className="text-4xl font-bold border-b-2">Analyze URLs</h1>
    <form action="" className='mt-20 w-full ' onSubmit={handleFormSubmit}>
      <div className='flex justify-center gap-5'>
        <Input 
          name='url' 
          placeholder='Enter the URL you want to analyze' 
          className='w-3/4'
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setResult(null); 
            }}
        />
        <Button className='bg-blue-500 hover:bg-blue-600'>Analyze</Button>
      </div>
    </form>
    {loading ? <Spin size="large" className='mt-10' /> : 
      result &&
        <div className='px-20 py-10'>
        { result?.data.safety_rating === 'Safe' ? (
                            <div className='mt-6 p-4 bg-green-100 rounded-lg text-justify'>
                                <p className='text-lg font-semibold text-green-800'><strong>Analysis:</strong> {result?.data?.safety_rating}</p>
                                <p className='text-lg font-semibold text-green-800'><strong>Explanation:</strong> {result?.data?.explanation}</p>
                            </div>
                         ) : (
                           <div className='mt-6 p-4 bg-red-100 rounded-lg text-justify'>
                              <p className='text-lg font-semibold text-red-800'><strong>Analysis:</strong> {result?.data?.safety_rating}</p>
                              <p className='text-lg font-semibold text-red-800'><strong>Explanation:</strong> {result?.data?.explanation}</p>
                              <div className='flex justify-end'>
                              <Button className='bg-red-800 hover:bg-red-700 mt-3 '
                              onClick={handleBlockUrl}>Block URL</Button></div>
                           </div>
                         )}
        </div>
       
    }
    </div>
  )
}

export default Page