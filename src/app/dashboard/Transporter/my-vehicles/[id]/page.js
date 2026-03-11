 "use client";
import React, { useState, useEffect } from 'react';

import { 
  ArrowLeft, ChevronLeft, ChevronRight, FileText, 
  Pencil, Trash2, Save, X, Plus 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function VehicleDynamicPage() {
  const router = useRouter();
  const { id } = useParams();

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [vehicle, setVehicle] = useState({
    id: id,
    name: "Closed Truck",
    plate: "AB-345-CD",
    type: "Trailer",
    capacity: "40 Tons",
    year: "2018",
    images: ["https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg"]
  });

  // --- HANDLERS ---
  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Vehicle Updated Successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this vehicle?")) {
      router.push('/vehicles'); // Redirect to your "My Vehicles" list
    }
  };

  if (!id) return <div className="p-10 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => isEditing ? setIsEditing(false) : router.back()}
              className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-full hover:bg-indigo-100 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {isEditing ? 'Edit Vehicle Details' : 'Vehicle Details'}
            </h1>
          </div>
          {isEditing && (
            <button 
              onClick={handleSave}
              className="bg-[#4F46E5] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Save size={18} /> Save Changes
            </button>
          )}
        </div>

        {/* MAIN CARD CONTAINER */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          {isEditing ? (
            <EditForm vehicle={vehicle} onChange={handleUpdate} onDelete={handleDelete} />
          ) : (
            <DetailsView vehicle={vehicle} onEdit={() => setIsEditing(true)} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: DETAILS VIEW (IMAGE 3) ---
function DetailsView({ vehicle, onEdit, onDelete }) {
  return (
    <div className="p-6 md:p-10">
      {/* Slider Area */}
      <div className="relative w-full h-80 bg-[#F3F4F6] rounded-3xl mb-10 group flex items-center justify-center overflow-hidden">
        <img src={vehicle.images[0]} className="h-full object-contain" alt="Truck" />
        <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition duration-300">
          <button className="bg-white p-3 rounded-full shadow-xl text-gray-600"><ChevronLeft /></button>
          <button className="bg-white p-3 rounded-full shadow-xl text-gray-600"><ChevronRight /></button>
        </div>
        <div className="absolute bottom-6 flex gap-2">
          <div className="w-2.5 h-2.5 bg-[#4F46E5] rounded-full" />
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-5">Vehicle Details</h2>
      
      {/* Table-style Info Grid */}
      <div className="grid grid-cols-2 border border-gray-100 rounded-2xl overflow-hidden mb-10">
        <InfoItem label="Vehicle Name" value={vehicle.name} bR bB />
        <InfoItem label="Plate Number" value={vehicle.plate} bB />
        <InfoItem label="Vehicle Type" value={vehicle.type} bR bB />
        <InfoItem label="Capacity" value={vehicle.capacity} bB />
        <InfoItem label="Year / Model" value={vehicle.year} colSpan2 />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 border border-gray-100 rounded-2xl overflow-hidden mb-10">
        <DocItem label="Plate ID" bR bB />
        <DocItem label="Insurance" bB />
        <DocItem label="Technical Visit" colSpan2 />
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={onEdit} className="flex-1 py-4 border-2 border-[#4F46E5] text-[#4F46E5] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition">
          <Pencil size={18} /> Edit Details
        </button>
        <button onClick={onDelete} className="flex-1 py-4 border-2 border-red-500 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-50 transition">
          <Trash2 size={18} /> Remove
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: EDIT FORM (IMAGE 1) ---
function EditForm({ vehicle, onChange, onDelete }) {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <InputField label="Vehicle Name" name="name" value={vehicle.name} onChange={onChange} />
        <InputField label="Plate Number" name="plate" value={vehicle.plate} onChange={onChange} />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Vehicle Type</label>
          <select name="type" value={vehicle.type} onChange={onChange} className="w-full p-4 border rounded-2xl bg-[#F9FAFB] outline-none text-black">
            <option>Trailer</option>
            <option>Truck</option>
          </select>
        </div>
        <InputField label="Capacity" name="capacity" value={vehicle.capacity} onChange={onChange} />
        <div className="md:col-span-2">
          <InputField label="Year / Model" name="year" value={vehicle.year} onChange={onChange} />
        </div>
      </div>

      {/* Edit Documents Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {["Plate ID", "Insurance", "Technical Visit"].map((doc) => (
          <div key={doc} className="space-y-2">
            <label className="text-sm font-bold text-gray-700">{doc}</label>
            <div className="relative h-40 bg-gray-50 border rounded-2xl flex items-center justify-center group overflow-hidden">
               <FileText size={40} className="text-gray-200" />
               <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"><Pencil size={14} className="text-gray-600"/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Images Section */}
      <div className="space-y-3 mb-10">
        <label className="text-sm font-bold text-gray-700">Vehicle Images</label>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative h-44 rounded-2xl overflow-hidden border">
              <img src={vehicle.images[0]} className="w-full h-full object-cover" alt="truck" />
              {i === 1 && (
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"><Pencil size={14} className="text-gray-600"/></button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={onDelete} className="w-full py-4 border-2 border-red-500 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-50 transition">
        <Trash2 size={20} /> Remove Vehicle
      </button>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const InfoItem = ({ label, value, bR, bB, colSpan2 }) => (
  <div className={`p-5 ${bR ? 'border-r' : ''} ${bB ? 'border-b' : ''} ${colSpan2 ? 'col-span-2' : ''}`}>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="font-bold text-gray-800 text-lg">{value}</p>
  </div>
);

const DocItem = ({ label, bR, bB, colSpan2 }) => (
  <div className={`p-5 ${bR ? 'border-r' : ''} ${bB ? 'border-b' : ''} ${colSpan2 ? 'col-span-2' : ''}`}>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    <FileText className="text-gray-300" size={30} />
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input {...props} className="w-full p-4 border rounded-2xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition text-black placeholder-gray-400" />
  </div>
);