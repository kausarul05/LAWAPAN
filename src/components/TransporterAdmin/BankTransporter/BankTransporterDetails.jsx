"use client";
import React from 'react';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';

const BankDetailsView = ({ onEdit }) => {
  const details = {
    accountNumber: "40T Semi-Trailer",
    routingNumber: "AB-5432-CI",
    bankName: "40T Semi-Trailer",
    bankholderName: "AB-5432-CI",
    bankAddress: "40 Tons"
  };

  return (
    <div className="p-6 bg-[#F4F7FA] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="p-2 bg-blue-50 rounded-full text-blue-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Bank Details</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
          <Plus size={16} /> Add Account
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Account</h2>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200"
          >
            <Pencil size={14} /> Edit Details
          </button>
        </div>

        <div className="grid grid-cols-2">
          <div className="p-6 border-r border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Account Number</p>
            <p className="font-bold text-gray-800">{details.accountNumber}</p>
          </div>
          <div className="p-6 border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Routing Number</p>
            <p className="font-bold text-gray-800">{details.routingNumber}</p>
          </div>
          <div className="p-6 border-r border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Bank Name</p>
            <p className="font-bold text-gray-800">{details.bankName}</p>
          </div>
          <div className="p-6 border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Bankholder Name</p>
            <p className="font-bold text-gray-800">{details.bankholderName}</p>
          </div>
          <div className="p-6 col-span-2">
            <p className="text-sm text-gray-400 mb-1">Bank Address</p>
            <p className="font-bold text-gray-800">{details.bankAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsView;