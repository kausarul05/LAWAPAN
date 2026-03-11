"use client"


import WithdrawRequestComponent from '@/components/TransporterAdmin/Withdraw/WithdrawRequestComponent';
import WithdrawsComponent from '@/components/TransporterAdmin/Withdraw/WithdrawsComponent';
import { useState } from 'react';
import React from 'react'

const Page = () => {
  const [showWithdrawRequest, setShowWithdrawRequest] = useState(false);
  return (
    <div className="min-h-screen bg-[#ffff] text-black p-4 rounded-lg  font-inter">
      <div className="w-full  p-6 sm:p-8">
        {showWithdrawRequest ? (
          <WithdrawRequestComponent onBack={() => setShowWithdrawRequest(false)} />
        ) : (
          <WithdrawsComponent onWithdrawClick={() => setShowWithdrawRequest(true)} />
        )}
      </div>
    </div>
  )
}

export default Page