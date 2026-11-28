'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import axios from 'axios'
import { BookingStatus, PaymentStatus } from '@/models/booking.model'
import { ArrowLeft, Clock, IndianRupee, Loader2, MapPin, Navigation } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'


interface IBooking {
    _id: string,
    user: string,
    driver: string,
    vehicle: string,

    pickUpAddress: string
    dropAddress: string

    pickUpLocation: {
        type: "Point",
        coordinates: [number, number]
    }

    dropLocation: {
        type: "Point",
        coordinates: [number, number]
    }

    fare: number,
    userMobileNumber: string,
    driverMobileNumber: string,

    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    paymentDeadline: Date

    adminCommission: number
    partnerAmount: number

    pickUpOtp: string
    pickUpOtpExpires: Date

    dropOtp: string
    dropOtpExpires: Date

    createdAt?: Date
    updatedAt?: Date
}

function page() {

    const [bookings, setBookings] = useState<IBooking[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchPendingRequests = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/partner/bookings/pending")
            setBookings(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleAccept = async (id: string) => {
        try {
            const { data } = await axios.get(`/api/partner/bookings/${id}/accept`)
            router.push("/partner/bookings")
        } catch (error) {
            console.log(error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const { data } = await axios.get(`/api/partner/bookings/${id}/reject`)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    useEffect(() => {
        const socket = getSocket();
        socket.on("new-booking", (data) => {
            setBookings((prev) => [...prev, data])
        })
        return () => {
            socket.off("new-booking")
        }
    }, [])

    return (
        <div className='min-h-screen bg-[#f4f5f7]'>

            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-6xl mx-auto px-6 py-6'>
                    <div className='flex items-center gap-4'>
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => router.push("/")}
                            className='w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition shrink-0'
                            title='Back to Home'
                        >
                            <ArrowLeft className='w-5 h-5' />
                        </motion.button>
                        <div>
                            <h1 className='text-3xl md:text-4xl font-semibold text-gray-900'>Ride Requests</h1>
                            <p className='mt-1 text-gray-500 text-base md:text-lg'>Manage incoming ride requests and respond in real time</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className='max-w-6xl mx-auto px-6 py-12'>
                {loading ? (
                    <div className='flex justify-center py-20'>
                        <Loader2 className='animate-spin w-8 h-8 text-gray-700' />
                    </div>
                ) : bookings.length == 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm'>
                        <p className='text-gray-500 text-lg'>No pending ride requests.</p>
                        <button
                            onClick={() => router.push("/")}
                            className='mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition cursor-pointer'
                        >
                            <ArrowLeft className='w-4 h-4' />
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {bookings.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.5 }}
                                className='bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition'
                            >
                                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8'>

                                    <div className='flex-1 space-y-6'>

                                        <div className='flex gap-4'>
                                            <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className='text-xs uppercase text-gray-400 mb-1'>PickUp Location</p>
                                                <p className='text-gray-900 font-medium'>{b.pickUpAddress}</p>
                                            </div>
                                        </div>

                                        <div className='flex gap-4'>
                                            <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
                                                <Navigation size={18} />
                                            </div>
                                            <div>
                                                <p className='text-xs uppercase text-gray-400 mb-1'>Drop Location</p>
                                                <p className='text-gray-900 font-medium'>{b.dropAddress}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                                            <Clock size={14} className='opacity-70' />
                                            <span className='font-medium'>
                                                {new Date(b?.createdAt!).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-between lg:items-end gap-6 w-full lg:w-auto'>

                                        <div className='text-left lg:text-right'>
                                            <p className='text-xs tracking-wide text-gray-400 uppercase mb-1'>Estimated Fare</p>
                                            <div className='flex items-center gap-2 text-3xl font-bold text-gray-900 lg:justify-end'>
                                                <IndianRupee size={20} />
                                                {b.fare}
                                            </div>
                                        </div>

                                        <div className='flex gap-4 w-full lg:w-auto'>
                                            <button
                                                onClick={() => handleReject(b._id)}
                                                className='px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50'>
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleAccept(b._id)}
                                                className='px-8 py-3 rounded-xl bg-black text-white text-sm font-semibold shadow-md hover:bg-gray-900 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center'>
                                                Accept Ride
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
                }
            </div>

        </div>
    )
}

export default page