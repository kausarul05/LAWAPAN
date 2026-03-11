"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { getDriver } from "@/components/lib/data";


export default function DriverDetails() {
  const params = useParams();
  const driver = getDriver(params.id) || { name: "Unknown", number: "", id: "0" };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/Transporter/driver-profiles" className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
          <ArrowLeft size={20} className="text-blue-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Driver Profile Details</h1>
      </div>

      {/* Details Container */}
      <div className="border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Driver Name */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Driver Name</label>
            <div className="font-semibold text-slate-900">{driver.name}</div>
          </div>
          {/* Number */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Number</label>
            <div className="font-semibold text-slate-900">{driver.number}</div>
          </div>
        </div>
        
        <hr className="border-slate-100 mb-6" />

        {/* Driving License Placeholder */}
        <div>
           <label className="block text-sm text-slate-500 mb-2">Driving License</label>
           <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center border border-slate-200 text-slate-500">
             <FileText size={20} />
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/dashboard/Transporter/driver-profiles/${driver.id}/edit`} className="flex-1">
          <button className="w-full flex justify-center items-center gap-2 py-3 border border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 transition">
            <Pencil size={18} />
            Edit Details
          </button>
        </Link>
        
        <button className="flex-1 w-full flex justify-center items-center gap-2 py-3 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-50 transition">
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </div>
  );
}
