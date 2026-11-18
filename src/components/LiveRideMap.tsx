import React from 'react' 

type Props = { 
    driverLocation: [Number, Number] | null, 
    pickUpLocation: [Number, Number] | null, 
    dropLocation : [Number, Number] | null
}

function LiveRideMap({driverLocation, pickUpLocation, dropLocation}:Props) {
  return (
    <div>LiveRideMap</div>
  )
}

export default LiveRideMap