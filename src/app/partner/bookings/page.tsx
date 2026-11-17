'use client'
import axios from 'axios'
import React, {useEffect} from 'react'

function page() {
    useEffect(() =>  { 
        const fetch = async () => { 
            try {
                const {data} = await axios.get("/api/partner/bookings")
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    },[])
  return (
    <div>page</div>
  )
}

export default page