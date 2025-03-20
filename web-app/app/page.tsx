import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import React from 'react'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-slate-800 '>
      <Navbar/>
      <Hero/>
      

    </div>
  )
}

export default Home