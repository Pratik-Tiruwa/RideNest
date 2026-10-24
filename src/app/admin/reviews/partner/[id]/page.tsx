'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
    const {id} = useParams()
    const handlgGetPartner = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
            console.log(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        handlgGetPartner()
    }, [])

    return (
        <div></div>
    )
}

export default page