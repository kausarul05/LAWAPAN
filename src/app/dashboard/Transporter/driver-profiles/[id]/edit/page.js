"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useParams } from "next/navigation";

import { useState } from "react";
import { getDriver } from "@/components/lib/data";

export default function EditDriver() {
  const params = useParams();
  const driverData = getDriver(params.id);
  
  // Local state for form inputs
  const [name, setName] = useState(driverData?.name || "");
  const [number, setNumber] = useState(driverData?.number || "");

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/Transporter/driver-profiles/${params.id}`} className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
          <ArrowLeft size={20} className="text-blue-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Edit Driver Profile Details</h1>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Driver Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Number</label>
          <input 
            type="text" 
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* License Images Section */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Driving License</label>
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* License Front */}
          <div className="relative w-full md:w-[350px] h-[200px] bg-blue-900 rounded-lg overflow-hidden border border-slate-200">
             {/* Mocking the License Image visual */}
             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70">
                <span className="text-white text-xs tracking-widest rotate-[-15deg] font-bold opacity-30">FAKE DOWNLOAD</span>
                <div className="text-white/50 text-sm mt-2">License Front View</div>
             </div>
             
             {/* Edit Icon Overlay */}
             <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition">
               <Pencil size={16} className="text-slate-700" />
             </button>
          </div>

          {/* License Back */}
          <div className="relative w-full md:w-[350px] h-[200px] bg-blue-900 rounded-lg overflow-hidden border border-slate-200">
             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70">
                <span className="text-white text-xs tracking-widest rotate-[-15deg] font-bold opacity-30">FAKE DOWNLOAD</span>
                <div className="text-white/50 text-sm mt-2">License Back View</div>
             </div>
             
             <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition">
               <Pencil size={16} className="text-slate-700" />
             </button>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <button className="flex-1 flex justify-center items-center gap-2 py-3 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-50 transition">
          <Trash2 size={18} />
          Remove
        </button>
        
        <button className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#006bbd] text-white rounded-full font-medium hover:bg-[#005da3] transition shadow-md shadow-blue-200">
          Save & Change
        </button>
      </div>
    </div>
  );
}