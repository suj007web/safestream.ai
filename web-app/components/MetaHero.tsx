"use client"
import React from 'react'
import {motion} from 'framer-motion'
const MetaHero = () => {

  return (
    <motion.div 
    initial={{
        y: 25,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 1.25,
        ease: "easeInOut",
      }}
    className='md:px-20 px-5 py-10  text-white flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 '>
        <h1 className='text-xl md:text-3xl font-semibold '>Billions <span className='bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent'>OF UNSAFE VIDEOS</span></h1>
        <h1 className='text-xl md:text-3xl font-semibold '>1 <span className='bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent'>SOLUTION</span></h1>
        <h1 className='text-xl md:text-3xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent'>SafeStream.ai</h1>
    </motion.div>
  )
}

export default MetaHero