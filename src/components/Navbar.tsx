'use client'
import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthModel from './AuthModel'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { Bike, Car, ChevronRight, LogOut, Truck } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { getSocket } from '@/lib/socket'


const Nav_items = ["Home", "Bookings", "About Us", "Contact"]


function Navbar() {

  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathName = usePathname();
  const router = useRouter();

  const { userData } = useSelector((state: RootState) => state.user)
  const [pendingCount, setPendingCount] = useState(0)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    dispatch(setUserData(null))
    setProfileOpen(false)
  }

  const fetchCount = async () => {
    try {
      const { data } = await axios.get("/api/partner/bookings/pending-requests-count")
      console.log(data)
      setPendingCount(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (userData?.role == "partner") {
      fetchCount()
    }
  }, [userData?.role])

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-booking", (data) => {
      setPendingCount(prev => prev + 1)
    })
    return () => {
      socket.off("new-booking")
    }
  }, [])

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
              src="/logo_primary.png"
              alt="RideNest Logo"
              width={200}
              height={60}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>
          <div className='hidden md:flex items-center gap-10'>

            {userData?.role == "partner" ? (
              <>
                <Link className='relative text-sm font-medium text-gray-300 hover:text-white transition' href={"/"}>Home</Link>
                <Link className='relative text-sm font-medium text-gray-300 hover:text-white transition' href={"/partner/pending-requests"}>Pending Requests
                  <span className='absolute -top-2 -right-5.5 w-6 h-6 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold'>{pendingCount ?? 0}</span>
                </Link>
                <Link className='relative text-sm font-medium text-gray-300 hover:text-white transition' href={"/partner/bookings"}>Bookings</Link>
                <Link className='relative text-sm font-medium text-gray-300 hover:text-white transition' href={"/partner/active-ride"}>Active Ride</Link>
              </>
            ) :
              Nav_items.map((i, index) => {
                let href;
                if (i == "Home") {
                  href = "/"
                } else {
                  href = `/user/${i.toLowerCase()}`
                }
                const active = href === pathName
                return <Link key={index} href={href} className={`
            text-sm font-medium pl-2 transition 
            ${active
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                  }
            `}>{i}</Link>
              })
            }

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
                        className='absolute top-14 right-0 w-75 bg-white text-black rounded-2xl shadow-xl border'
                      >

                        <div className='p-5'>
                          <p className='text-lg font-semibold'>{userData.name}</p>
                          <p className='text-xs uppercase text-gray-500 mb-4'>{userData.role}</p>
                          {userData.role != "partner" && (
                            <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl' onClick={() => router.push("/partner/onboarding/vehicle")}>
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
          </div>

        </div>


      </motion.div>


      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className='fixed inset-0 bg-black z-30 md:hidden'
            />

            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className='fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden p-6'
            >
              <div className='p-5'>
                <p className='text-lg font-semibold'>{userData.name}</p>
                <p className='text-xs uppercase text-gray-500 mb-4'>{userData.role}</p>
                {userData.role != "partner" && (
                  <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl' onClick={() => router.push("/partner/onboarding/vehicle")}>
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

                {userData.role == "partner" && (
                  <div className='flex flex-col gap-4'>
                    <Link className='relative text-sm font-medium text-black hover:text-gray-500 transition flex items-center gap-2' href={"/partner/pending-requests"}> <span>Pending Requests</span>
                      <span className='w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold'>{pendingCount ?? 0}</span>
                    </Link>
                    <Link className='relative text-sm font-medium text-black hover:text-gray-500 transition' href={"/partner/bookings"}>Bookings</Link>
                    <Link className='relative text-sm font-medium text-black hover:text-gray-500 transition' href={"/partner/active-ride"}>Active Ride</Link>
                  </div>
                )}

                <button className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence >

      <AuthModel isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Navbar