'use client'
import React from 'react'
import L from "leaflet"
import { MapContainer, TileLayer } from 'react-leaflet'

type props = {
  pickUp: string,
  drop: string,
  onChange: (p: string, d: string) => void,
  onDistance: (d: number) => void
}

function SearchMap({ pickUp, drop, onChange, onDistance }: props) {
  return (
    <div className='relative h-full w-full bg-zinc-100'>
      <MapContainer
      style={{width:"100%", height:"100%"}} 
      center={[0,0]}
      zoom={13} 
      >
        <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        />

      </MapContainer>
    </div>
  )
}

export default SearchMap