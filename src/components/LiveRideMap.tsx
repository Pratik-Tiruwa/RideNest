import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from "leaflet"

type Props = {
    driverLocation: [Number, Number] | null,
    pickUpLocation: [Number, Number] | null,
    dropLocation: [Number, Number] | null
}

const pickUpIcon = new L.DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28)">
        <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        PICKUP
        </div>
        <div style="width:2px;height:9px;background:#0a0a0a"></div>
        <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
        </div>`,
    className: "",
    iconSize: [80, 50],
    iconAnchor: [40, 50]
})

const dropIcon = new L.DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28)">
        <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        DROP
        </div>
        <div style="width:2px;height:9px;background:#0a0a0a"></div>
        <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
        </div>`,
    className: "",
    iconSize: [70, 50],
    iconAnchor: [35, 50]
})

const driverIcon = new L.DivIcon({
    html: `<div id="car-marker" style=" 
            width:38px; height:38px;
            display:flex;align-items:center;justify-content:center;
            transform-origin:center;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
            "> 
            <div style=" 
            background:#0a0a0a; 
            width:34px; height:34px;
            border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            box-shadow: 0 0 0 2.5px #fff, 0 4px 14px rgba(0,0,0,0.35);
            ">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 11L6.5 6.5H17.5L19 11" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
            <rect x="3" y="11" width="18" height="7" rx="2" stroke="white" stroke-width="1.6" />
            <circle cx="7.5" cy="18.5" r="1.5" fill="white" />
            <circle cx="16.5" cy="18.5" r="1.5" fill="white" />
            <path d="M3 14H21" stroke="white" stroke-width="1" opacity="0.35" />
            </svg>
            </div>
            </div>
            `,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19]
})

function LiveRideMap({ driverLocation, pickUpLocation, dropLocation }: Props) {
    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={pickUpLocation as any}
                zoom={13}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
                    url={process.env.NEXT_PUBLIC_CARDO_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                />

                {pickUpLocation && (
                    <Marker
                        position={pickUpLocation as any}
                        icon={pickUpIcon}
                        draggable
                    />
                )}

                {dropLocation && (
                    <Marker
                        position={dropLocation as any}
                        icon={dropIcon}
                        draggable
                    />
                )}

                {driverLocation && <Marker
                    position={driverLocation as any}
                    icon={driverIcon}
                    draggable
                />}
            </MapContainer>
        </div>
    )
}

export default LiveRideMap