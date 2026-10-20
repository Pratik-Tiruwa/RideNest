'use client'
import React, { useRef } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store"

function page() {
    const { userData } = useSelector((state: RootState) => state.user)

    const containerRef = useRef<HTMLDivElement>(null)
    const startCall = async () => {
        if (!containerRef || !userData?._id) {
            return null
        }

        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId,
                serverSecret!,
                "gjfgbsdh",
                userData?._id?.toString()!,
                "ayush_8541"
            )

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            // start the call
            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, //  To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                }, 
                showPreJoinView: false
            });

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div ref={containerRef} className='h-screen'>
            <button onClick={startCall}>Click</button>
        </div>
    )
}

export default page