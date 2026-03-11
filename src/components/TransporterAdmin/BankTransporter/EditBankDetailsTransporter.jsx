"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const EditBankDetails = ({ onBack }) => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 bg-blue-50 rounded-full text-blue-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Edit Bank Details</h1>
      </div>

      <form className="max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Account Number</label>
            <input type="text" defaultValue="20000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Routing Number</label>
            <input type="text" defaultValue="20000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Bank Name</label>
            <input type="text" defaultValue="20000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Bankholder Name</label>
            <input type="text" defaultValue="20000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-semibold text-gray-700">Bank Address</label>
            <input type="text" defaultValue="20000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <button className="w-full py-4 bg-[#0070BA] text-white rounded-full font-bold text-lg mt-8 hover:bg-blue-700 transition-colors">
          Save & Change
        </button>
      </form>
    </div>
  );
};