import BidsSection from '@/components/ShipperAdmin/BidsSection'
import ShipmentStats from '@/components/ShipperAdmin/ShipmentStats'
import React from 'react'

const page = () => {
  return (
    <div>
         <ShipmentStats />
         <BidsSection />
    </div>
  )
}

export default page
