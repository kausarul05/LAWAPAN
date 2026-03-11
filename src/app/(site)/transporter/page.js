import HowItWoksTransporter from '@/components/Transporter/HowItWoksTransporter'
import IncomeCustomer from '@/components/Transporter/IncomeCustomer'
import LastFreightOffers from '@/components/Transporter/LastFreightOffers'
import ProfessionalCarriers from '@/components/Transporter/ProfessionalCarriers'
import TransporterBanner from '@/components/Transporter/TransporterBanner'

import React from 'react'
import TransporterAdvantages from '@/components/Transporter/TransporterAdvantages'
import WhyChooseLawapanTruck from '@/components/Transporter/WhyChooseLawapanTruck'
import TrustedByTransporter from '@/components/Transporter/TrustedByTransporter'
import WhatsAppLiveChat from '@/components/Shipper/WhatsAppLiveChat'
import InsuranceProtection from '@/components/Shipper/InsuranceProtection'

const page = () => {
  return (
    <div>
         
         <TransporterBanner />
         <LastFreightOffers />
         <IncomeCustomer />
         <ProfessionalCarriers />
          <HowItWoksTransporter />
          <TransporterAdvantages />
          <WhyChooseLawapanTruck />
          <TrustedByTransporter />
          <WhatsAppLiveChat />
          <InsuranceProtection />
        
    </div>
  )
}

export default page
