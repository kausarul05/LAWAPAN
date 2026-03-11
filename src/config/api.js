// ============================================
// FILE: config/api.js  
// Purpose: Centralized API Configuration & Endpoints
// UPDATED: Added Shipment endpoints
// ============================================

const API_BASE_URL = "https://server.lawapantruck.com/api/v1";

export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    SIGN_UP: `${API_BASE_URL}/auth/sign-up`,
    SIGN_IN: `${API_BASE_URL}/auth/sign-in`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forget-password`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    LOGIN: `${API_BASE_URL}/auth/sign-in`, // Alias
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  },

  // Shipper Profile Endpoints
  SHIPPER: {
    COMPLETE_PROFILE: `${API_BASE_URL}/shipper/complete-shipper-profile`,
    GET_PROFILE: `${API_BASE_URL}/shipper/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/shipper/profile`,
  },

  // Transporter Profile Endpoints
  TRANSPORTER: {
    COMPLETE_PROFILE: `${API_BASE_URL}/transporter/complete-transporter-profile`,
    GET_PROFILE: `${API_BASE_URL}/transporter/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/transporter/profile`,
  },

  // Shipment Endpoints
  SHIPMENT: {
    CREATE: `${API_BASE_URL}/shipment/`,
    GET_BY_ID: (id) => `${API_BASE_URL}/shipment/${id}`,
    GET_SHIPPER_SHIPMENTS: (shipperId) => `${API_BASE_URL}/shipment/shipper/${shipperId}`,
    UPDATE: (id) => `${API_BASE_URL}/shipment/${id}`,
    DELETE: (id) => `${API_BASE_URL}/shipment/${id}`,
    TRACK: (id) => `${API_BASE_URL}/shipment/${id}/track`,
  },

  // Issues Endpoints
  ISSUES: {
    GET_BY_SHIPMENT: (shipmentId) => `${API_BASE_URL}/issues/shipment/${shipmentId}`,
    GET_BY_ID: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
    CREATE: `${API_BASE_URL}/issues/`,
    UPDATE: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
    DELETE: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
  }
};

export default API_BASE_URL;