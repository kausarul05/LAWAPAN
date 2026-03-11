"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Upload, FileText, Briefcase, MapPin, File } from 'lucide-react';
import { completeTransporterProfile } from './lib/profileApiClient';


export default function CompleteTransporterProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [profileData, setProfileData] = useState({
    role: '',
    companyAddress: '',
    registrationCertificate: null,
    transportLicense: null,
    insuranceCertificate: null,
  });

  const [errors, setErrors] = useState({});
  const totalSteps = 5;
  const brand = '#036BB4';

  const roleOptions = [
    { display: 'Logistic Manager', value: 'Logistick_manager' },
    { display: 'Purchasing Manager', value: 'Purchasing_manager' },
    { display: 'Operations Manager', value: 'Operations_Manager' },
    { display: 'Buyer', value: 'Buyer' },
    { display: 'Freight Forwarder', value: 'Freight_Forwarder' },
    { display: 'Secretariat', value: 'Secretariat' },
    { display: 'Other', value: 'Other' }
  ];

  const stepIcons = [Briefcase, MapPin, File, FileText, FileText];

  const stepConfigurations = [
    {
      step: 1,
      title: "What is your role in the company?",
      field: 'role',
      type: 'options'
    },
    {
      step: 2,
      title: "Enter your company address",
      subtitle: "Basic Information",
      field: 'companyAddress',
      type: 'text',
      placeholder: 'Enter your full company address'
    },
    {
      step: 3,
      title: "Upload registration certificate",
      subtitle: "Documentation",
      field: 'registrationCertificate',
      type: 'file',
      label: 'Company Registration Certificate'
    },
    {
      step: 4,
      title: "Upload transport license",
      subtitle: "Documentation",
      field: 'transportLicense',
      type: 'file',
      label: 'Transport License'
    },
    {
      step: 5,
      title: "Upload insurance certificate",
      subtitle: "Documentation",
      field: 'insuranceCertificate',
      type: 'file',
      label: 'Insurance Certificate'
    }
  ];

  const currentConfig = stepConfigurations[currentStep - 1];
  const CurrentStepIcon = stepIcons[currentStep - 1];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [currentConfig.field]: value
    }));
    if (errors[currentConfig.field]) {
      setErrors(prev => ({ ...prev, [currentConfig.field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          [currentConfig.field]: 'File size must be less than 10MB' 
        }));
        return;
      }

      if (!file.type.includes('pdf')) {
        setErrors(prev => ({ 
          ...prev, 
          [currentConfig.field]: 'Please upload a PDF file only' 
        }));
        return;
      }

      setProfileData(prev => ({
        ...prev,
        [currentConfig.field]: file
      }));
      setErrors(prev => ({ ...prev, [currentConfig.field]: '' }));
    }
  };

  const handleOptionSelect = (value) => {
    setProfileData(prev => ({
      ...prev,
      role: value
    }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const validateStep = () => {
    const field = currentConfig.field;
    if (!profileData[field]) {
      setErrors({ [field]: 'This field is required' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setLoading(true);
    setLoadingMessage('Uploading documents and saving profile...');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🚀 Profile submission started');
      
      const response = await completeTransporterProfile(profileData);

      console.log('✅ Response received:', response);

      if (response.success) {
        setSuccessMessage('✓ Profile completed successfully!');
        setLoadingMessage('Profile completed. Redirecting to login...');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      
      let errorMsg = error.message || 'Error completing profile. Please try again.';
      
      // Better error message handling
      if (errorMsg.includes('Authentication failed')) {
        errorMsg = 'Authentication failed. Please sign up again and try completing your profile immediately.';
      } else if (errorMsg.includes('User ID not found')) {
        errorMsg = 'User ID not found. Please sign up again as a Transporter.';
      } else if (errorMsg.includes('401')) {
        errorMsg = 'Authentication failed. Please sign up again and try completing your profile immediately.';
      }
      
      setErrorMessage(errorMsg);
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (currentConfig.type === 'options') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roleOptions.map(roleOption => (
            <button
              key={roleOption.value}
              onClick={() => handleOptionSelect(roleOption.value)}
              className="p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium hover:scale-105"
              style={{
                borderColor: profileData.role === roleOption.value ? brand : '#e5e7eb',
                background: profileData.role === roleOption.value ? '#e8f4fd' : '#fff',
                boxShadow: profileData.role === roleOption.value ? `0 4px 12px ${brand}25` : 'none',
              }}
            >
              <span style={{ color: profileData.role === roleOption.value ? brand : '#4b5563' }}>
                {roleOption.display}
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (currentConfig.type === 'text') {
      return (
        <div className="space-y-4">
          {currentConfig.subtitle && (
            <p className="text-sm font-semibold text-gray-600">{currentConfig.subtitle}</p>
          )}
          <label className="block text-sm font-semibold text-gray-700">Company Address</label>
          <input
            type="text"
            value={profileData[currentConfig.field]}
            onChange={handleInputChange}
            placeholder={currentConfig.placeholder}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 transition-colors focus:outline-none"
            style={{ borderColor: errors[currentConfig.field] ? '#ef4444' : '#d1d5db' }}
            onFocus={e => !errors[currentConfig.field] && (e.target.style.borderColor = brand)}
            onBlur={e => !errors[currentConfig.field] && (e.target.style.borderColor = '#d1d5db')}
          />
        </div>
      );
    }

    if (currentConfig.type === 'file') {
      const hasFile = !!profileData[currentConfig.field];
      const fileName = profileData[currentConfig.field]?.name;
      const fileSize = profileData[currentConfig.field]?.size;

      return (
        <div className="space-y-6">
          {currentConfig.subtitle && (
            <p className="text-sm font-semibold text-gray-600">{currentConfig.subtitle}</p>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">{currentConfig.label}</label>
            <div className="relative">
              <input
                type="file"
                id={currentConfig.field}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
                disabled={isSubmitting}
              />
              <label 
                htmlFor={currentConfig.field}
                className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{
                  borderColor: hasFile ? brand : '#d1d5db',
                  background: hasFile ? '#e8f4fd' : '#f9fafb',
                }}
              >
                <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: hasFile ? brand : '#9ca3af' }} />
                <p className="text-gray-700 font-semibold mb-1">
                  {hasFile ? 'File Selected' : 'Upload PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  {hasFile 
                    ? fileName
                    : 'Click to upload or drag and drop'
                  }
                </p>
                <p className="text-xs text-gray-400 mt-2">Max 10MB • PDF only</p>
              </label>
            </div>

            {hasFile && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold text-sm">{fileName}</p>
                  <p className="text-green-700 text-xs">
                    {fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
            <div className="mb-4 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: '#c8e3f5', borderTopColor: brand }}></div>
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-2">{loadingMessage}</p>
            <p className="text-gray-500 text-sm">Please wait...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        {/* Header with Logo */}
        <div className="text-center mb-12 w-full max-w-2xl">
          <img 
            src="/login-logo (2).png" 
            alt="LAWANPAN TRUCK" 
            className="w-30 mx-auto mb-8 " 
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-3xl">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div 
                className="h-full transition-all duration-500"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                  background: `linear-gradient(to right, ${brand}, #4da8d9)`,
                }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Step Header */}
              <div className="mb-10 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: '#e8f4fd' }}>
                    <CurrentStepIcon className="w-6 h-6" style={{ color: brand }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Step {currentStep} of {totalSteps}</p>
                    <p className="text-xs text-gray-500 mt-1">{Math.round((currentStep / totalSteps) * 100)}% Complete</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Step Content */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentConfig.title}</h2>
                {renderStepContent()}

                {errors[currentConfig.field] && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{errors[currentConfig.field]}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                    style={{ background: brand }}
                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#025a96'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = brand; }}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {isSubmitting ? 'Submitting...' : 'Complete Profile'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Your documents are secure and will be reviewed by our team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}