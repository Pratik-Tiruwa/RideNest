'use client'
import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import AuthModel from './AuthModel'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'

const Nav_items = ["Home", "Bookings", "About Us", "Contact"]


function Navbar() {

  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathName = usePathname();

  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    dispatch(setUserData(null))
    setProfileOpen(false)
  }
  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 
      w-[94%] md:w-[85%] 
      z-50 rounded-full bg-[#0B0B0B] text-white 
      shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3`}
      >
        <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="RideNest Logo"
              width={200}
              height={60}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>
          <div className='hidden md:flex items-center gap-10'>

            {Nav_items.map((i, index) => {
              let href;
              if (i == "Home") {
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

          <div className='flex items-center gap-3 relative'>

            <div className='hidden md:block relative'>
              {!userData ? (
                <button className='px-4 py-1.5 rounded-full bg-white text-black text-sm'
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button className='w-11 h-11 rounded-full bg-white text-black font-bold' onClick={() => setProfileOpen(prev => !prev)}>
                    {userData.name.charAt(0).toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border'
                      >

                        <div className='p-5'>
                          <p className='text-lg font-semibold'>{userData.name}</p>
                          <p className='text-xs uppercase text-gray-500 mb-4'>{userData.role}</p>
                          {userData.role != "partner" && (
                            <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl'>
                              <div className='flex space-x-2'>

                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'> <Bike size={16} /> </div>
                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'> <Car size={16} /> </div>
                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'> <Truck size={16} /> </div>


                              </div>

                              Become a Partner
                              <ChevronRight size={16} className='ml-auto' />
                            </div>
                          )
                          }

                          <button className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </>
              )
              }
            </div>


            <div className='md:hidden'>
              {!userData ? (
                <button className='px-4 py-1.5 rounded-full bg-white text-black text-sm'
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button className='w-11 h-11 rounded-full bg-white text-black font-bold' onClick={() => setProfileOpen(prev => !prev)}>
                    {userData.name.charAt(0).toUpperCase()}
                  </button>

                </>
              )
              }
            </div>

            <button className='md:hidden text-white' onClick={() => setMenuOpen(prev => !prev)}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>


      </motion.div>


      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className='fixed inset-0 bg-black z-30 md:hidden'
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden'
            >

              <div className='flex flex-col divide-y divide-white/10'>
                {Nav_items.map((i, index) => {
                  let href;
                  if (i == "Home") {
                    href = "/"
                  } else {
                    href = `/${i.toLowerCase()}`
                  }
                  
                  return <Link key={index} href={href} className="px-6 py-4 text-gray-300 hover:bg-white/5">{i}</Link> 
                })}
              </div>

            </motion.div>

          </>

        )}
      </AnimatePresence>

      <AuthModel isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Navbar