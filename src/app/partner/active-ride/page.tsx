'use client'
import dynamic from 'next/dynamic'
import { BookingStatus, IBooking, PaymentStatus } from '@/models/booking.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ChevronUp, Zap } from 'lucide-react'
import PanelContent from '@/components/PanelContent'
import { stat } from 'fs'
import { FcPrevious } from 'react-icons/fc'
import { getSocket } from '@/lib/socket'

const LiveRideMap = dynamic(() => import("@/components/LiveRideMap"), {
    ssr: false
})

const MAP_STATUS: Record<BookingStatus, "arriving" | "ongoing" | "completed"> = {
    idle: "arriving",
    requested: "arriving",
    awaiting_payment: "arriving",
    confirmed: "arriving",
    started: "ongoing",
    completed: "completed",
    cancelled: "completed",
    rejected: "completed",
    expired: "completed"
};


const STATUS_LABEL: Record<BookingStatus, { label: string, sublabel: string, dot: string }> = {
    idle: {
        label: "Awaiting Confirmation", sublabel: "Booking is being processed",
        dot: "bg-amber-400"
    },
    requested: {
        label: "Awaiting Confirmation", sublabel: "Booking is being processed",
        dot: "bg-amber-400"
    },
    awaiting_payment: {
        label: "Payment Pending", sublabel: "Customer payment is pending",
        dot: "bg-purple-400"
    },
    confirmed: {
        label: "Heading to Pickup", sublabel: "Drive to the pickup location",
        dot: "bg-amber-400"
    },
    started: {
        label: "Ride in progress", sublabel: "Heading to drop location",
        dot: "bg-emerald-400"
    },
    completed: {
        label: "Ride Completed", sublabel: "Trip has ended successfully",
        dot: "bg-zinc-400"
    },
    cancelled: {
        label: "Ride Cancelled", sublabel: "This ride was cancelled",
        dot: "bg-red-400"
    },
    rejected: {
        label: "Ride Rejected", sublabel: "Ride was rejected",
        dot: "bg-red-400"
    },
    expired: { label: "Request Expired", sublabel: "booking timed out", dot: "bg-orange-400" }
}

const PAYMENT_BADGE: Record<PaymentStatus, { label: string, cls: string }> = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    paid: { label: "Paid", cls: "bg-wmwrald-100 text-emerald-700" },
    cash: { label: "Cash", cls: "bg-zinc-100 text-zinc-700" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700" }
};


