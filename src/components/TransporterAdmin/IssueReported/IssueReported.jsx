"use client";

import React, { useState } from 'react';
import { Eye, Trash2, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const IssueReported = () => {
  const router = useRouter();
  
  const [issues] = useState(Array(7).fill({
    id: 'ISS-1042',
    title: 'Delay',
    shipmentId: 'SHP-30021',
    transporter: 'Truck Lagbe',
    reportedOn: '12 Feb 2025',
    status: 'Pending'
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Issue reported</h1>
          <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden w-full md:w-80">
            <div className="pl-3 py-2 bg-white">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              className="px-2 py-2 text-sm w-full focus:outline-none text-gray-700"
            />
           
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-4 px-4 font-semibold text-sm">Issue ID</th>
                <th className="py-4 px-4 font-semibold text-sm">Issue Title</th>
                <th className="py-4 px-4 font-semibold text-sm">Shipment Id</th>
                <th className="py-4 px-4 font-semibold text-sm">Transporter</th>
                <th className="py-4 px-4 font-semibold text-sm">Reported On</th>
                <th className="py-4 px-4 font-semibold text-sm">Status</th>
                <th className="py-4 px-4 font-semibold text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {issues.map((issue, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-500 font-medium">#{issue.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{issue.title}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{issue.shipmentId}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden border border-gray-100">
                        {/* Placeholder for transporter logo */}
                      </div>
                      {issue.transporter}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{issue.reportedOn}</td>
                  <td className="py-4 px-4">
                    <span className="bg-[#FF5C00] text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => router.push(`/dashboard/Transporter/Issue-reported/${issue.id}`)}
                        className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
           <div className="flex items-center justify-end gap-2 mt-8">
              <button className="w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4]">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[1, 2, 3, 4, '...', 30].map((page, i) => (
                <button 
                  key={i}
                  className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                    page === 1 ? 'bg-[#036BB4] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4]">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
      </div>
    </div>
  );
};

export default IssueReported;