'use client'
import React, { useEffect } from 'react'
import { motion } from "motion/react"
import axios from 'axios'

function page() {


    const fetchPendingRequests = async () => {
        try {
            const { data } = await axios.get("/api/partner/bookings/pending")
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    return (
        <div>data</div>
    )
}

export default page