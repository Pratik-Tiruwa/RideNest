'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'

function page() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<vehicleType>()
  const [mobile, setMobile] = useState("")
  const [pickUp, setPickUp] = useState("")
  const [drop, setDrop] = useState("")
  const progress = [!!vehicle, !!(mobile.length==10), !!pickUp, !!drop].filter(Boolean).length

  // console.log(progress)

  return (
    <div className='min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10'>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-md'
      >

        {/* header section   */}
        <div className='flex items-center gap-4 mb-6 px-1'>
          <motion.div
            whileTap={{ scale: 0.88 }}
            onClick={() => router.back()}
            className='w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors shrink-0'
          >
            <ArrowLeft size={13} className='text-zinc-900' />
          </motion.div>

          <div className='flex-1 min-w-0'>
            <h1 className='text-zinc-900 text-lg font-black tracking-tight'>Book a Ride</h1>
            <p className='text-zinc-400 text-xs mt-0.5'>Fill in teh details below</p>
          </div>

          <div className='flex items-center gap-1.5 shrink-0'>
            {
              [0,1,2,3].map((d,i) => ( 
                <motion.div
                key={i}
                animate={{ width : i < progress ? 20 : 8, background : i < progress ? "#09090b" : "#d4d4d8"}}
                transition={{ duration : 0.3}}
                className='h-2 rounded-full'
                />
              ))
            }
          </div>

        </div>

      </motion.div>

    </div>
  )
}

export default page