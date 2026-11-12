'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Bike, Car, CheckCircle, ChevronRight, LocateFixed, MapPin, Navigation, Phone, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import axios from 'axios'
import { formatPlaceSuggestion, Place, reverseGeoCode, searchPlaces } from '@/lib/geocoding'

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const VEHICLES = [
  { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & affordable" },
  { id: "auto", label: "Auto", Icon: Car, desc: "Everyday rides" },
  { id: "car", label: "Car", Icon: Car, desc: "Comfort rides" },
  { id: "loading", label: "Loading", Icon: Truck, desc: "Small cargo" },
  { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy transport" }
]

function page() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<vehicleType>()
  const [mobile, setMobile] = useState("")
  const [pickUp, setPickUp] = useState("")
  const [drop, setDrop] = useState("")
  const [pickUpCountry, setPickUpCountry] = useState("")
  const [pickUpCountryCode, setPickUpCountryCode] = useState("")
  const [pickUpLat, setPickUpLat] = useState<number>()
  const [pickUpLon, setPickUpLon] = useState<number>()
  const [dropCountry, setDropCountry] = useState("")
  const [dropLat, setDropLat] = useState<number>()
  const [dropLon, setDropLon] = useState<number>()
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [pickUpSuggestion, setPickUpSuggestion] = useState<Place[]>([])
  const [dropSuggestion, setDropSuggestion] = useState<Place[]>([])

  const routeBoxRef = useRef<HTMLDivElement>(null)
  const pickUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pickUpAbortRef = useRef<AbortController | null>(null)
  const dropAbortRef = useRef<AbortController | null>(null)

  const hasPickupCoords = pickUpLat !== undefined && pickUpLon !== undefined
  const hasDropCoords = dropLat !== undefined && dropLon !== undefined

  const stepsCompleted = [
    Boolean(vehicle),
    mobile.length == 10,
    Boolean(pickUp) && hasPickupCoords,
    Boolean(drop) && hasDropCoords
  ]
  const canContinue = Boolean(vehicle && mobile && pickUp && drop && hasPickupCoords && hasDropCoords)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (routeBoxRef.current && !routeBoxRef.current.contains(event.target as Node)) {
        setPickUpSuggestion([])
        setDropSuggestion([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (pickUpTimerRef.current) clearTimeout(pickUpTimerRef.current)
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current)
      pickUpAbortRef.current?.abort()
      dropAbortRef.current?.abort()
    }
  }, [])

  const scheduleAddressSearch = (
    query: string,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    abortRef: React.MutableRefObject<AbortController | null>,
    setResults: (r: Place[]) => void,
    options?: { biasLat?: number; biasLon?: number; countryCode?: string }
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    abortRef.current?.abort()

    if (!query || query.trim().length < 3) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const results = await searchPlaces(query, {
          ...options,
          signal: controller.signal,
        })
        setResults(results)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.log(error)
          setResults([])
        }
      }
    }, 300)
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    setLocationError("")
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geo = await reverseGeoCode(coords.latitude, coords.longitude)
          const fallbackLabel = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`

          setPickUp(geo?.address || fallbackLabel)
          setPickUpCountry(geo?.country || "")
          setPickUpCountryCode(geo?.countryCode || "")
          setPickUpLat(coords.latitude)
          setPickUpLon(coords.longitude)
          setPickUpSuggestion([])
        } catch (error) {
          console.log(error)
          setLocationError("Could not resolve address, please select from suggestions.")
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please allow location access or type your pickup.")
        } else if (err.code === err.TIMEOUT) {
          setLocationError("Location request timed out. Please try again.")
        } else {
          setLocationError("Unable to fetch current location. Please type your pickup.")
        }
        setLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    )
  }

  return (
    <div className='min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10'>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-md'
      >

        {/* header section   */}
        <div className='flex items-center gap-4 mb-6 px-1'>
          <motion.div
            whileTap={{ scale: 0.88 }}
            onClick={() => router.back()}
            className='w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors shrink-0'
          >
            <ArrowLeft size={13} className='text-zinc-900' />
          </motion.div>

          <div className='flex-1 min-w-0'>
            <h1 className='text-zinc-900 text-lg font-black tracking-tight'>Book a Ride</h1>
            <p className='text-zinc-400 text-xs mt-0.5'>Fill in the details below</p>
          </div>

          <div className='flex items-center gap-1.5 shrink-0'>
            {
              stepsCompleted.map((isDone, i) => (
                <motion.div
                  key={i}
                  animate={{ width: isDone ? 20 : 8, background: isDone ? "#09090b" : "#d4d4d8" }}
                  transition={{ duration: 0.3 }}
                  className='h-2 rounded-full'
                />
              ))
            }
          </div>

        </div>

        <div className='bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-visible'>

          <div className='h-1 bg-zinc-900 w-[90%] m-auto' />

          <div className='p-6 space-y-7'>
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}
            >

              <div className='flex items-center gap-2 mb-3'>
                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                  <span className='text-white text-[9px] font-black'>1</span>
                </div>
                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>Choose Vehicle</p>
              </div>

              <div className='grid grid-cols-2 gap-2.5'>
                {VEHICLES.map((v, i) => {
                  const active = vehicle == v.id
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.07 + i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVehicle(v.id as vehicleType)}
                      className={`relative p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all duration-200 
                    ${active ? "bg-zinc-900 border-zinc-900 shadow-lg" : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"}
                    `}
                    >

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors 
                      ${active ? "bg-white" : "bg-zinc-200"}
                      `}>
                        <v.Icon
                          size={18}
                          className={active ? "text-zinc-900" : "text-zinc-600"}
                        />
                      </div>

                      <div className='min-w-0'>
                        <p className={`text-sm font-bold truncate ${active ? "text-white" : "text-zinc-900"}`}>{v.label}</p>
                        <p className={`text-[10px] truncate ${active ? "text-zinc-400" : "text-zinc-500"}`}>{v.desc}</p>
                      </div>

                      {active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='absolute top-2.5 right-2.5'
                        >
                          <CheckCircle size={13} className='text-white fill-white/20' />
                        </motion.div>
                      )}

                    </motion.div>
                  )
                })}
              </div>

            </motion.div>

            <div className='h-px bg-zinc-100' />

            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}
            >

              <div className='flex items-center gap-2 mb-3'>

                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                  <span className='text-white text-[9px] font-black'>2</span>
                </div>

                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>Mobile</p>

              </div>

              <div className='flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus-within:border-zinc-900 focus-within:bg-white transition-all'>

                <div className='w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center shrink-0'>
                  <Phone size={14} className='text-zinc-600' />
                </div>

                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder='Enter your mobile number'
                  inputMode='numeric'
                  maxLength={15}
                  className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                />

                <AnimatePresence>
                  {mobile.length == 10 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle size={16} className='text-emerald-500 fill-emerald-50 shrink-0' />
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              <p className='text-zinc-400 text-[10px] mt-1.5 ml-1'>Ride updates will be sent to this number</p>
            </motion.div>

            <div className='h-px bg-zinc-100' />

            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}
            >

              <div className='flex items-center gap-2 mb-3'>
                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                  <span className='text-white text-[9px] font-black'>3</span>
                </div>
                <p className='text-xs font-bold uppercase text-zinc-500 tracking-widest'>Route</p>
              </div>

              <div ref={routeBoxRef} className='bg-zinc-50 border border-zinc-400 rounded-2xl overflow-visible'>

                <div className='relative z-30'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>

                    <div className='flex flex-col items-center shrink-0'>
                      <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow ' />
                      <div className='w-px h-5 bg-zinc-300 mt-1' />
                    </div>

                    <input
                      onChange={(e) => {
                        const val = e.target.value
                        setPickUp(val)
                        setPickUpLat(undefined)
                        setPickUpLon(undefined)
                        setPickUpCountry("")
                        setPickUpCountryCode("")
                        setLocationError("")
                        scheduleAddressSearch(val, pickUpTimerRef, pickUpAbortRef, setPickUpSuggestion)
                      }}
                      value={pickUp}
                      placeholder='Pickup location'
                      className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                    />

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.88 }}
                      onClick={useCurrentLocation}
                      disabled={locating}
                      title='Use current location'
                      className='w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition-colors flex items-center justify-center shrink-0'
                    >
                      <LocateFixed size={14} className={`text-zinc-700 ${locating ? "animate-spin" : ""}`} />

                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {pickUpSuggestion?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className='absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto z-50'
                      >
                        {pickUpSuggestion.map((p, i) => (
                          <motion.div
                            key={p.id || i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => {
                              setPickUp(formatPlaceSuggestion(p))
                              setPickUpCountry(p.country ?? "")
                              setPickUpCountryCode(p.countrycode ?? "")
                              setPickUpLat(p.lat)
                              setPickUpLon(p.lon)
                              setPickUpSuggestion([])
                              setLocationError("")
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 cursor-pointer'
                          >
                            <MapPin size={13} className='text-zinc-400 shrink-0' />
                            <span className='text-sm text-zinc-800 font-medium truncate'>{formatPlaceSuggestion(p)}</span>
                            <ChevronRight size={13} className='text-zinc-300 shrink-0 ml-auto' />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className='h-px bg-zinc-200' />

                <div className='relative z-10'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-b-2xl transition-colors'>

                    <div className='flex flex-col items-center shrink-0'>
                      <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow ' />
                    </div>

                    <input
                      onChange={(e) => {
                        const val = e.target.value
                        setDrop(val)
                        setDropLat(undefined)
                        setDropLon(undefined)
                        setDropCountry("")
                        scheduleAddressSearch(val, dropTimerRef, dropAbortRef, setDropSuggestion, {
                          biasLat: pickUpLat,
                          biasLon: pickUpLon,
                          countryCode: pickUpCountryCode || undefined,
                        })
                      }}
                      disabled={!hasPickupCoords}
                      value={drop}
                      placeholder={hasPickupCoords ? "Drop Location" : "Select Pick up Location First"}
                      className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none disabled:cursor-not-allowed'
                    />

                    <Navigation size={14} className='text-zinc-300 shrink-0' />

                  </div>

                  <AnimatePresence>
                    {dropSuggestion?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className='absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto z-50'
                      >
                        {dropSuggestion.map((p, i) => (
                          <motion.div
                            key={p.id || i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => {
                              setDrop(formatPlaceSuggestion(p))
                              setDropCountry(p.country ?? "")
                              setDropLat(p.lat)
                              setDropLon(p.lon)
                              setDropSuggestion([])
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 cursor-pointer'
                          >
                            <Navigation size={13} className='text-zinc-400 shrink-0' />
                            <span className='text-sm text-zinc-800 font-medium truncate'>{formatPlaceSuggestion(p)}</span>
                            <ChevronRight size={13} className='text-zinc-300 shrink-0 ml-auto' />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {locationError && (
                <p className='text-red-500 text-xs font-medium mt-2 ml-1'>{locationError}</p>
              )}

            </motion.div>


            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={canContinue ? { scale: 1.02 } : {}}
                disabled={!canContinue}
                onClick={() => {
                  router.push(`/user/search?pickup=${encodeURIComponent(pickUp)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${encodeURIComponent(mobile)}&pickuplat=${pickUpLat}&pickuplon=${pickUpLon}&droplat=${dropLat}&droplon=${dropLon}`)
                }}
                className='w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-35 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2.5 transition-colors shadow-lg disabled:shadow-none'
              >

                <span>Continue</span>

              </motion.button>

            </motion.div>

          </div>

        </div>
      </motion.div>

    </div>
  )
}

export default page