"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";



export default function Home() {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const videoUrl = formData.get('videoUrl') as string;
    const webhookUrl = 'http://localhost:3000/api/webhook';
    const response = await fetch('/api/process-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({videoUrl, webhookUrl})
    });
    const data = await response.json();
    toast(data.message);
    
  }

  return (
    <div className="bg-slate-900 h-screen flex items-center justify-center">
      <form className="flex gap-5" onSubmit={(e)=>{handleSubmit(e)}}>
        <Input name="videoUrl" className="bg-white"/>
        <Button type="submit" variant={"outline"}>Process Video</Button>
      </form>
    </div>
  )
}
