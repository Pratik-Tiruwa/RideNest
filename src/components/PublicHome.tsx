'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModel from './AuthModel'
import AboutSection from './AboutSection'


const PublicHome = () => {

  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <VehicleSlider />
      <AboutSection />
      <AuthModel isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default PublicHome
