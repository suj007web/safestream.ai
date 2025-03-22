"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import React from 'react'
import { toast } from 'sonner'


const Page = () => {

  const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const videoUrl = data.get('url') as string;
    const webhookUrl = 'http://localhost:3000/api/webhook';
    const res = await fetch('/api/process-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({videoUrl, webhookUrl})
    })
    const result = await res.json();
    toast(result.message)
  }



  return (
    <div>
      <div className='flex flex-col items-center justify-center w-full mt-20 pb-10 '>
        <h1 className="text-4xl font-bold border-b-2">Analyze Videos</h1>
        <form action="" className='mt-20 w-full ' onSubmit={handleSubmit} >
          <div className='flex justify-center gap-5'>
          <Input name='url'  placeholder='Enter the URL of the video you want to analyze' className='w-3/4' />
          <Button className='bg-blue-500 hover:bg-blue-600'>Analyze</Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Page