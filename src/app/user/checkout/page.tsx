'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { Bike, Car, Truck } from 'lucide-react'
import { MdElectricRickshaw } from "react-icons/md"
import { FaTruckPickup } from "react-icons/fa6"
import { useSearchParams, useRouter } from 'next/navigation'

const VEHICLE_META: any = {
    bike: { label: "Bike", Icon: Bike },
    auto: { label: "Auto", Icon: MdElectricRickshaw },
    car: { label: "Car", Icon: Car },
    loading: { label: "Loading", Icon: FaTruckPickup },
    truck: { label: "Truck", Icon: Truck }
}


function page() {

    const router = useRouter()
    const params = useSearchParams()
    const [pickUp, setPickUp] = useState(params.get("pickup") || "")
    const [drop, setDrop] = useState(params.get("drop") || "")
    const mobile = params.get("mobile")
    const pickUpLat = Number(params.get("pickuplat"))
    const pickUpLon = Number(params.get("pickuplon"))
    const dropLat = Number(params.get("droplat"))
    const dropLon = Number(params.get("droplon"))
    const vehicle = params.get("vehicle") || ""
    const fare = params.get("fare") || ""

    const { Icon, label } = VEHICLE_META[vehicle]

    return (
        <div className='min-h-screen bg-zinc-100 px-4 py-12'>

            <div className='relative max-w-6xl mx-auto z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className='mb-10'
                >

                    <div className='flex items-center gap-2 mb-2'>
                        <div className='h-px w-8 bg-zinc-900' />
                        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-zic-400'>Booking</span>
                    </div>

                    <h1 className='text-4xl font-black tracking-tight text-zinc-900'>Checkout</h1>
                    <p className='text-zinc-400 text-sm mt-1.5 font-medium'>Review your ride and confirm</p>

                </motion.div>

                <div className='grid lg:grid-cols-2 gap-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.88, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className='bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]'
                    >
                        <div className='h-1 bg-zinc-900' />

                        <div className='p-8 sm:p-10'>
                            <div className='flex items-center justify-between mb-8'>

                                <div>
                                    <div className='text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>Selected Vehicle</div>
                                    <div className='text-3xl font-black tracking-tight text-zinc-900'>{vehicle}</div>
                                </div>

                                <div className='w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg'>
                                    <Icon size={28} className={'text-white'} />     
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </div>
    )
}

export default page