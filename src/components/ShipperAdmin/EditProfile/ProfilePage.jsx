"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import { getShipperProfile, updateShipperProfile } from "../../../components/lib/apiClient";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("editProfile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  // Get shipper ID from localStorage
  const getShipperId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shipper_id');
    }
    return null;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const shipperId = getShipperId();
      if (!shipperId) {
        throw new Error('Shipper ID not found. Please login again.');
      }

      console.log('🔍 Fetching shipper profile for ID:', shipperId);
      
      const response = await getShipperProfile(shipperId);
      
      console.log('📦 Profile response:', response);

      if (response.success && response.data) {
        const profileData = {
          fullName: response.data.shipper_name || response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || response.data.contact_number || ''
        };
        setProfile(profileData);
        setFormData(profileData);
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      alert('Full name is required');
      return;
    }
    
    try {
      setSaving(true);
      
      const shipperId = getShipperId();
      if (!shipperId) {
        throw new Error('Shipper ID not found. Please login again.');
      }
      
      const updateData = {
        shipper_name: formData.fullName
      };
      
      console.log('📝 Updating profile for ID:', shipperId, updateData);
      
      const response = await updateShipperProfile();
      
      console.log('✅ Update response:', response);
      
      if (response.success) {
        alert('Profile updated successfully!');
        setProfile({ ...profile, fullName: formData.fullName });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center pt-8 pb-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6 ml-4">
          <div className="cursor-pointer" onClick={handleBackClick}>
            <ArrowLeft className="text-black bg-[#E0E0E0] rounded-full p-2" size={40} />
          </div>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <div className="p-6">
          {/* Profile Header - No Image */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <span className="text-4xl font-bold text-gray-500">
                  {profile.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <h2 className="text-[24px] font-bold text-black">{profile.fullName}</h2>
              <p className="text-gray-500 font-[400] text-xl">Shipper</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              className={`py-2 px-6 text-[16px] font-semibold transition-colors ${
                activeTab === "editProfile"
                  ? "border-b-2"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "editProfile" ? {borderColor: '#036BB4', color: '#036BB4'} : {}}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`py-2 px-6 text-[16px] font-semibold transition-colors ${
                activeTab === "changePassword"
                  ? "border-b-2"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "changePassword" ? {borderColor: '#036BB4', color: '#036BB4'} : {}}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Tab */}
          {activeTab === "editProfile" && (
            <div className="p-6 flex flex-col items-center">
              <form className="w-full max-w-[982px]" onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-500 text-sm font-bold mb-2"
                  >
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-400 leading-tight cursor-not-allowed border border-[#C3C3C3] bg-gray-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support for assistance.</p>
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-500 text-sm font-bold mb-2"
                  >
                    Contact Number (Cannot be changed)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    disabled
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-400 leading-tight cursor-not-allowed border border-[#C3C3C3] bg-gray-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed. Contact support for assistance.</p>
                </div>
                
                <div className="flex items-center justify-center mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{backgroundColor: '#036BB4'}}
                    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#025191')}
                    onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#036BB4')}
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Change Password Tab */}
          {activeTab === "changePassword" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}