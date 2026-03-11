"use client";

import Link from "next/link";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { drivers } from "@/components/lib/data";


export default function DriverManagement() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Driver Profile Management</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Add Driver Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <Plus size={18} />
            <span className="text-sm font-medium">Add Driver</span>
          </button>
          {/* Search Bar */}
          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-full md:w-64">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="outline-none text-sm w-full placeholder:text-slate-400" 
            />
          </div>
          {/* Filter Icon Button */}
          {/* <button className="p-2 bg-[#007bff] text-white rounded-lg hover:bg-blue-600 transition">
            <SlidersHorizontal size={20} />
          </button> */}
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {drivers.map((driver) => (
          <div key={driver.id} className="border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{driver.name}</h3>
            
            {/* Phone Number */}
            <div className="flex items-center text-slate-500 text-xs mb-4">
              <span className="mr-1">📞</span>
              {driver.number}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <Link href={`/dashboard/Transporter/driver-profiles/${driver.id}`}>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 cursor-pointer transition">
                  <Eye size={14} />
                </div>
              </Link>
              <Link href={`/dashboard/Transporter/driver-profiles/${driver.id}/edit`}>
                <div className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 cursor-pointer transition">
                  <Pencil size={14} />
                </div>
              </Link>
              <button className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-2 mt-8">
        <button className="p-2 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50">
          <ChevronLeft size={18} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-[#005eb8] text-white rounded text-sm font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded text-sm">2</button>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded text-sm">3</button>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded text-sm">4</button>
        <span className="text-slate-400 text-sm">....</span>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded text-sm">30</button>

        <button className="p-2 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}