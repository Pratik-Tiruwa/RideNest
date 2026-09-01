'use client'
import React from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'

type propType = {
  isOpen: boolean,
  onClose: () => void
}

const AuthModel = ({ isOpen, onClose }: propType) => {
  return (
    <>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className='fixed inset-0 z-[90] bg-black/80 backdrop-blur-md'
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className='fixed inset-0 z-[100] flex items-center justify-center px-4'
            >

              <div className='relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px-rgba(0,0,0,0.35)] p-6 sm:p-8 text-black'>

                <div className='absolute right-4 top-4 text-gray-500 hover:text-bl transition' onClick={onClose} />
                <X size={20} />


              </div>

            </motion.div>

          </motion.div>
        </>
      )}
    </>

  )
}

export default AuthModel