'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from "leaflet"
import axios from 'axios'

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

function SearchMap({ pickUpCoords, dropCoords, onDistance }: Props) {

  const [route, setRoute] = useState<[number, number][]>([])
  const [km, setKm] = useState<number | null>()

  const loadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`)
      console.log(data)

      if(!data.routes.length) return; 
      setRoute(data.routes[0].geometry.coordinates.map(([lon, lat]:number[]) => [lat, lon]))
      const distKm = +((data.routes[0].distance)/1000).toFixed(2)
      setKm(distKm)
      onDistance(distKm)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (pickUpCoords && dropCoords) {
      loadRoute(pickUpCoords, dropCoords)
    }
  }, [pickUpCoords, dropCoords])

  return (
    <div className='relative h-full w-full bg-zinc-100'>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={pickUpCoords ?? [19.0760, 72.8777]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          url={process.env.NEXT_PUBLIC_CARDO_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />

        {pickUpCoords && dropCoords && <FitBound p1={pickUpCoords} p2={dropCoords} />} 

        {pickUpCoords && <Marker position={pickUpCoords} icon={pickUpIcon}  />} 

        {dropCoords && <Marker position={dropCoords} icon={dropIcon} />}

        {route.length > 0 && ( 
          <> 
            <Polyline 
            positions={route} 
            pathOptions={{color:"#0a0a0a", weight:4, lineCap:"round", lineJoin:"round"}}
            />
          </>
        )} 
      </MapContainer>
    </div>
  )
}

export default SearchMap
