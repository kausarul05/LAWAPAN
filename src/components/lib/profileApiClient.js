// ============================================
// FILE: lib/profileApiClient.js
// PERFECT: Fast submission, proper ID management
// ============================================

import { API_ENDPOINTS } from "@/config/api";
import apiCall from "./apiClient";

// ============================================
// SHIPPER PROFILE
// ============================================

export const completeShipperProfile = async (profileData) => {
  console.log('📤 Submitting Shipper Profile');

  // ✅ QUICK VALIDATION
  const errors = [];
  if (!profileData.companyAddress?.trim()) errors.push('Company address required');
  if (!profileData.employeeSize) errors.push('Employee size required');
  if (!profileData.monthlyBudget) errors.push('Monthly budget required');
  if (!profileData.shipmentsPerMonth) errors.push('Shipments per month required');
  if (!profileData.typeOfShipment) errors.push('Shipment type required');
  if (!profileData.shippingMerchandiseAt) errors.push('Location required');
  if (!profileData.shipType) errors.push('Ship type required');
  if (!profileData.shipperType) errors.push('Shipper type required');

  if (errors.length > 0) {
    console.error('❌ Validation Errors:', errors);
    throw new Error(errors.join('\n'));
  }

  // ✅ GET SHIPPER_ID
  const shipperId = localStorage.getItem('shipper_id');
  console.log('🔍 Checking shipper_id in localStorage...');
  console.log('📦 shipper_id found:', shipperId ? 'YES ✅' : 'NO ❌');
  
  if (!shipperId) {
    throw new Error('User ID not found. Please sign up again.');
  }

  // ✅ PREPARE DATA
  const requestData = {
    shipper_id: shipperId,
    company_address: profileData.companyAddress.trim(),
    employee_size: profileData.employeeSize,
    monthly_budget_for_shipment: profileData.monthlyBudget,
    shipments_per_month: profileData.shipmentsPerMonth,
    type_of_shipment: profileData.typeOfShipment,
    shipping_marchandise_at: profileData.shippingMerchandiseAt,
    ship_type: profileData.shipType,
    shipper_type: profileData.shipperType,
  };

  console.log('📨 Sending shipper profile with ID:', shipperId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPPER.COMPLETE_PROFILE,
    "POST",
    requestData
  );

  console.log('✅ Shipper profile completed successfully');
  return response;
};

export const getShipperProfile = async () => {
  return await apiCall(API_ENDPOINTS.SHIPPER.GET_PROFILE, "GET");
};

export const updateShipperProfile = async (profileData) => {
  const requestData = {
    company_address: profileData.companyAddress?.trim(),
    employee_size: profileData.employeeSize,
    monthly_budget_for_shipment: profileData.monthlyBudget,
    shipments_per_month: profileData.shipmentsPerMonth,
    type_of_shipment: profileData.typeOfShipment,
    shipping_marchandise_at: profileData.shippingMerchandiseAt,
    ship_type: profileData.shipType,
    shipper_type: profileData.shipperType,
  };

  return await apiCall(
    API_ENDPOINTS.SHIPPER.UPDATE_PROFILE,
    "PUT",
    requestData
  );
};

// ============================================
// TRANSPORTER PROFILE
// ============================================

export const completeTransporterProfile = async (profileData) => {
  console.log('📤 Submitting Transporter Profile');

  // ✅ QUICK VALIDATION
  const errors = [];
  if (!profileData.role) errors.push('Role required');
  if (!profileData.companyAddress?.trim()) errors.push('Company address required');
  if (!profileData.registrationCertificate) errors.push('Registration certificate required');
  if (!profileData.transportLicense) errors.push('Transport license required');
  if (!profileData.insuranceCertificate) errors.push('Insurance certificate required');

  if (errors.length > 0) {
    console.error('❌ Validation Errors:', errors);
    throw new Error(errors.join('\n'));
  }

  console.log('✅ All validations passed');

  // ✅ GET TRANSPORTER_ID FROM LOCALSTORAGE
  console.log('🔍 Checking localStorage for transporter_id...');
  const transporterId = localStorage.getItem('transporter_id');
  
  console.log('📋 Available localStorage items:', Object.keys(localStorage));
  console.log('🔑 transporter_id found:', transporterId ? 'YES ✅' : 'NO ❌');
  
  if (transporterId) {
    console.log('✅ transporter_id:', transporterId);
  } else {
    console.error('❌ transporter_id NOT found in localStorage!');
    console.error('Please make sure you signed up as a transporter');
  }

  if (!transporterId) {
    throw new Error('User ID not found. Please sign up again as a Transporter.');
  }

  console.log('✅ Validation complete - proceeding with submission');

  // ✅ PREPARE FORMDATA
  const formDataObj = new FormData();
  formDataObj.append("transporter_id", transporterId);
  formDataObj.append("company_address", profileData.companyAddress.trim());
  formDataObj.append("role", profileData.role);
  formDataObj.append("registration_certificate", profileData.registrationCertificate);
  formDataObj.append("transport_license", profileData.transportLicense);
  formDataObj.append("insurance_certificate", profileData.insuranceCertificate);

  console.log('📨 Submitting with transporter_id:', transporterId);
  console.log('📦 Files:', {
    registration: profileData.registrationCertificate.name,
    license: profileData.transportLicense.name,
    insurance: profileData.insuranceCertificate.name,
  });

  try {
    const response = await apiCall(
      API_ENDPOINTS.TRANSPORTER.COMPLETE_PROFILE,
      "POST",
      formDataObj,
      {},
      true
    );

    console.log('✅ Transporter profile submitted successfully');
    return response;
  } catch (error) {
    console.error('❌ Submission error:', error);
    
    // Check if it's auth error
    if (error.message.includes('Authentication failed')) {
      console.error('Token expired - need to login again');
    }
    
    throw error;
  }
};

export const getTransporterProfile = async () => {
  return await apiCall(API_ENDPOINTS.TRANSPORTER.GET_PROFILE, "GET");
};

export const updateTransporterProfile = async (profileData) => {
  const formDataObj = new FormData();

  if (profileData.companyAddress?.trim()) {
    formDataObj.append("company_address", profileData.companyAddress.trim());
  }

  if (profileData.role) {
    formDataObj.append("role", profileData.role);
  }

  if (profileData.registrationCertificate && profileData.registrationCertificate instanceof File) {
    formDataObj.append("registration_certificate", profileData.registrationCertificate);
  }

  if (profileData.transportLicense && profileData.transportLicense instanceof File) {
    formDataObj.append("transport_license", profileData.transportLicense);
  }

  if (profileData.insuranceCertificate && profileData.insuranceCertificate instanceof File) {
    formDataObj.append("insurance_certificate", profileData.insuranceCertificate);
  }

  return await apiCall(
    API_ENDPOINTS.TRANSPORTER.UPDATE_PROFILE,
    "PUT",
    formDataObj,
    {},
    true
  );
};

export default {
  completeShipperProfile,
  getShipperProfile,
  updateShipperProfile,
  completeTransporterProfile,
  getTransporterProfile,
  updateTransporterProfile,
};