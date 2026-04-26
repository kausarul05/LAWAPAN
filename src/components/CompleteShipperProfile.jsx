"use client";
import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Truck, 
  MapPin, 
  Users, 
  DollarSign, 
  Briefcase,
  Building2,
  Globe,
  TrendingUp,
  Boxes,
  HardDrive,
  Building,
  UserCircle,
  UserCog,
  ShoppingCart,
  Settings,
  ClipboardList,
  Scale,
  Ship,
  Plane,
  Train,
  Fuel,
  Warehouse,
  Shield
} from 'lucide-react';
import { completeShipperProfile } from './lib/profileApiClient';

export default function CompleteShipperProfile() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const [profileData, setProfileData] = useState({
        companyAddress: '',
        employeeSize: '',
        monthlyBudget: '',
        shipmentsPerMonth: '',
        typeOfShipment: '',
        shippingMerchandiseAt: '',
        shipType: '',
        shipperType: '',
    });

    const [errors, setErrors] = useState({});
    const totalSteps = 8;
    const brand = '#036BB4';

    const stepIcons = [Users, TrendingUp, DollarSign, Package, Globe, Truck, Briefcase, MapPin];

    // Role options with icons
    const roleOptions = [
        { value: 'Logistic_Manager', label: 'Logistic\nManager', icon: UserCog },
        { value: 'Purchasing_Manager', label: 'Purchasing\nManager', icon: ShoppingCart },
        { value: 'Operations_Manager', label: 'Operations\nManager', icon: Settings },
        { value: 'Buyer', label: 'Buyer', icon: UserCircle },
        { value: 'Freight_Forwarder', label: 'Freight\nForwarder', icon: Ship },
        { value: 'Secretariat', label: 'Secretariat', icon: Building },
        { value: 'Other', label: 'Other', icon: ClipboardList },
    ];

    // Type of shipment options with icons
    const typeOfShipmentOptions = [
        { value: 'Food_Commodities', label: 'Food\nCommodities', icon: Package },
        { value: 'Building_Materials', label: 'Building\nMaterials', icon: Building2 },
        { value: 'Various_Goods', label: 'Various\nGoods', icon: Boxes },
        { value: 'Mining', label: 'Mining', icon: HardDrive },
        { value: 'Specialized_Machines', label: 'Specialized\nMachines', icon: Settings },
        { value: 'Others', label: 'Others', icon: Package },
    ];

    // Shipping range options with icons
    const shippingRangeOptions = [
        { value: 'Regional', label: 'Regional', icon: MapPin },
        { value: 'National', label: 'National', icon: MapPin },
        { value: 'International', label: 'International', icon: Globe },
    ];

    // Ship type options with icons
    const shipTypeOptions = [
        { value: 'Partial_Trucks', label: 'Partial Trucks\n(LTL)', icon: Truck },
        { value: 'Complete_Trucks', label: 'Complete Trucks\n(FTL)', icon: Truck },
    ];

    // Employee size options
    const employeeOptions = [
        { value: '1-5', label: '1 to 5\nemployees' },
        { value: '6-20', label: '6 to 20\nemployees' },
        { value: '21-50', label: '21 to 50\nemployees' },
        { value: '51-200', label: '51 to 200\nemployees' },
        { value: '201-500', label: '201 to 500\nemployees' },
        { value: '500+', label: 'More than\n500 employees' },
    ];

    // Shipments per month options
    const shipmentsOptions = [
        { value: '0-5', label: '0 to 5' },
        { value: '6-10', label: '6 to 10' },
        { value: '11-50', label: '11 to 50' },
        { value: '50-200', label: '50 to 200' },
        { value: '200+', label: 'More than 200' },
    ];

    // Monthly budget options
    const budgetOptions = [
        { value: '0-2500', label: 'Less than 2,500' },
        { value: '2500-10000', label: '2,500 - 10,000' },
        { value: '10000-50000', label: '10,000 - 50,000' },
        { value: '50000+', label: 'More than 50,000' },
    ];

    const stepConfigurations = [
        {
            step: 1,
            title: "What is the size of your company?",
            subtitle: "Select your company size",
            field: 'employeeSize',
            type: 'grid',
            columns: 3,
            icon: Users,
            options: employeeOptions
        },
        {
            step: 2,
            title: "How many shipments per month?",
            subtitle: "Select average monthly shipments",
            field: 'shipmentsPerMonth',
            type: 'grid',
            columns: 3,
            icon: TrendingUp,
            options: shipmentsOptions
        },
        {
            step: 3,
            title: "What is your monthly shipping budget?",
            subtitle: "Select your budget range",
            field: 'monthlyBudget',
            type: 'grid',
            columns: 2,
            icon: DollarSign,
            options: budgetOptions
        },
        {
            step: 4,
            title: "What type of merchandise do you ship?",
            subtitle: "Select your merchandise type",
            field: 'typeOfShipment',
            type: 'grid',
            columns: 3,
            icon: Package,
            options: typeOfShipmentOptions
        },
        {
            step: 5,
            title: "What is your shipping range?",
            subtitle: "Select your shipping area",
            field: 'shippingMerchandiseAt',
            type: 'grid',
            columns: 3,
            icon: Globe,
            options: shippingRangeOptions
        },
        {
            step: 6,
            title: "What type of shipments do you need?",
            subtitle: "Select your preferred shipment type",
            field: 'shipType',
            type: 'grid',
            columns: 2,
            icon: Truck,
            options: shipTypeOptions
        },
        {
            step: 7,
            title: "What is your role in the company?",
            subtitle: "Select your position",
            field: 'shipperType',
            type: 'grid',
            columns: 2,
            icon: Briefcase,
            options: roleOptions
        },
        {
            step: 8,
            title: "Enter your company address",
            subtitle: "Location Information",
            field: 'companyAddress',
            type: 'text',
            label: 'Company Address',
            placeholder: 'Enter house number, street, city (e.g., 123 Main Street, Dakar)',
            icon: MapPin
        }
    ];

    const currentConfig = stepConfigurations[currentStep - 1];
    const CurrentStepIcon = stepIcons[currentStep - 1];

    const handleInputChange = (e) => {
        const { value } = e.target;
        setProfileData(prev => ({ ...prev, [currentConfig.field]: value }));
        if (errors[currentConfig.field]) {
            setErrors(prev => ({ ...prev, [currentConfig.field]: '' }));
        }
    };

    const handleOptionSelect = (value) => {
        setProfileData(prev => ({ ...prev, [currentConfig.field]: value }));
        if (errors[currentConfig.field]) {
            setErrors(prev => ({ ...prev, [currentConfig.field]: '' }));
        }
    };

    const validateStep = () => {
        const field = currentConfig.field;
        if (!profileData[field] || profileData[field].trim?.() === '') {
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
        setLoadingMessage('Validating and submitting your profile...');
        setErrorMessage('');
        setSuccessMessage('');
        setDebugInfo('');

        console.log('🚀 Starting submission with data:', profileData);

        try {
            setDebugInfo('Validating all fields...');

            const response = await completeShipperProfile(profileData);

            console.log('✅ API Response:', response);

            if (response.success) {
                setSuccessMessage('✓ Profile completed successfully!');
                setLoadingMessage('Profile completed. Redirecting to login...');
                setDebugInfo('');

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to complete profile');
            }
        } catch (error) {
            console.error('❌ Error:', error);

            let displayError = error.message;
            if (error.message.includes('\n')) {
                displayError = error.message.split('\n').join('\n• ');
                displayError = '• ' + displayError;
            }

            setErrorMessage(displayError);
            setDebugInfo(JSON.stringify(profileData, null, 2));
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    const renderGridOptions = (options, columns) => {
        return (
            <div className={`grid grid-cols-1 gap-4 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {options.map(option => {
                    const isSelected = profileData[currentConfig.field] === option.value;
                    const OptionIcon = option.icon;
                    
                    return (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className="p-4 rounded-xl border-2 transition-all duration-200 text-center font-medium whitespace-pre-line hover:scale-105 flex flex-col items-center justify-center gap-2"
                            style={{
                                borderColor: isSelected ? brand : '#e5e7eb',
                                background: isSelected ? '#e8f4fd' : '#fff',
                                boxShadow: isSelected ? `0 4px 12px ${brand}25` : 'none',
                                color: isSelected ? brand : '#4b5563',
                            }}
                        >
                            {OptionIcon && <OptionIcon className="w-6 h-6" style={{ color: isSelected ? brand : '#9ca3af' }} />}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderStepContent = () => {
        if (currentConfig.type === 'grid') {
            return renderGridOptions(currentConfig.options, currentConfig.columns);
        }

        if (currentConfig.type === 'text') {
            return (
                <div className="space-y-4">
                    {currentConfig.subtitle && (
                        <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <currentConfig.icon className="w-4 h-4" style={{ color: brand }} />
                            {currentConfig.subtitle}
                        </p>
                    )}
                    <label className="block text-sm font-semibold text-gray-700">Company Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={profileData[currentConfig.field]}
                            onChange={handleInputChange}
                            placeholder={currentConfig.placeholder}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 transition-colors focus:outline-none"
                            style={{ borderColor: errors[currentConfig.field] ? '#ef4444' : '#d1d5db' }}
                            onFocus={e => !errors[currentConfig.field] && (e.target.style.borderColor = brand)}
                            onBlur={e => !errors[currentConfig.field] && (e.target.style.borderColor = '#d1d5db')}
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e8f4fd 0%, #ffffff 50%, #e8f4fd 100%)' }}>
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
                        <div className="mb-4 flex justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: '#c8e3f5', borderTopColor: brand }}></div>
                        </div>
                        <p className="font-semibold text-lg mb-2" style={{ color: '#1a1a1a' }}>{loadingMessage}</p>
                        <p className="text-gray-500 text-sm">This may take a moment...</p>
                        {debugInfo && (
                            <details className="mt-4 text-left">
                                <summary className="text-xs text-gray-600 cursor-pointer">Debug Info</summary>
                                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                    {debugInfo}
                                </pre>
                            </details>
                        )}
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
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-500">Required</span>
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
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-red-800 font-medium text-sm whitespace-pre-wrap">{errorMessage}</p>
                                            {debugInfo && (
                                                <details className="mt-2">
                                                    <summary className="text-xs text-red-700 cursor-pointer">See submitted data</summary>
                                                    <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-auto max-h-40 text-red-900">
                                                        {debugInfo}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step Content */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <currentConfig.icon className="w-6 h-6" style={{ color: brand }} />
                                    <h2 className="text-2xl font-bold text-gray-900">{currentConfig.title}</h2>
                                    <span className="text-red-500 font-bold ml-1">*</span>
                                </div>
                                {currentConfig.subtitle && (
                                    <p className="text-sm text-gray-500 mb-6">{currentConfig.subtitle}</p>
                                )}
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
                                        {isSubmitting ? 'Completing...' : 'Complete Profile'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Your information is secure and encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}