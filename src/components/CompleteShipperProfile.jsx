"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Package, Truck, MapPin, Users, DollarSign, Briefcase } from 'lucide-react';
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

    const stepIcons = [Users, Truck, DollarSign, Package, MapPin, Truck, Briefcase, MapPin];

    const stepConfigurations = [
        {
            step: 1,
            title: "What is the size of your company?",
            field: 'employeeSize',
            type: 'grid',
            columns: 3,
            options: [
                { value: '1-5', label: '1 to 5\nemployees' },
                { value: '6-20', label: '6 to 20\nemployees' },
                { value: '21-50', label: '21 to 50\nemployees' },
                { value: '51-200', label: '51 to 200\nemployees' },
                { value: '201-500', label: '201 to 500\nemployees' },
                { value: '500+', label: 'More than\n500 employees' },
            ]
        },
        {
            step: 2,
            title: "How many shipments per month?",
            field: 'shipmentsPerMonth',
            type: 'grid',
            columns: 3,
            options: [
                { value: '0-5', label: '0 to 5' },
                { value: '6-10', label: '6 to 10' },
                { value: '11-50', label: '11 to 50' },
                { value: '50-200', label: '50 to 200' },
                { value: '200+', label: 'More than 200' },
            ]
        },
        {
            step: 3,
            title: "What is your monthly shipping budget?",
            field: 'monthlyBudget',
            type: 'grid',
            columns: 2,
            options: [
                { value: '0-2500', label: 'Less than 2,500' },
                { value: '2500-10000', label: '2,500 - 10,000' },
                { value: '10000-50000', label: '10,000 - 50,000' },
                { value: '50000+', label: 'More than 50,000' },
            ]
        },
        {
            step: 4,
            title: "What type of merchandise do you ship?",
            field: 'typeOfShipment',
            type: 'grid',
            columns: 3,
            options: [
                { value: 'Food_Commodities', label: 'Food\nCommodities' },
                { value: 'Building_Materials', label: 'Building\nMaterials' },
                { value: 'Various_Goods', label: 'Various\nGoods' },
                { value: 'Mining', label: 'Mining' },
                { value: 'Specialized_Machines', label: 'Specialized\nMachines' },
                { value: 'Others', label: 'Others' },
            ]
        },
        {
            step: 5,
            title: "What is your shipping range?",
            field: 'shippingMerchandiseAt',
            type: 'grid',
            columns: 3,
            options: [
                { value: 'Regional', label: 'Regional' },
                { value: 'National', label: 'National' },
                { value: 'International', label: 'International' },
            ]
        },
        {
            step: 6,
            title: "What type of shipments do you need?",
            field: 'shipType',
            type: 'grid',
            columns: 2,
            options: [
                { value: 'Partial_Trucks', label: 'Partial Trucks\n(LTL)' },
                { value: 'Complete_Trucks', label: 'Complete Trucks\n(FTL)' },
            ]
        },
        {
            step: 7,
            title: "What is your role in the company?",
            field: 'shipperType',
            type: 'grid',
            columns: 2,
            options: [
                { value: 'Logistic_Manager', label: 'Logistic\nManager' },
                { value: 'Purchasing_Manager', label: 'Purchasing\nManager' },
                { value: 'Operations_Manager', label: 'Operations\nManager' },
                { value: 'Buyer', label: 'Buyer' },
                { value: 'Freight_Forwarder', label: 'Freight\nForwarder' },
                { value: 'Secretariat', label: 'Secretariat' },
                { value: 'Other', label: 'Other' },
            ]
        },
        {
            step: 8,
            title: "Enter your company address",
            field: 'companyAddress',
            type: 'text',
            label: 'Company Address',
            placeholder: 'e.g., 123 Business Street, City, Country'
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentConfig.title}</h2>

                                {currentConfig.type === 'grid' ? (
                                    <div className={`grid grid-cols-1 gap-4 ${currentConfig.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                                        }`}>
                                        {currentConfig.options.map(option => {
                                            const isSelected = profileData[currentConfig.field] === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleOptionSelect(option.value)}
                                                    className="p-4 rounded-xl border-2 transition-all duration-200 text-center font-medium whitespace-pre-line hover:scale-105"
                                                    style={{
                                                        borderColor: isSelected ? brand : '#e5e7eb',
                                                        background: isSelected ? '#e8f4fd' : '#fff',
                                                        boxShadow: isSelected ? `0 4px 12px ${brand}25` : 'none',
                                                        color: isSelected ? brand : '#4b5563',
                                                    }}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-gray-700">{currentConfig.label}</label>
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
                                )}

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
                        <p className="text-gray-500 text-sm">
                            Your information is secure and encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}