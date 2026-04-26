"use client";
import { User, Truck, Wrench, Package, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { signUpUser } from '../lib/apiClient';

export default function SignUpForm() {
  const [role, setRole] = useState('shipper');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    country: 'Benin',
    password: '',
    confirmPassword: '',
    numberOfTrucks: '',
    truckTypes: [],
    companyLogo: null
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTruckOptions, setShowTruckOptions] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const truckTypeOptions = [
    { id: 'tractorhead', label: 'Tractorhead (566)', value: 'TRACTORHEAD', count: 566, icon: Truck },
    { id: 'truck', label: 'Truck (690)', value: 'TRUCK', count: 690, icon: Truck },
    { id: 'light-commercial', label: 'Light commercial vehicle (970)', value: 'LIGHT_COMMERCIAL_VEHICLE', count: 970, icon: Package },
    { id: 'construction', label: 'Construction equipment (371)', value: 'CONSTRUCTION_EQUIPMENT', count: 371, icon: Wrench },
    { id: 'semi-trailer', label: 'Semi-trailer (285)', value: 'SEMI_TRAILER', count: 285, icon: Shield },
    { id: 'trailer', label: 'Trailer (43)', value: 'TRAILER', count: 43, icon: Package },
  ];

  const countries = [
    'Burkina Faso',
    'Niger',
    'Mali',
    "Côte d'Ivoire",
    'Togo',
    'Benin',
    'Ghana',
    'Senegal',
    'Mauritania',
    'Guinea-Bissau',
    'Guinea',
    'Sierra Leone',
    'Liberia',
    'Gambia',
    'Nigeria'
  ];

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'shipper') {
      setFormData(prev => ({
        ...prev,
        numberOfTrucks: '',
        truckTypes: [],
        companyLogo: null
      }));
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = '+' + value;
      if (value.length > 3) value = value.slice(0, 3) + ' ' + value.slice(3);
      if (value.length > 7) value = value.slice(0, 7) + ' ' + value.slice(7);
      if (value.length > 10) value = value.slice(0, 10) + ' ' + value.slice(10);
      if (value.length > 13) value = value.slice(0, 13) + ' ' + value.slice(13);
    }
    setFormData(prev => ({ ...prev, phone: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleTruckTypeToggle = (truckType) => {
    setFormData(prev => {
      const currentTypes = [...prev.truckTypes];
      if (currentTypes.includes(truckType)) {
        return { ...prev, truckTypes: currentTypes.filter(type => type !== truckType) };
      } else {
        return { ...prev, truckTypes: [...currentTypes, truckType] };
      }
    });
    setShowTruckOptions(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, companyLogo: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, companyLogo: 'Please upload an image file' }));
        return;
      }
      setFormData(prev => ({ ...prev, companyLogo: file }));
      setErrors(prev => ({ ...prev, companyLogo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (role === 'transporter') {
      if (!formData.numberOfTrucks) {
        newErrors.numberOfTrucks = 'Please enter number of trucks';
      } else if (isNaN(formData.numberOfTrucks) || formData.numberOfTrucks <= 0) {
        newErrors.numberOfTrucks = 'Please enter a valid number of trucks';
      }
      if (formData.truckTypes.length === 0) {
        newErrors.truckTypes = 'Please select at least one truck type';
      }
    }
    if (!agreeToTerms) newErrors.terms = 'You must accept the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);
    setLoadingMessage('Creating your account...');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🚀 Starting signup for role:', role);
      setLoadingMessage('Validating information...');

      const submitData = {
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        password: formData.password,
        role: role,
        numberOfTrucks: role === 'transporter' ? formData.numberOfTrucks : null,
        truckTypes: role === 'transporter' ? formData.truckTypes : [],
        companyLogo: role === 'transporter' ? formData.companyLogo : null,
      };

      setLoadingMessage('Submitting registration...');
      const response = await signUpUser(submitData);
      console.log('📦 Signup response:', response);

      if (response.success) {
        // Get role from response or use the selected role
        const userRole = (response.data?.role || role).toUpperCase();
        console.log('✅ Registration successful for role:', userRole);

        // VERIFY LOCALSTORAGE DATA
        console.log('🔍 Verifying localStorage after signup...');
        setTimeout(() => {
          const storedUserID = localStorage.getItem('userID');
          const storedShipperId = localStorage.getItem('shipper_id');
          const storedUserRole = localStorage.getItem('user_role');
          const storedAuthToken = localStorage.getItem('auth_token');

          console.log('📦 localStorage verification:', {
            userID: storedUserID || '❌ Not found',
            shipper_id: storedShipperId || '❌ Not found',
            user_role: storedUserRole || '❌ Not found',
            auth_token: storedAuthToken ? '✅ Present' : '❌ Missing'
          });

          // Double-check for shipper role
          if (userRole === 'SHIPPER' && !storedShipperId) {
            console.warn('⚠️ shipper_id not found for SHIPPER role!');
            // Try to extract from response as fallback
            if (response.data && response.data.shipper_id) {
              localStorage.setItem('shipper_id', response.data.shipper_id);
              console.log('✅ Manually stored shipper_id:', response.data.shipper_id);
            } else if (response.data && response.data.id) {
              localStorage.setItem('shipper_id', response.data.id);
              console.log('✅ Manually stored shipper_id from id:', response.data.id);
            }
          }
        }, 500); // Small delay to ensure storage is complete

        setLoadingMessage('Account created! Redirecting...');
        setSuccessMessage(`Account created successfully! Welcome ${formData.companyName}`);

        // Clear form
        setFormData({
          companyName: '', email: '', phone: '', country: 'Benin',
          password: '', confirmPassword: '', numberOfTrucks: '',
          truckTypes: [], companyLogo: null
        });
        setAgreeToTerms(false);
        setErrors({});

        // Redirect based on role after short delay
        setTimeout(() => {
          setSuccessMessage('');
          if (userRole === 'SHIPPER') {
            console.log('📦 Redirecting to shipper profile completion');
            // Final check before redirect
            const finalShipperId = localStorage.getItem('shipper_id');
            const finalUserID = localStorage.getItem('userID');
            console.log('🚀 Final check before redirect:', {
              userID: finalUserID,
              shipper_id: finalShipperId
            });
            window.location.href = '/shipper-complete-profile';
          } else if (userRole === 'TRANSPORTER') {
            console.log('🚛 Redirecting to transporter profile completion');
            window.location.href = '/transporter-complete-profile';
          } else {
            console.log('🏠 Redirecting to login');
            window.location.href = '/login';
          }
        }, 1500);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      setErrorMessage(error.message || 'Error creating account. Please try again.');
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(204, 198, 198, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: '#c8e3f5', borderTopColor: '#036BB4' }}></div>
            </div>
            <p className="font-semibold text-lg text-gray-900 mb-2">{loadingMessage}</p>
            <p className="text-gray-500 text-sm">Please wait, this may take a moment...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        <div>
          <img src="/login-logo (2).png" alt="Logo" className="max-w-xs w-28 md:w-36 lg:w-40 mx-auto" />
        </div>

        <div className="w-full max-w-md text-center mb-8 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">join the first west African e-plateform of businesses and transporters</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-pulse">
            <p className="text-green-800 font-medium">{successMessage}</p>
            <p className="text-green-700 text-sm mt-2">Redirecting to profile completion...</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleRoleChange('shipper')}
              className={`flex-1 p-6 rounded-xl border-2 text-center transition-all duration-200 ${role === 'shipper' ? 'bg-gray-50 ring-1' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200'}`}
              style={role === 'shipper' ? { borderColor: '#036BB4' } : {}}
              disabled={isSubmitting}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${role === 'shipper' ? 'bg-white shadow-sm' : 'bg-white border-gray-200'}`} style={role === 'shipper' ? { borderColor: '#036BB4' } : {}}>
                  <User className={`w-6 h-6 ${role === 'shipper' ? '' : 'text-gray-400'}`} style={role === 'shipper' ? { color: '#036BB4' } : {}} />
                </div>
                <div>
                  <div className={`font-bold text-lg ${role === 'shipper' ? 'text-gray-900' : 'text-gray-600'}`}>{`I'm a shipper`}</div>
                  <div className="text-xs text-gray-500 mt-1">I need to ship goods</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('transporter')}
              className={`flex-1 p-6 rounded-xl border-2 text-center transition-all duration-200 ${role === 'transporter' ? 'bg-gray-50 ring-1' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200'}`}
              style={role === 'transporter' ? { borderColor: '#036BB4' } : {}}
              disabled={isSubmitting}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${role === 'transporter' ? 'bg-white shadow-sm' : 'bg-white border-gray-200'}`} style={role === 'transporter' ? { borderColor: '#036BB4' } : {}}>
                  <Truck className={`w-6 h-6 ${role === 'transporter' ? '' : 'text-gray-400'}`} style={role === 'transporter' ? { color: '#036BB4' } : {}} />
                </div>
                <div>
                  <div className={`font-bold text-lg ${role === 'transporter' ? 'text-gray-900' : 'text-gray-600'}`}>{`I'm a Transporter`}</div>
                  <div className="text-xs text-gray-500 mt-1">I have trucks to offer</div>
                </div>
              </div>
            </button>
          </div>
          <div className="h-px bg-gray-100 mt-6"></div>
        </div>

        <h2 className="text-xl font-semibold text-black mb-6">
          {role === 'transporter' ? 'Company Details' : 'Basic information'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {role === 'transporter' ? 'Transport company name' : 'Company name'}
              <span className='text-red-500 ml-1 font-bold'>*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
              placeholder="Enter company name"
              disabled={isSubmitting}
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email address <span className='text-red-500 ml-1 font-bold'>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
              placeholder="Your email address"
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone number <span className='text-red-500 ml-1 font-bold'>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
              placeholder="+22X XX XX XX XX"
              maxLength="16"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className='text-red-500 ml-1 font-bold'>*</span></label>
            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none appearance-none bg-white text-black"
                disabled={isSubmitting}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {role === 'transporter' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Trucks <span className='text-red-500 ml-1 font-bold'>*</span></label>
                <input
                  type="number"
                  name="numberOfTrucks"
                  value={formData.numberOfTrucks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
                  placeholder="Enter your total truck number"
                  min="0"
                  disabled={isSubmitting}
                />
                {errors.numberOfTrucks && <p className="mt-1 text-sm text-red-600">{errors.numberOfTrucks}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Truck Type <span className='text-red-500 ml-1 font-bold'>*</span></label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTruckOptions(!showTruckOptions)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.truckTypes ? 'border-red-500' : 'border-gray-300'} text-left flex justify-between items-center text-black`}
                    style={formData.truckTypes.length > 0 ? { borderColor: '#036BB4' } : {}}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      <span>{formData.truckTypes.length > 0 ? `${formData.truckTypes.length} type(s) selected` : 'Select truck type'}</span>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${showTruckOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {showTruckOptions && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {truckTypeOptions.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleTruckTypeToggle(option.value)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center text-black`}
                          style={formData.truckTypes.includes(option.value) ? { backgroundColor: '#f0f7ff' } : {}}
                          disabled={isSubmitting}
                        >
                          <div className="flex items-center gap-3">
                            <option.icon className="w-5 h-5 text-gray-600" />
                            <span>{option.label}</span>
                          </div>
                          {formData.truckTypes.includes(option.value) && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#036BB4' }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.truckTypes && <p className="mt-1 text-sm text-red-600">{errors.truckTypes}</p>}

                {formData.truckTypes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.truckTypes.map(type => {
                      const option = truckTypeOptions.find(opt => opt.value === type);
                      if (!option) return null;
                      const IconComponent = option.icon;
                      return (
                        <span key={type} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm text-black" style={{ backgroundColor: '#f0f7ff', color: '#036BB4' }}>
                          <IconComponent className="w-4 h-4" />
                          {option.label.split(' (')[0]}
                          <button type="button" onClick={() => handleTruckTypeToggle(type)} className="ml-1 text-blue-600 hover:text-blue-800" disabled={isSubmitting}>×</button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="companyLogo" onChange={handleFileChange} accept="image/*" className="hidden" disabled={isSubmitting} />
                  <label htmlFor="companyLogo" className={`cursor-pointer ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <div className="text-gray-600 font-medium">Upload</div>
                    <div className="text-sm text-gray-500 mt-1">{formData.companyLogo ? formData.companyLogo.name : 'Click to upload your logo'}</div>
                  </label>
                </div>
                {errors.companyLogo && <p className="mt-1 text-sm text-red-600">{errors.companyLogo}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className='text-red-500 ml-1 font-bold'>*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
              placeholder="Minimum 6 characters"
              disabled={isSubmitting}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password <span className='text-red-500 ml-1 font-bold'>*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
              placeholder="Re-enter your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <input type="checkbox" id="terms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="mt-1 w-4 h-4" style={{ accentColor: '#036BB4' }} disabled={isSubmitting} />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">I have read and I accept the <a href="#" className="font-medium" style={{ color: '#036BB4' }}>general terms and conditions</a>.</label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" checked={agreeToTerms} readOnly className="mt-1 w-4 h-4" style={{ accentColor: '#036BB4' }} />
              <label className="ml-2 text-sm text-gray-700">I understood the <span className="font-medium">Lawapan Truck</span> was a service dedicated to professionals.</label>
            </div>
            {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors`}
            style={isSubmitting ? { backgroundColor: '#AAD4E8', cursor: 'not-allowed' } : { backgroundColor: '#036BB4' }}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">Already have an account? <Link href="/login" className="text-[#036BB4] hover:underline font-medium">Log in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}