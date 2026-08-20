import React from 'react'

const HeroSection = () => {
  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
        <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage : "url('/heroImage.jpg')"}} />
        <div className='absolute inset-0 bg-black/78' /> 
        
    </div>
  )
}

export default HeroSection