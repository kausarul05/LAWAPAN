// app/earnings/[id]/page.js
import React from 'react';
import Link from 'next/link';

export default function TransactionDetails({ params }) {
  // In a real app, you would fetch data using params.id
  const details = {
    fullName: "Jane Cooper",
    email: "abc@example.com",
    phone: "(319) 555-0115",
    transactionId: params.id || "12345678",
    holderName: "Wade Warren",
    accNumber: "**** **** *456",
    received: "$ 500",
    deduct: "$100",
    final: "$400",
    image: "https://i.pravatar.cc/300?img=12" 
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden p-8 font-sans">
        {/* Close Button */}
        <Link href="/dashboard/Transporter/earning" className="absolute top-4 right-4 bg-[#0070BA] text-white rounded-full p-1 hover:bg-blue-600 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* User Profile Header */}
        <div className="flex gap-4 items-start mb-8">
          <img src={details.image} alt="User" className="w-24 h-24 rounded-lg object-cover" />
          <div className="space-y-1">
            <p className="text-gray-600">Full name : <span className="font-bold text-gray-800">{details.fullName}</span></p>
            <p className="text-gray-600">Email: <span className="font-bold text-gray-800">{details.email}</span></p>
            <p className="text-gray-600">Phone number: <span className="font-bold text-gray-800">{details.phone}</span></p>
          </div>
        </div>

        {/* Transaction Details */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction Details :</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-gray-600">
            <span>Transaction ID :</span>
            <span className="text-gray-500 font-medium">{details.transactionId}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>A/C holder name:</span>
            <span className="text-gray-500 font-medium">{details.holderName}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>A/C number:</span>
            <span className="text-gray-500 font-medium">{details.accNumber}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 pt-2">
            <span>Received amount:</span>
            <span className="text-gray-500 font-medium">{details.received}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Detect Percentage:</span>
            <span className="text-gray-500 font-medium">{details.deduct}</span>
          </div>
          <div className="flex justify-between items-center text-gray-800 font-bold text-lg pt-2 border-t mt-2">
            <span>Final Amount:</span>
            <span>{details.final}</span>
          </div>
        </div>
      </div>
    </div>
  );
}