function page() {

    const [booking, setBooking] = useState<IBooking | null>(null)
    const [loading, setLoading] = useState(true)
    const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
    const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null)
    const [dropPos, setDropPos] = useState<[number, number] | null>(null)
    const [distanceToPickUp, setDistanceToPickUp] = useState(0)
    const [distanceToDrop, setDistanceToDrop] = useState(0)
    const [etaToPickUp, setEtaToPickUp] = useState(0)
    const [etaToDrop, setEtaToDrop] = useState(0)
    const [status, setStatus] = useState("")
    const [chatOpen, setChatOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/partner/my-active");
                if (data && data._id) {
                    setBooking(data)
                    setStatus(data.bookingStatus)
                    if (data.pickUpLocation?.coordinates && data.dropLocation?.coordinates) {
                        setPickUpPos([data.pickUpLocation.coordinates[1], data.pickUpLocation.coordinates[0]])
                        setDropPos([data.dropLocation.coordinates[1], data.dropLocation.coordinates[0]])
                    }
                }
                setLoading(false)
            } catch (error: any) {
                console.log(error?.response?.data?.message || error?.message)
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const onChatToggle = () => {
        setChatOpen(prev => !prev)
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported");
            return;
        }

        const socket = getSocket();
        const watchId = navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            setDriverPos([lat, lon])

            socket.emit("driver-location-update", {
                bookingId: booking?._id,
                latitude: lat,
                longitude: lon,
                status: status
            })
        },
            (error) => { console.log("gps error", error) },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        )

        return () => { navigator.geolocation.clearWatch(watchId) }
    }, [booking?._id])

    useEffect(() => {
        if (!booking?._id) return;
        const socket = getSocket();
        socket.emit("join-ride", booking._id);

        const handleDriverLocation = (data: any, maybeLon?: any) => {
            if (typeof data === "object" && data !== null && typeof data.latitude === "number" && typeof data.longitude === "number") {
                setDriverPos([data.latitude, data.longitude]);
            } else if (typeof data === "number" && typeof maybeLon === "number") {
                setDriverPos([data, maybeLon]);
            }
        };

        socket.on("driver-location", handleDriverLocation);
        return () => { 
            socket.off("join-ride");
            socket.off("driver-location", handleDriverLocation);
        };
    }, [booking?._id])

    if (loading) {
        return (
            <div className='h-screen w-full bg-zinc-950 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                    <p className='text-white/40 text-sm tracking-widest uppercase font-medium'>Loading Ride...</p>
                </div>
            </div>
        )
    }

    if (!booking || !pickUpPos || !dropPos) {
        return (
            <div className='h-screen w-full bg-zinc-950 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-3 text-center px-4'>
                    <p className='text-white/80 text-lg font-semibold'>No Active Ride Found</p>
                    <p className='text-white/40 text-sm max-w-sm'>You currently do not have any active ride in progress.</p>
                </div>
            </div>
        )
    }

    const cfg = STATUS_LABEL[booking?.bookingStatus! ?? "confirmed"]
    const isActive = ["confirmed", "started"].includes(status)
    const canChat = booking?.bookingStatus === "confirmed"
    const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop
    const displayDistance = status === "confirmed" ? distanceToPickUp : distanceToDrop
    const paymentStatus = PAYMENT_BADGE[booking?.paymentStatus! ?? "pending"]
    const panelProps = { isActive, displayEta, displayDistance, cfg, status, booking, paymentStatus, canChat, chatOpen, onChatToggle }


    return (
        <div className='h-screen w-full bg-zinc-100 flex flex-col lg:flex-row overflow-hidden'>
            <div className='relative flex-1 h-full z-0'>
                <LiveRideMap
                    driverLocation={driverPos}
                    pickUpLocation={pickUpPos}
                    dropLocation={dropPos}
                    mapStatus={MAP_STATUS[booking?.bookingStatus!]}
                    onStats={({ distanceToPickUp, etaToPickUp, distanceToDrop, etaToDrop }) => {
                        setDistanceToPickUp(distanceToPickUp)
                        setEtaToPickUp(etaToPickUp)
                        setDistanceToDrop(distanceToDrop)
                        setEtaToDrop(etaToDrop)
                    }}
                />


                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='absolute top-4 left-1/2 -translate-x-1/2 z-500 pointer-events-none'
                >

                    <div className='flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-zinc-100'>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                        <span className='text-xs font-semibold tracking-wide text-zinc-900'>{cfg.label}</span>
                    </div>


                </motion.div>

            </div>

            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className='hidden lg:flex w-105 xl:w-115 bg-white border border-zinc-100 flex-col overflow-hidden'
            >
                <div className='bg-zinc-950 px-6 py-5 shrink-0'>
                    <p className='text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-semibold mb-1'>Driver Panel</p>

                    <div className='flex items-center justify-between'>
                        <h1 className='text-white text-xl font-bold'>Active Ride</h1>
                        {isActive && (
                            <div className='flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full'>
                                <Zap size={12} className='text-amber-400' />
                                <span className='text-white text-xs font-semibold'>{Math.round(displayEta)} min</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto'>
                    <PanelContent {...panelProps} />
                </div>
            </motion.div>

            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-20 pointer-events-none'>

                <motion.div
                    className='bg-white rounded-t-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col'
                    animate={{ height: expanded ? "82vh" : 142 }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                >

                    <div
                        className='shrink-0 cursor-pointer select-none'
                        onClick={() => setExpanded(p => !p)}
                    >

                        <div className='pt-3 pb-1'>
                            <div className='w-10 h-1 bg-zinc-200 rounded-full mx-auto' />
                        </div>

                        <div className='px-5 py-2 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />

                                <div>
                                    <p className='text-sm font-bold text-zinc-900 leading-tight'>{cfg.label}</p>
                                    <p className='text-xs text-zinc-400 leading-tight'>{cfg.sublabel}</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3'>
                                {isActive && (
                                    <div className='text-right'>
                                        <p className='text-2xl font-black text-zinc-900 leading-none'>{Math.round(displayEta)}</p>
                                        <p className='text-[10px] text-zinc-400 uppercase tracking-wider'>min</p>
                                    </div>
                                )}

                                <motion.div
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.28 }}
                                    className='w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center'
                                >
                                    <ChevronUp size={16} className='text-zinc-600' />
                                </motion.div>
                            </div>
                        </div>

                        <div className='h-px bg-zinc-100 mx-5' />

                    </div>

                    <div className='flex-1 overflow-y-auto min-h-0 pb-6'>
                        <PanelContent {...panelProps} />
                    </div>

                </motion.div>

            </div>
        </div>
    )
}

export default page