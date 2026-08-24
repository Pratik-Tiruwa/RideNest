'use client'
import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Nav_items = ["Home", "Bookings", "About Us", "Contact"]


function Navbar() {

  const pathName = usePathname();

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-3 left-1/2 -translate-x-1/2 
      w-[94%] md:w-[85%] 
      z-50 rounded-full bg-[#0B0B0B] text-white 
      shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3`}
    >
      <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>
        <Image src={"/logo.png"} alt='logo' width={44} height={44} />

        <div>

          {Nav_items.map((i, index) => {
            let href;
            if(i=="Home") { 
               href = "/"
            } else {
               href = `/${i.toLowerCase()}`
            }
            const active = href === pathName
            return <Link key={index} href={href} className={`
            text-sm font-medium pl-2 transition 
            ${active
                ? "text-white"
                : "text-gray-400 hover:text-white"
              }
            `}>{i}</Link>
          })}

        </div>

      </div>

    </motion.div>
  )
}

export default Navbar