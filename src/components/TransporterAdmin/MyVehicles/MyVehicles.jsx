"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const vehicles = [
  { id: 1, name: "Mercedes Actros – 20T", plate: "AB-345-CD", img: "https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg" },
  { id: 2, name: "Volvo FH16", plate: "XY-123-ZZ", img: "https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg" },
  // ... more items
];

export default function MyVehicles() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-blue-50 text-[#036BB4] px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition">
            <Plus size={18} /> Add Vehicle
          </button>
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2 border border-gray-400 text-black rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute left-3 top-2.5 text-gray-700" size={18} />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 flex flex-col items-center group hover:shadow-md transition">
            <Image src={v.img} alt={v.name} width={200} height={128} className="w-full h-32 object-contain mb-4 group-hover:scale-105 transition duration-300" />
            <h3 className="font-bold text-gray-800 text-sm text-center line-clamp-1">{v.name}</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase mt-1 mb-4 tracking-widest">{v.plate}</p>
            
            <div className="flex gap-2">
              <Link href={`/dashboard/Transporter/my-vehicles/${v.id}`}>
                <button className="p-2.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition">
                  <Eye size={16} />
                </button>
              </Link>
              <Link href={`/dashboard/Transporter/my-vehicles/${v.id}?edit=true`}>
                <button className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                  <Pencil size={16} />
                </button>
              </Link>
              <button className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Same as Image 2) */}
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
  );
}