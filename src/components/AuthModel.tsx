'use client'
import React, { useState } from 'react'
import { motion, useScroll } from 'motion/react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'
import { User } from 'lucide-react'

type propType = {
  isOpen: boolean,
  onClose: () => void
}

type setStep = "login" | "signup" | "otp"

const AuthModel = ({ isOpen, onClose }: propType) => {

  const [step, setStep] = useState<setStep>('login')

  return (
    <>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-[90] bg-black/80 backdrop-blur-md'
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className='fixed inset-0 z-[100] flex items-center justify-center px-4'
            >

              <div className='relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px-rgba(0,0,0,0.35)] p-6 sm:p-8 text-black'>

                <div className='absolute right-4 top-4 text-gray-500 hover:text-bl transition' onClick={onClose} >
                  <X size={20} />
                </div>

                <div className='mb-6 text-center'>
                  <h1 className='text-3xl font-extrabold tracking-widest'>RideNest</h1>
                  <p className='mt-1 text-xs text-gray-500'>Premium Vehicle Booking</p>
                </div>

                <button className='w-full h-11 rounded-xl 
                flex items-center justify-center gap-3
                text-sm font-semibold 
                hover:bg-black hover:text-white
                transition'>
                  <Image src={"/google.png"} alt='google' width={20} height={20} />
                  Continue with Google
                </button>

                <div className='flex items-center gap-4 my-6'>
                  <div className='flex-1 h-px bg-black/10' />
                  <div className='text-xs text-gray-500'>OR</div>
                  <div className='flex-1 h-px bg-black/10' />
                </div>

                <div>
                  {step == "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className='text-xl font-semibold'>Welcome back</h1>
                      <div className='mt-5 space-y-4'>
                        <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                          <Mail size={18} className='text-gray-500' />
                          <input type="email" placeholder='Email' className='w-full bg-transparent outline-none text-sm' />
                        </div>

                        <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                          <Lock size={18} className='text-gray-500' />
                          <input type="password" placeholder='Password' className='w-full bg-transparent outline-none text-sm' />
                        </div>

                        <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition'>Login</button>

                      </div>
                      <p className='mt-6 text-center text-sm text-gray-500'>Don't have an account ? <div onClick={() => setStep("signup")} className='text-black font-medium hover:underline cursor-pointer'>Sign Up</div></p>

                    </motion.div>
                  )}

                  {step == "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className='text-xl font-semibold'>Create Account</h1>
                      <div className='mt-5 space-y-4'>

                        <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                          <User size={18} className='text-gray-500' />
                          <input type="text" placeholder='Full Name' className='w-full bg-transparent outline-none text-sm' />
                        </div>

                        <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                          <Mail size={18} className='text-gray-500' />
                          <input type="email" placeholder='Email' className='w-full bg-transparent outline-none text-sm' />
                        </div>

                        <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                          <Lock size={18} className='text-gray-500' />
                          <input type="password" placeholder='Password' className='w-full bg-transparent outline-none text-sm' />
                        </div>

                        <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition'>Sign up</button>

                      </div>
                      <p className='mt-6 text-center text-sm text-gray-500'>Already have an account ? <div onClick={() => setStep("login")} className='text-black font-medium hover:underline cursor-pointer'>login</div></p>

                    </motion.div>
                  )}
                </div>



              </div>

            </motion.div>

          </motion.div>
        </>
      )}
    </>

  )
}

export default AuthModel