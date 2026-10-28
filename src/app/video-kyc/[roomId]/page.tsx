'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store"
import Image from 'next/image';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

function page() {
    const { userData } = useSelector((state: RootState) => state.user)
    const containerRef = useRef<HTMLDivElement>(null)
    const [joined, setJoined] = useState(false)
    const previewRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true)
    const [isMicOn, setIsMicOn] = useState<boolean>(true)


    useEffect(() => {
        if (joined) return
        let localstream: MediaStream
        const init = async () => {
            try {
                localstream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setStream(localstream)

                if (previewRef.current) {
                    previewRef.current.srcObject = localstream
                    console.log(localstream)
                }
            } catch (error) {
                console.log(error)
            }
        }
        init()
    }, [])

    const toggleCamera = () => {

        if (!stream) return
        stream.getVideoTracks().forEach((track) => track.enabled = !isCameraOn)
        setIsCameraOn(!isCameraOn)
    }

    const toggleMic = () => {
        if (!stream) return
        stream.getAudioTracks().forEach((track) => track.enabled = !isMicOn)
        setIsMicOn(!isMicOn)
    }

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
            setJoined(true)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>

            <div className='px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>

                <div>
                    <Image
                        src="/logo_primary.png"
                        alt="RideNest Logo"
                        width={200}
                        height={60}
                        className="h-10 md:h-12 w-auto object-contain"
                        priority
                    />
                    <p className='text-xs text-gray-400'>{userData?.role == "admin" ? "Admin Verification" : "Partner Video KYC"}</p>
                </div>

            </div>

            <div className='flex-1 relative'>
                {!joined && (
                    <div className='h-full flex items-center justify-center px-4 py-10'>

                        <div className='w-full max-w-6xl grid frid-cols-1 lg:grid-cols-2 gap-12 items-center'>

                            <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                                <video
                                    ref={previewRef}
                                    autoPlay                                    playsInline
                                    className='w-full h-75 sm:h-100 object-cover '
                                />

                                {!isCameraOn && (
                                    <div className='absolute inset-0 bg-black flex items-center justify-center'>
                                        <VideoOff size={40} />
                                    </div>
                                )}
                            </div>

                            <div className='space-y-8 text-center lg:text-left'>
                                <h1 className='text-3xl font-bold sm:text-4xl'>Secure Video KYC</h1>

                                <div className='flex justify-center lg:justify-start gap-6'>
                                    <button
                                    onClick={toggleCamera}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraOn
                                            ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                                    >{isCameraOn ? <Video /> : <VideoOff />}</button>
                                    <button
                                    onClick={toggleMic}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicOn
                                            ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                                    >{isMicOn ? <Mic /> : <MicOff />}</button>
                                </div>

                            </div>

                        </div>

                    </div>
                )}
            </div>

        </div>
    )
}

export default page