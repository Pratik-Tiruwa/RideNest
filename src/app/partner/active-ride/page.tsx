'use client'
import { IBooking } from '@/models/booking.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function page() {

    const [booking,setBooking] = useState<IBooking | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/partner/my-active");
                setBooking(data)
                setLoading(false)
            } catch (error: any) {
                console.log(error.response.data.message)
                setLoading(false)
            }
        }
        fetch()
    }, []) 


    return (
        <div className='h-screen w-full bg-zinc-100 flex flex-col lg:flex-row overflow-hidden'>

        </div>
    )
}

export default page