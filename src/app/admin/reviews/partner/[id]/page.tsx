'use client'
import { IUser } from '@/models/user.model'
import axios from 'axios'
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
    const { id } = useParams()
    const [data, setData] = useState<IUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()


    const handlgGetPartner = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
            // console.log(data) 
            setData(data.partner)
            setLoading(false)
        }
        catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        handlgGetPartner()
    }, [])

    if (loading) {
        return (
            <div className='min-h-screen grid place-items-center textx-gray-500' >
                Loading Partner...
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>

            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition' onClick={()=>router.back()}> 
                        <ArrowLeft size={18} />
                    </button>

                    <div className='flex-1'>
                        <div className='font-semibold text-lg'>{data?.name}</div>
                        <div className='text-xs text-gray-500'>{data?.email}</div>
                    </div>

                    <div>
                        {
                            data?.partnerStatus === "approved" ? (
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center
                                gap-2 bg-green-100 text-green-700'>
                                    <CheckCircle size={14} />
                                    Approved
                                </div>
                            ) : data?.partnerStatus === "rejected" ? (
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center
                                gap-2 bg-red-100 text-red-700'>
                                    <XCircle size={14} />
                                    Rejected
                                </div>
                            ) : (
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center
                                gap-2 bg-yellow-100 text-yellow-700'>
                                    <Clock size={14} />
                                    Pending
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default page