import LogisticsDashboard from '@/components/TransporterAdmin/LogisticsDashboard'
import TransporterStats from '@/components/TransporterAdmin/TransporterStats'
import React from 'react'

const page = () => {
  return (
    <div>
        <TransporterStats />  
          <LogisticsDashboard />
    </div>
  )
}

export default page
