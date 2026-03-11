"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { forgotPasswordRequest, resetPasswordWithToken, verifyOTPForReset } from '../lib/apiClient';

export default function ForgotPassword() {
  // Step management: 'email' -> 'otp' -> 'reset'
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  
  // UI states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // ==================== EMAIL STEP ====================
  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    return newErrors;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const newErrors = validateEmail();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({});
      setSuccessMessage('');
      
      try {
        const response = await forgotPasswordRequest(email);
        
        if (response.success) {
          setSuccessMessage(response.message || 'OTP sent to your email successfully!');
          setStep('otp');
        }
      } catch (error) {
        setErrors({ 
          email: error.message || 'Failed to send OTP. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // ==================== OTP STEP ====================
  const validateOtp = () => {
    const newErrors = {};
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 4) {
      newErrors.otp = 'OTP must be 4 digits';
    }
    return newErrors;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = validateOtp();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({});
      setSuccessMessage('');
      
      try {
        const response = await verifyOTPForReset(email, otp);
        
        if (response.success) {
          // Extract verification token from response
          const token = response.data?.verification_token || 
                       response.data?.token || 
                       response.data?.otp || 
                       response.verification_token;
          
          setVerificationToken(token);
          setSuccessMessage(response.message || 'OTP verified successfully!');
          setStep('reset');
        }
      } catch (error) {
        setErrors({ 
          otp: error.message || 'Invalid OTP. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // ==================== RESET PASSWORD STEP ====================
  const validatePasswordReset = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = validatePasswordReset();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({});
      setSuccessMessage('');
      
      try {
        const response = await resetPasswordWithToken(verificationToken, newPassword, confirmPassword);
        
        if (response.success) {
          setSuccessMessage(response.message || 'Password reset successfully!');
          // Redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } catch (error) {
        setErrors({ 
          submit: error.message || 'Failed to reset password. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderEmailStep = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Mail className="w-8 h-8 text-[#036BB4]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-sm">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          className={`w-full px-4 py-3 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-black bg-white`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg bg-[#036BB4] hover:bg-[#025191] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>

      <div className="text-center mt-6">
        <Link href="/login">
          <button
            type="button"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#036BB4] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </Link>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Shield className="w-8 h-8 text-[#036BB4]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify OTP
        </h2>
        <p className="text-gray-500 text-sm">
          We've sent a 4-digit code to <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
          Enter OTP
        </label>
        <input
          type="text"
          id="otp"
          maxLength={4}
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setOtp(value);
            if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
          }}
          className={`w-full px-4 py-3 border ${
            errors.otp ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-black bg-white text-center text-2xl tracking-widest`}
          placeholder="0000"
        />
        {errors.otp && (
          <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg bg-[#036BB4] hover:bg-[#025191] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="text-sm text-gray-600 hover:text-[#036BB4] transition"
        >
          Didn't receive the code? Resend
        </button>
      </div>

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-[#036BB4] transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Email
        </button>
      </div>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Lock className="w-8 h-8 text-[#036BB4]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-500 text-sm">
          Create a strong password for your account
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
            }}
            className={`w-full px-4 py-3 border ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition pr-12 text-black bg-white`}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
            className={`w-full px-4 py-3 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition pr-12 text-black bg-white`}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg bg-[#036BB4] hover:bg-[#025191] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-black">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 md:p-10 border border-gray-100">
        {/* Logo Section */}
        <div className="mb-8">
          <img 
            src="/login-logo (2).png" 
            alt="LAWANPAN TRUCK Logo" 
            className="max-w-xs w-28 md:w-36 lg:w-40 mx-auto" 
          />
        </div>

        {/* Render appropriate step */}
        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'reset' && renderResetStep()}

        {/* Footer */}
        {step === 'email' && (
          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{' '}
            <Link href="/login">
              <button
                type="button"
                className="text-[#036BB4] hover:text-blue-800 font-medium transition cursor-pointer"
              >
                Log In
              </button>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}