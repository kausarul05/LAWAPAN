"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, FileText, 
  Pencil, Trash2, Save, X, Plus, Loader, Upload 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getVehicleDetails, updateVehicle, deleteVehicle } from '@/components/lib/apiClient';
import { toast } from 'react-toastify';

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

export default function VehicleDynamicPage() {
  const router = useRouter();
  const { id } = useParams();

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [originalVehicle, setOriginalVehicle] = useState(null);
  
  // Document previews for editing
  const [docPreviews, setDocPreviews] = useState({
    plate_id: null,
    insurance: null,
    technical_visit: null,
    vehicle_images: null
  });
  const [newFiles, setNewFiles] = useState({
    plate_id: null,
    insurance: null,
    technical_visit: null,
    vehicle_images: null
  });

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch vehicle details
  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching vehicle details for ID:', id);
      
      const response = await getVehicleDetails(id);
      
      console.log('📦 Vehicle details:', response);

      if (response.success && response.data) {
        const vehicleData = {
          id: response.data._id,
          name: `${response.data.vehicle_type} - ${response.data.capicity}T`,
          plate: response.data.plate_number,
          type: response.data.vehicle_type,
          capacity: `${response.data.capicity} Tons`,
          year: response.data.year_model,
          vehicle_number: response.data.vehicle_number,
          plate_id: response.data.plate_id,
          insurance: response.data.insurance,
          technical_visit: response.data.technical_visit,
          images: replaceImageUrl(response.data.vehicle_images)
        };
        setVehicle(vehicleData);
        setOriginalVehicle(vehicleData);
      } else {
        throw new Error(response.message || 'Failed to fetch vehicle details');
      }
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      setError(err.message);
      
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("Set origin ", originalVehicle)

  // Handle input change
  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  // Handle file change for editing
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setNewFiles(prev => ({ ...prev, [fieldName]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSubmitting(true);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      // Create FormData for API
      const formData = new FormData();
      formData.append('transporter_id', transporterId);
      formData.append('vehicle_number', vehicle.vehicle_number || '');
      formData.append('plate_number', vehicle.plate);
      formData.append('vehicle_type', vehicle.type);
      formData.append('capicity', vehicle.capacity.replace(' Tons', ''));
      formData.append('year_model', vehicle.year);
      
      // Add new files if any
      if (newFiles.plate_id) formData.append('plate_id', newFiles.plate_id);
      if (newFiles.insurance) formData.append('insurance', newFiles.insurance);
      if (newFiles.technical_visit) formData.append('technical_visit', newFiles.technical_visit);
      if (newFiles.vehicle_images) formData.append('vehicle_images', newFiles.vehicle_images);

      console.log('📝 Updating vehicle:', id);
      
      const response = await updateVehicle(id, formData);
      
      console.log('✅ Update response:', response);

      if (response.success) {
        toast.success('Vehicle updated successfully!');
        setIsEditing(false);
        fetchVehicleDetails(); // Refresh data
        setNewFiles({ plate_id: null, insurance: null, technical_visit: null, vehicle_images: null });
        setDocPreviews({ plate_id: null, insurance: null, technical_visit: null, vehicle_images: null });
      } else {
        throw new Error(response.message || 'Failed to update vehicle');
      }
    } catch (err) {
      console.error('Error updating vehicle:', err);
      toast.error(err.message || 'Failed to update vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this vehicle?")) return;

    try {
      setSubmitting(true);
      
      console.log('🗑️ Deleting vehicle:', id);
      
      const response = await deleteVehicle(id);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        toast.success('Vehicle deleted successfully!');
        router.push('/dashboard/Transporter/my-vehicles');
      } else {
        throw new Error(response.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      toast.error(err.message || 'Failed to delete vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (vehicle?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-800 mb-4">{error || 'Vehicle not found'}</p>
            <button
              onClick={() => router.push('/dashboard/Transporter/my-vehicles')}
              className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              disabled={submitting}
              className="bg-[#4F46E5] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={18} />} 
              Save Changes
            </button>
          )}
        </div>

        {/* MAIN CARD CONTAINER */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          {isEditing ? (
            <EditForm 
              vehicle={vehicle} 
              onChange={handleUpdate} 
              onDelete={handleDelete}
              docPreviews={docPreviews}
              newFiles={newFiles}
              handleFileChange={handleFileChange}
              submitting={submitting}
            />
          ) : (
            <DetailsView 
              vehicle={vehicle} 
              currentImageIndex={currentImageIndex}
              nextImage={nextImage}
              prevImage={prevImage}
              onEdit={() => setIsEditing(true)} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: DETAILS VIEW ---
function DetailsView({ vehicle, currentImageIndex, nextImage, prevImage, onEdit, onDelete }) {
  return (
    <div className="p-6 md:p-10">
      {/* Slider Area */}
      <div className="relative w-full h-80 bg-[#F3F4F6] rounded-3xl mb-10 group flex items-center justify-center overflow-hidden">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img src={replaceImageUrl(vehicle.images[currentImageIndex])} className="h-full object-contain" alt="Truck" />
        ) : (
          <div className="text-gray-400">No image available</div>
        )}
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition duration-300">
            <button onClick={prevImage} className="bg-white p-3 rounded-full shadow-xl text-gray-600 hover:bg-gray-50">
              <ChevronLeft />
            </button>
            <button onClick={nextImage} className="bg-white p-3 rounded-full shadow-xl text-gray-600 hover:bg-gray-50">
              <ChevronRight />
            </button>
          </div>
        )}
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute bottom-6 flex gap-2">
            {vehicle.images.map((_, idx) => (
              <div key={idx} className={`w-2.5 h-2.5 rounded-full ${idx === currentImageIndex ? 'bg-[#4F46E5]' : 'bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-5">Vehicle Details</h2>
      
      {/* Table-style Info Grid */}
      <div className="grid grid-cols-2 border border-gray-100 rounded-2xl overflow-hidden mb-10">
        <InfoItem label="Vehicle Name" value={vehicle.name} bR bB />
        <InfoItem label="Plate Number" value={vehicle.plate} bB />
        <InfoItem label="Vehicle Type" value={vehicle.type} bR bB />
        <InfoItem label="Capacity" value={vehicle.capacity} bB />
        <InfoItem label="Vehicle Number" value={vehicle.vehicle_number} bR />
        <InfoItem label="Year / Model" value={vehicle.year} />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DocItem label="Plate ID" fileUrl={replaceImageUrl(vehicle.plate_id?.[0])} />
        <DocItem label="Insurance" fileUrl={vehicle.insurance?.[0]} />
        <DocItem label="Technical Visit" fileUrl={vehicle.technical_visit?.[0]} />
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

// --- SUB-COMPONENT: EDIT FORM ---
function EditForm({ vehicle, onChange, onDelete, docPreviews, newFiles, handleFileChange, submitting }) {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <InputField label="Vehicle Name" name="name" value={vehicle.name} onChange={onChange} />
        <InputField label="Plate Number" name="plate" value={vehicle.plate} onChange={onChange} />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Vehicle Type</label>
          <select name="type" value={vehicle.type} onChange={onChange} className="w-full p-4 border rounded-2xl bg-white outline-none text-black">
            <option>Truck</option>
            <option>Trailer</option>
            <option>Van</option>
            <option>Container</option>
          </select>
        </div>
        <InputField label="Capacity (Tons)" name="capacity" value={vehicle.capacity.replace(' Tons', '')} onChange={onChange} />
        <InputField label="Vehicle Number" name="vehicle_number" value={vehicle.vehicle_number || ''} onChange={onChange} />
        <InputField label="Year / Model" name="year" value={vehicle.year} onChange={onChange} />
      </div>

      {/* Edit Documents Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <EditDocItem 
          label="Plate ID" 
          fieldName="plate_id"
          currentFile={replaceImageUrl(vehicle.plate_id?.[0])}
          preview={replaceImageUrl(docPreviews.plate_id)}
          newFile={newFiles.plate_id}
          onFileChange={handleFileChange}
        />
        <EditDocItem 
          label="Insurance" 
          fieldName="insurance"
          currentFile={replaceImageUrl(vehicle.insurance?.[0])}
          preview={replaceImageUrl(docPreviews.insurance)}
          newFile={newFiles.insurance}
          onFileChange={handleFileChange}
        />
        <EditDocItem 
          label="Technical Visit" 
          fieldName="technical_visit"
          currentFile={replaceImageUrl(vehicle.technical_visit?.[0])}
          preview={replaceImageUrl(docPreviews.technical_visit)}
          newFile={newFiles.technical_visit}
          onFileChange={handleFileChange}
        />
      </div>

      {/* Edit Images Section */}
      <div className="space-y-3 mb-10">
        <label className="text-sm font-bold text-gray-700">Vehicle Images</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EditImageItem 
            fieldName="vehicle_images"
            currentImage={replaceImageUrl(vehicle.images?.[0])}
            preview={replaceImageUrl(docPreviews.vehicle_images)}
            newFile={newFiles.vehicle_images}
            onFileChange={handleFileChange}
          />
          {vehicle.images?.slice(1, 3).map((img, idx) => (
            <div key={idx} className="relative h-44 rounded-2xl overflow-hidden border">
              <img src={img} className="w-full h-full object-cover" alt="truck" />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onDelete} 
        disabled={submitting}
        className="w-full py-4 border-2 border-red-500 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-50 transition disabled:opacity-50"
      >
        {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 size={20} />} 
        Remove Vehicle
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

const DocItem = ({ label, fileUrl }) => (
  <div className="p-5 border border-gray-100 rounded-2xl">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    {fileUrl ? (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
        <FileText size={20} /> View Document
      </a>
    ) : (
      <FileText className="text-gray-300" size={30} />
    )}
  </div>
);

const EditDocItem = ({ label, fieldName, currentFile, preview, newFile, onFileChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <div className="relative h-40 bg-gray-50 border rounded-2xl flex items-center justify-center group overflow-hidden">
      {preview ? (
        <img src={preview} alt={label} className="h-full object-contain" />
      ) : currentFile ? (
        <a href={currentFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          <FileText size={40} className="text-gray-400" />
        </a>
      ) : (
        <FileText size={40} className="text-gray-200" />
      )}
      <label className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 cursor-pointer">
        <Pencil size={14} className="text-gray-600" />
        <input type="file" accept="image/*,application/pdf" onChange={(e) => onFileChange(e, fieldName)} className="hidden" />
      </label>
      {newFile && <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">New</div>}
    </div>
  </div>
);

const EditImageItem = ({ fieldName, currentImage, preview, newFile, onFileChange }) => (
  <div className="relative h-44 rounded-2xl overflow-hidden border group">
    <img src={preview || currentImage} className="w-full h-full object-cover" alt="truck" />
    <label className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 cursor-pointer">
      <Pencil size={14} className="text-gray-600" />
      <input type="file" accept="image/*" onChange={(e) => onFileChange(e, fieldName)} className="hidden" />
    </label>
    {newFile && <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">New</div>}
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input {...props} className="w-full p-4 border rounded-2xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition text-black placeholder-gray-400" />
  </div>
);