"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const ReportedIssueDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const data = {
    issueId: `#INV-2025-00428`,
    status: 'Pending',
    title: 'Delay',
    shipmentId: 'SHP-30021',
    transporter: 'Truck Lagbe',
    reportedOn: 'Bank Transfer', // Based on your image label
    description: 'Delay'
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Issue Summary</h1>
      </div>

      {/* Detail Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Issue ID {data.issueId}</h2>
          <div className="flex items-center gap-2 bg-[#FF5C00] text-white px-3 py-1 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {data.status}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Issue Title</label>
              <p className="text-gray-800 font-bold text-base">{data.title}</p>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Shipment Id</label>
              <p className="text-gray-800 font-bold text-base">{data.shipmentId}</p>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Transporter</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-blue-50 border border-gray-100"></div>
                <p className="text-gray-800 font-bold text-sm">{data.transporter}</p>
              </div>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Reported On</label>
              <p className="text-gray-800 font-bold text-base">{data.reportedOn}</p>
            </section>

            <section className="space-y-1 pb-10">
              <label className="text-sm text-gray-400 font-medium">Issue Description</label>
              <p className="text-gray-800 font-bold text-base">{data.description}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportedIssueDetailPage;