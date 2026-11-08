'use client'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

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

function SearchMap({ pickUpCoords, dropCoords }: Props) {
  return (
    <div className='relative h-full w-full bg-zinc-100'>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={pickUpCoords ?? [19.0760, 72.8777]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {pickUpCoords && dropCoords && (
          <FitBound p1={pickUpCoords} p2={dropCoords} />
        )}
      </MapContainer>
    </div>
  )
}

export default SearchMap
