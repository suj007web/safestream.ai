import Hero from '@/components/Hero'
import HowToUse from '@/components/HowToUse'
import MetaHero from '@/components/MetaHero'
import Navbar from '@/components/Navbar'
import WhatWeDo from '@/components/WhatWeDo'
import React from 'react'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-slate-900 '>
      <Navbar/>
      <Hero/>
      <MetaHero/>
      <WhatWeDo/>
      <HowToUse/>
    </div>
  )
}

export default Home