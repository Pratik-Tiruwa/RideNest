'use client'
import { IVehicle } from '@/models/vehicle.model'
import React from 'react'
import { motion } from "motion/react"
import { Bike, Star } from 'lucide-react'
import { MdElectricRickshaw } from "react-icons/md"
import { Car } from 'lucide-react'
import { FaTruckPickup } from 'react-icons/fa'
import { Truck } from 'lucide-react'


const TYPE_CONFIG: any = {
    bike: { label: "Bike", Icon: Bike },
    auto: { label: "Auto", Icon: MdElectricRickshaw },
    car: { label: "Car", Icon: Car },
    loading: { label: "Loading", Icon: FaTruckPickup },
    truck: { label: "Truck", Icon: Truck }
}


function VehicleCard({ vehicle, distance }: { vehicle: IVehicle, distance: number | undefined }) {

    const { Icon, label } = TYPE_CONFIG[vehicle.type]
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className='relative bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col group cursor-default'
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >

            <div className='relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.04]'
                    style={{
                        backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <motion.img
                    src={vehicle.imageUrl}
                    alt={vehicle.vehicleModel}
                    className='relative z-10 h-32 w-full object-contain'
                    style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.14)" }}
                    whileHover={{ scale: 1.06, filter: "drop-shadow(0 12px 13px rgba(0,0,0,0.22)" }}
                    transition={{ duration: 0.35 }}
                />

                <div className='absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full'>
                    <Icon size={10} />
                    {label}
                </div>

                <div className='absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 text-[10px] font-bold  px-2.5 py-1.5 rounded-full shadow-sm'>
                    <Star size={9} className='fill-zinc-900 text-zinc-900' />
                    4.8
                </div>
            </div>

        </motion.div>
    )
}

export default VehicleCard