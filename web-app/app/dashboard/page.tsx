"use client"
import { useUser } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {Spin} from 'antd'
export default function Page() {
  const {user} = useUser();

  const data = [
    { date: "2025-03-01", videosAnalyzed: 42 },
    { date: "2025-03-05", videosAnalyzed: 78 },
    { date: "2025-03-10", videosAnalyzed: 56 },
    { date: "2025-03-15", videosAnalyzed: 94 },
    { date: "2025-03-20", videosAnalyzed: 112 },
    { date: "2025-03-25", videosAnalyzed: 89 },
    { date: "2025-03-30", videosAnalyzed: 143 },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
  return (
    <>
    {
      user ? 
      <div>
      <div className='flex flex-col items-center justify-center w-full mt-20 pb-10 border-b-2 '> 
     <Image className='rounded-full' src = {user?.imageUrl as string} alt = "avatar" height = {200} width = {200} />
      <h1 className='text-4xl font-bold '>Welcome Back, {user?.fullName}</h1>
      </div>
      <div className='flex flex-col items-center justify-center w-full mt-20 px-20'>
      <h2 className="text-xl font-semibold mb-4">Videos Analyzed Over Time</h2>
      <ChartContainer
        config={{
          videosAnalyzed: {
            label: "Videos Analyzed",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[100px] h-[300px]"
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={formatDate} />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  if (name === "date") {
                    return formatDate(value as string)
                  }
                  return value
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="videosAnalyzed"
            stroke="var(--color-videosAnalyzed)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
      </div>
     
    </div> : 
    <div className='h-full w-full flex justify-center items-center'>
      <Spin size='large'/>
    </div>
    }
    </>
  )
}

