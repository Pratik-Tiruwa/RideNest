'use client'
import { Banknote, ShieldCheck, Truck, Zap } from 'lucide-react'
import React from 'react'
import { motion } from "motion/react"


const features = [
    {
        icon: ShieldCheck,
        title: "100% Verified Partners",
        desc: "Every vehicle owner and driver undergoes strict document verification and live video KYC screening."
    },

    {
        icon: Banknote,
        title: "Transparent Pricing",
        desc: "No hidden charges or surprise surges. The fare calculated upfront is the exact price you pay."
    },

    {
        icon: Truck,
        title: "Bikes to Heavy Trucks",
        desc: "From daily office commutes on bike taxis to house shifting with commercial trucks, book it all in one app."
    },

    {
        icon: Zap,
        title: "Real-time Live Tracking",
        desc: "Monitor live driver coordinates, track estimated arrival times, and secure your ride with dual OTP verification."
    }
]

export default function AboutSection() {
    return (
        <section id='about' className='w-full py-20 bg-zinc-950 text-white relative overflow-hidden'>
            <div className='max-w-7xl mx-auto px-6 md:px-8'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className='text-center max-w-2xl mx-auto mb-16'
                >
                    <span className='text-xs uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20'>
                        About RideNest
                    </span>

                    <h2 className='text-3xl md:text-5xl font-extrabold tracking-tight mt-4'>India&apos;s Smartest Mobility Network</h2>

                    <p className='mt-4 text-gray-400 text-sm md:text-base leading-relaxed'>RideNest connects daily commuters and cargo logistics directly with verified vehicle owners - transparent, reliable, and middleman-free.</p>

                </motion.div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 '>
                    {features.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className='group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:bg-white/8 hover:shadow-2xl transition-all duration-300 cursor-pointer'
                            >
                                <div className='w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mb-5 font-bold shadow-lg group-hover:scale-110 transition-transform duration-300'>
                                    <Icon size={24} />
                                </div>

                                <h3 className='text-lg font-semibold mb-2 group-hover:text-white transition'>{item.title}</h3>

                                <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>

                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
