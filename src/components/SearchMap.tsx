'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from "leaflet"
import axios from 'axios'
import { AnimatePresence } from 'motion/react'
import { motion } from "motion/react"
import { MapPin, Navigation2 } from 'lucide-react'

type Props = {
  pickUp: string
  drop: string
  pickUpCoords?: [number, number]
  dropCoords?: [number, number]
  onChange: (p: string, d: string) => void
  onDistance: (d: number) => void
}


function FitBound({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
      map.fitBounds([p1, p2], { padding: [60, 60], maxZoom: 15, animate: true })
    }, 100)
    return () => clearTimeout(timer)
  }, [p1, p2, map])

  return null
}



const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex; flex-direction:column; align-items:center; filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22));">  
    <div style=" 
      background:#0a0a0a; color:#fff; 
      padding:5px 14px; border-radius:100px; 
      font-size:10px; font-weight:800; letter-spacing:0.14em; 
      text-transform:uppercase; white-space:nowrap; 
      font-family:apple-system, system-ui, sans-serif; 
      box-shadow:0 2px 12px rgba(0,0,0,0.25); 
    ">PICKUP</div> 
    <div style="width:2px; height:10px; background:#0a0a0a; opacity:0.4;"></div> 
    <div style=" 
      width:13px; height:13px; background:#0a0a0a; border-radius:50%;
      border:3px solid #fff; 
      box-shadow: 0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3); 
    "></div> 
  </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58]
})

const dropIcon = new L.DivIcon({
  html: `<div style="display:flex; flex-direction:column; align-items:center; filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22));">  
    <div style=" 
      background:#e11d48; color:#fff; 
      padding:5px 14px; border-radius:100px; 
      font-size:10px; font-weight:800; letter-spacing:0.14em; 
      text-transform:uppercase; white-space:nowrap; 
      font-family:apple-system, system-ui, sans-serif; 
      box-shadow:0 2px 12px rgba(225,29,72,0.3); 
    ">DROP</div> 
    <div style="width:2px; height:10px; background:#e11d48; opacity:0.4;"></div> 
    <div style=" 
      width:13px; height:13px; background:#e11d48; border-radius:50%;
      border:3px solid #fff; 
      box-shadow: 0 0 0 2px rgba(225,29,72,0.2), 0 3px 10px rgba(0,0,0,0.3); 
    "></div> 
  </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58]
})

function SearchMap({ pickUp, drop, pickUpCoords, dropCoords, onDistance, onChange }: Props) {

  const [p1, setP1] = useState<[number, number] | undefined>(pickUpCoords)
  const [p2, setP2] = useState<[number, number] | undefined>(dropCoords)
  const [route, setRoute] = useState<[number, number][]>([])
  const [km, setKm] = useState<number | null>(0)
  const [ready, setReady] = useState(false)
  const initialLoaded = useRef(false)

  // Sync internal state only if not already initialized
  useEffect(() => {
    if (!p1 && pickUpCoords) setP1(pickUpCoords)
  }, [pickUpCoords, p1])

  useEffect(() => {
    if (!p2 && dropCoords) setP2(dropCoords)
  }, [dropCoords, p2])

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`)
      if (!data.features.length) return null
      const [lon, lat] = data.features[0].geometry.coordinates
      return [lat, lon]
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const reverseGeoCoding = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        timeout: 3500
      })

      if (data?.address) {
        const addr = data.address
        const parts = [
          addr.road || addr.pedestrian || addr.suburb,
          addr.neighbourhood || addr.suburb,
          addr.city || addr.town || addr.village || addr.county,
          addr.state
        ].filter(Boolean)
        return Array.from(new Set(parts)).join(", ") || data.display_name
      }
    } catch {
      // Fallback: BigDataCloud free client geocoding API
      try {
        const { data } = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
          { timeout: 3000 }
        )
        const parts = [data.locality, data.city, data.principalSubdivision].filter(Boolean)
        return Array.from(new Set(parts)).join(", ") || null
      } catch (err) {
        console.warn("Reverse geocoding error : ", err)
      }
    }
    return null
  }


  const loadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`)

      if (!data.routes || !data.routes.length) return
      setRoute(data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
      const distKm = +((data.routes[0].distance) / 1000).toFixed(2)
      setKm(distKm)

      if (onDistance) {
        onDistance(distKm)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const dragPickUp = async (lat: number, lon: number) => {
    const newP1: [number, number] = [lat, lon]
    setP1(newP1)

    const destination = p2 ?? dropCoords
    if (destination) {
      loadRoute(newP1, destination)
    }

    const addr = await reverseGeoCoding(lat, lon)
    if (addr) {
      onChange?.(addr, drop)
    }
  }

  const dragDrop = async (lat: number, lon: number) => {
    const newP2: [number, number] = [lat, lon]
    setP2(newP2)

    const pickup = p1 ?? pickUpCoords
    if (pickup) {
      loadRoute(pickup, newP2)
    }

    const addr = await reverseGeoCoding(lat, lon)
    if (addr) {
      onChange?.(pickUp, addr)
    }
  }

  useEffect(() => {
    setReady(true)
    if (pickUp && drop && (!pickUpCoords || !dropCoords)) {
      (async () => {
        const a = await geoCoding(pickUp)
        const b = await geoCoding(drop)

        if (!a || !b) return
        setP1(a)
        setP2(b)
        await loadRoute(a, b)
        setReady(false)
      })()
    }
  }, [pickUp, drop, pickUpCoords, dropCoords])

  // Initial route load only once on mount
  useEffect(() => {
    if (!initialLoaded.current && pickUpCoords && dropCoords) {
      initialLoaded.current = true
      loadRoute(pickUpCoords, dropCoords)
    }
  }, [pickUpCoords, dropCoords])

  const currentPickup = p1 ?? pickUpCoords
  const currentDrop = p2 ?? dropCoords

  return (
    <div className='relative h-full w-full bg-zinc-100'>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={currentPickup ?? [19.0760, 72.8777]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          url={process.env.NEXT_PUBLIC_CARDO_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />

        {currentPickup && currentDrop && <FitBound p1={currentPickup} p2={currentDrop} />}

        {currentPickup && (
          <Marker
            position={currentPickup}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: e => {
                const m = e.target.getLatLng()
                dragPickUp(m.lat, m.lng)
              }
            }}
          />
        )}

        {currentDrop && (
          <Marker
            position={currentDrop}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: e => {
                const m = e.target.getLatLng()
                dragDrop(m.lat, m.lng)
              }
            }}
          />
        )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "#0a0a0a", weight: 4, lineCap: "round", lineJoin: "round" }}
          />
        )}
      </MapContainer>


      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className='absolute inset-0 z-999 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4'
          >

            <div className='relative w-14 h-14 flex items-center justify-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className='absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900'
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className='absolute inset-2 rounded-full border border-transparent border-t-zinc-300'
              />
              <MapPin size={15} className='text-zinc-800' />
            </div>
            <div className='text-center'>
              <p className='text-zinc-900 text-xs font-black tracking-[0.22em] uppercase'>Loading Map</p>
              <p className='text-zinc-400 text-[10px] font-medium tracking-wider mt-0.5'>Plotting your route...</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {ready && km !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className='absolute bottom-20 left-4 z-500 flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg'
          >

            <Navigation2 size={13} className='text-zinc-900' />
            <span className='text-zinc-900 text-xs font-bold'>{km} km</span>
            <span className='w-px h-3 bg-zinc-200' />
            <span> ~{Math.max(3, Math.round((km / 25) * 60))} min</span>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchMap
