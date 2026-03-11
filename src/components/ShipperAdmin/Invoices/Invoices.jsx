"use client";

import React, { useState } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const InvoicesPage = () => {
  const router = useRouter();
  const [invoices] = useState([
    {
      id: 'INV-2025-00428', // Removed # for cleaner URL handling
      shipmentTitle: 'Furniture Delivery',
      transporter: 'Truck Lodge',
      amount: '€150.00',
      issuedOn: '12 Feb 2025',
      status: 'Paid',
    },
    {
      id: 'INV-2025-00429',
      shipmentTitle: 'Office Supplies',
      transporter: 'Swift Gear',
      amount: '€210.00',
      issuedOn: '13 Feb 2025',
      status: 'Paid',
    }
 
  ]);

  const handleViewInvoice = (id) => {
    // Navigates to the dynamic route
    router.push(`/dashboard/Shipper/invoices/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-black">Invoices</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 text-black focus:outline-none"
            />
          </div>
          
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-[#036BB4] text-white">
              <th className="text-left py-3 px-6 text-sm font-semibold">Invoice No.</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Shipment Title</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Transporter</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Amount</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Issued On</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Status</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-black">#{invoice.id}</td>
                <td className="py-4 px-6 text-sm text-black">{invoice.shipmentTitle}</td>
                <td className="py-4 px-6 text-sm text-black">{invoice.transporter}</td>
                <td className="py-4 px-6 text-sm text-black">{invoice.amount}</td>
                <td className="py-4 px-6 text-sm text-black">{invoice.issuedOn}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    ● {invoice.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200"
                    >
                      <Eye className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;