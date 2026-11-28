'use client'
import React from 'react'
import { motion } from "motion/react"
import Link from "next/link"
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiLinkedin } from "react-icons/fi";
import { Mail, MapPin, Phone } from 'lucide-react';

function Footer() {

  return (

    <div
      id='contact'
      className='w-full bg-black text-white'>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className='max-w-7xl mx-auto px-6 py-16'
      >

        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-12'>

          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-bold tracking-wide'>RideNest</h2>
            <p className='mt-4 text-gray-400 text-sm leading-relaxed'>Book any vehicle - from bikes to trucks. <br />
              Trusted owners. Transparent pricing</p>


            <div className='flex gap-4 mt-6'>
              {
                [FiFacebook, FaInstagram, FaXTwitter, FiLinkedin].map((Icon, i) => (

                  <motion.a
                    key={i}
                    whileInView={{ y: -3 }}
                    href='#'
                    className='w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition'
                  >
                    <Icon size={18} />
                  </motion.a>
                ))
              }
            </div>
          </div>


          <div className='flex flex-col gap-3'>
            <h3 className='text-base font-semibold text-white tracking-wide'>Quick Links</h3>

            <div className='flex flex-col gap-2.5 text-sm text-gray-400'>
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/#about" className="hover:text-white transition">About Us</Link>
              <Link href="/user/bookings" className='hover:text-white transition'>My Bookings</Link>
              <Link href="/partner/onboarding/vehicle" className='hover:text-white transition'>Become a Partner</Link>
            </div>
          </div>


          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <h3 className='text-base font-semibold text-white tracking-wide'>Contact Support</h3>
              <span className='flex items-center gap-1.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-200/20 px-2 py-0.5 rounded-full'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>
                24/7 Live
              </span>
            </div>

            <div className='flex flex-col gap-3 text-sm text-gray-400'>
              <a
                href="mailto:support@ridenest.com"
                className='flex items-center gap-3 hover:text-whote transition group'
              >
                <div className='w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30'>
                  <Mail size={15} />
                </div>
                <span>support@ridenest.com</span>
              </a>

              <a
                href="tel:+9118002007433"
                className='flex items-center gap-3 hover:text-white transition group'>

                <div className='w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30'>
                  <Phone size={15} />
                </div>
                <span>+91 1800-200-RIDE (Toll-Free)</span>
              </a>

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center'>
                  <MapPin size={15} />
                </div>
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

        </div>

        <div className='border-t border-white/10'>
          <div className='max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4'>
            <p>© {new Date().getFullYear()} RideNest. All rights reserved. </p>
          </div>
        </div>

      </motion.div >

    </div >

  )
}

export default Footer