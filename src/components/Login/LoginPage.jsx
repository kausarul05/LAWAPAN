"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '../lib/apiClient';

export default function LoginPage() {
  const router = useRouter();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberPassword: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setLoginData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberPassword: true
      }));
    }
  }, []);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateLoginForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log("🔐 Login attempt for:", loginData.email);
      
      // Call login API
      const response = await loginUser(loginData.email, loginData.password);
      
      console.log("📦 Full Login response:", JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        console.log("✅ Login successful");
        console.log("📋 Response data:", JSON.stringify(response.data, null, 2));
        
        // Extract user role - check multiple possible fields
        let userRole = null;
        
        // Try different field names (case-insensitive)
        const roleFields = ['role', 'Role', 'ROLE', 'user_role', 'userRole'];
        for (const field of roleFields) {
          if (response.data[field]) {
            userRole = response.data[field];
            console.log(`✅ Role found in field: ${field} = ${userRole}`);
            break;
          }
        }
        
        // Check in nested user object if exists
        if (!userRole && response.data.user) {
          for (const field of roleFields) {
            if (response.data.user[field]) {
              userRole = response.data.user[field];
              console.log(`✅ Role found in user.${field} = ${userRole}`);
              break;
            }
          }
        }
        
        // If still not found, check all keys containing "role"
        if (!userRole) {
          for (const key in response.data) {
            if (key.toLowerCase().includes('role')) {
              userRole = response.data[key];
              console.log(`✅ Role found by pattern: ${key} = ${userRole}`);
              break;
            }
          }
        }
        
        // Normalize role to uppercase
        if (userRole) {
          userRole = userRole.toUpperCase();
          console.log("👤 Normalized user role:", userRole);
        } else {
          console.error("❌ Role not found in response!");
          console.log("Available keys in response.data:", Object.keys(response.data));
        }
        
        // Store remember password preference
        if (loginData.rememberPassword) {
          localStorage.setItem('rememberEmail', loginData.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        
        // Store user role in localStorage for debugging
        if (userRole) {
          localStorage.setItem('user_role', userRole);
        }
        
        // Small delay to ensure token is properly saved
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect based on role
        if (userRole === 'SHIPPER') {
          console.log("📦 Redirecting to shipper dashboard");
          window.location.href = '/dashboard/Shipper';
        } else if (userRole === 'TRANSPORTER') {
          console.log("🚛 Redirecting to transporter dashboard");
          window.location.href = '/dashboard/Transporter';
        } else {
          console.warn("⚠️ Unknown role or role not found, redirecting to default dashboard");
          console.log("Role value:", userRole);
          window.location.href = '/dashboard';
        }
      } else {
        // Login failed
        console.error("❌ Login failed:", response.message);
        setErrors({ 
          submit: response.message || 'Invalid email or password. Please check your credentials and try again.' 
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Handle different error types
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.message) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Account not found. Please sign up first.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-black">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8 md:p-10 border border-gray-100">
        {/* Logo Section */}
        <div className="mb-8">
          <img 
            src="/login-logo (2).png" 
            alt="LAWANPAN TRUCK Logo" 
            className="max-w-xs w-28 md:w-36 lg:w-40 mx-auto" 
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Login to Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8"> 
          Please enter your email and password to continue
        </p>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-black bg-white`}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition pr-12 text-black bg-white`}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberPassword"
                checked={loginData.rememberPassword}
                onChange={handleLoginChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Remember Password</span>
            </label>
            <Link href="/forgot-password">
              <button
                type="button"
                className="text-sm text-red-500 hover:text-red-600 transition font-medium"
              >
                Forgot Password?
              </button>
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg bg-[#036BB4] hover:bg-[#025191] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have account?{' '}
          <Link href="/signup">
            <button
              type="button"
              className="text-[#036BB4] hover:text-blue-800 font-medium transition cursor-pointer"
            >
              Sign Up
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}