import TrustedBy from '@/components/Home/TrustedBy'
import BenefitsForBusinesses from '@/components/Shipper/BenefitsForBusinesses'
import HowItWorksSimple from '@/components/Shipper/HowItWorksSimple '
import InsuranceProtection from '@/components/Shipper/InsuranceProtection'
import Services from '@/components/Shipper/Services'
import ShipperBanner from '@/components/Shipper/ShipperBanner'
import Banner from '@/components/Shipper/ShipperBanner'
import WhatsAppLiveChat from '@/components/Shipper/WhatsAppLiveChat'

import React from 'react'

const page = () => {
  return (
    <div>
      <ShipperBanner />
      <HowItWorksSimple />
      <Services />
      <BenefitsForBusinesses />
      <TrustedBy  />
      <WhatsAppLiveChat />
      <InsuranceProtection />
     
    </div>
  )
}

export default page
