'use client'
import React from 'react'

type props = {
  pickUp: string,
  drop: string,
  onChange: (p: string, d: string) => void,
  onDistance: (d: number) => void
}

function SearchMap({ pickUp, drop, onChange, onDistance }: props) {
  return (
    <div className='relative h-full w-full bg-zinc-100'></div>
  )
}

export default SearchMap