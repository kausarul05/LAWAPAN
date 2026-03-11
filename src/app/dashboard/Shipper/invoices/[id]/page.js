"use client";

import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

const InvoiceDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const invoiceData = {
    invoiceNumber: `Invoice #${id || "INV-2025-00428"}`,
    status: 'Paid',
    totalAmount: '€150.00',
    issuedOn: '12 Feb 2025',
    dueDate: '19 Feb 2025',
    paymentMethod: 'Bank Transfer',
    shipmentId: '#####',
    shipmentTitle: 'Ship 12 Pallets of Rice',
    pickupAddress: 'Rue 14.13, Ouagadougou',
    deliveryAddress: 'Rue 14.12, Ouagadougou',
    weightCategory: 'Heavy / Logistics',
    dateOfDelivery: '14 Feb, 3:35 PM',
    costBreakdown: [
      { item: 'Transport Fee', amount: '€130.00' },
      { item: 'Platform Service Fee', amount: '€2.00' },
    ],
    total: '€150.00',
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen p-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
        </button>
        <h1 className="text-xl font-bold text-[#1A1C21]">Invoice Summary</h1>
      </div>

      {/* Main Invoice Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Invoice ID and Status Badge */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{invoiceData.invoiceNumber}</h2>
          <div className="flex items-center gap-2 bg-[#4ADE80] text-white px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Paid
          </div>
        </div>

        <div className="p-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-10">
            <div className="relative w-25 h-20 ">
              {/* Replace with your actual logo path */}
              <div className="text-center mb-6">
                    <img src="/login-logo (2).png" alt="LAWAPAN Logo" className="w-full h-full  mb-5" />
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 mb-10">
            {/* Left Column: Summary */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-base">Invoice Summary</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Total amount</span>
                  <span className="text-gray-800 font-bold">€150.00</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Issued on</span>
                  <span className="text-gray-800 font-bold">12 Feb 2025</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Due Date</span>
                  <span className="text-gray-800 font-bold">19 Feb 2025</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Payment Method</span>
                  <span className="text-gray-800 font-bold">Bank Transfer</span>
                </div>
              </div>
            </div>

            {/* Right Column: Shipment Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-base">Shipment Information</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Shipment ID</span>
                  <span className="text-gray-800 font-bold">#####</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Shipment title</span>
                  <span className="text-gray-800 font-bold">Ship 12 Pallets of Rice</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Pickup address</span>
                  <span className="text-gray-800 font-bold text-sm">Rue 14.13, Ouagadougou</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Delivery address</span>
                  <span className="text-gray-800 font-bold text-sm">Rue 14.12, Ouagadougou</span>
                </div>
                {/* Weight Category with Pink Highlight */}
                <div className="flex flex-col bg-[#FEE2E2] -mx-2 px-2 py-1">
                  <span className="text-xs text-gray-400 font-medium">Weight / category</span>
                  <span className="text-gray-800 font-bold text-sm">Heavy / Logistics</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">Date of delivery</span>
                  <span className="text-gray-800 font-bold">14 Feb, 3:35 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="font-bold text-gray-800 p-4 border-b border-gray-100">Cost Breakdown</h3>
            <table className="w-full text-left">
              <thead className="bg-[#0070BA] text-white">
                <tr>
                  <th className="py-3 px-6 text-sm font-semibold">Item</th>
                  <th className="py-3 px-6 text-sm font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-500 font-medium">Transport Fee</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-bold text-right">€130.00</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-500 font-medium">Platform Service Fee</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-bold text-right">€2.00</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-4 px-6 text-sm text-gray-500 font-bold">Total</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-bold text-right">€150.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="max-w-4xl mx-auto mt-6">
        <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-[#0070BA] text-[#0070BA] rounded-xl font-bold hover:bg-blue-50 transition-all">
          <Download className="w-5 h-5" />
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;