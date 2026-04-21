"use client";

import React, { useState } from "react";
import { Loader } from "lucide-react";
import { changeShipperPassword } from "../../../components/lib/apiClient";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (newPassword !== confirmedPassword) {
      setMessage("New password and confirmed password do not match.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      
      const response = await changeShipperPassword({
        current_password: currentPassword,
        new_password: newPassword,
        // confirm_password: confirmedPassword
      });
      
      console.log('📦 Password change response:', response);
      
      if (response.success) {
        setMessage("Password changed successfully!");
        setMessageType("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmedPassword("");
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage(err.message || 'Failed to change password. Please try again.');
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col items-center">
      <div className="mb-4 w-full max-w-[982px]">
        <label
          htmlFor="currentPassword"
          className="block text-black text-sm font-bold mb-2"
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div className="mb-4 w-full max-w-[982px]">
        <label
          htmlFor="newPassword"
          className="block text-black text-sm font-bold mb-2"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div className="mb-6 w-full max-w-[982px]">
        <label
          htmlFor="confirmedPassword"
          className="block text-black text-sm font-bold mb-2"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmedPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      {message && (
        <p
          className={`text-center mb-4 ${
            messageType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      
      <div className="flex items-center justify-center mt-6 md:w-[982px]">
        <button
          type="submit"
          disabled={loading}
          className="text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{backgroundColor: '#036BB4'}}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#025191')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#036BB4')}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Changing...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}