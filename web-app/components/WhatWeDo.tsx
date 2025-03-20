import React from 'react'
import Image from 'next/image'
const WhatWeDo = () => {
  return (
    <div id="whatwedo" className='flex flex-col md:flex-row text-white px-20 mt-10 bg-black pt-10 rounded-3xl shadow-lg gap-10 md:gap-0'>
        <div className='flex flex-col w-full md:w-1/2'>
            <h1 className='text-2xl md:text-5xl font-semibold'>Why use SafeStream ?</h1>
            <p className='text-md md:text-2xl mt-2 md:mt-10 text-gray-300'>At SafeStream, our mission is to ensure a safer and cleaner internet experience for everyone. We provide a platform for reporting and monitoring sensitive content across the web.Join us in our commitment to making the internet a safer place for all.</p>
        </div>
        <div className='w-full md:w-1/2 md:ml-10 flex flex-col gap-10'>
            <Item
            title='Comprehensive Reporting System'
            para='Our platform provides a comprehensive reporting system that allows users to report sensitive content across the web.'
            />
            <Item
            title='Advanced Content Analysis'
            para='Utilize our advanced content analysis tools to detect and filter harmful material, ensuring a safer and cleaner web experience for all users.'
            />
            <Item
            title='Watch Safe Content'
            para='Watch the huge collection of our database incluing all the safe content YouTube videos ,reels and dailymotion videos.'
            />

           
        </div>
    </div>
  )
}

const Item = ({title, para} : {
    title : string,
    para : string
})=>{

    return (
        <div className='flex justify-center items-center gap-5 '>  
              <Image src="/download.svg" alt="safestream" className='h-8 w-8' width={500} height={500} />
              <div className='flex flex-col'>
                <h1 className='text-lg md:text-2xl font-semibold'>{title}</h1>
                <p className='text-gray-300'>{para}</p>
              </div>
        </div>
    )

}

export default WhatWeDo