// ============================================
// FILE: config/api.js  
// Purpose: Centralized API Configuration & Endpoints
// UPDATED: Added Bid endpoints
// ============================================

// const API_BASE_URL = "https://server.lawapantruck.com/api/v1";
const API_BASE_URL = "https://logistics-shipment-management-backend.onrender.com/api/v1";

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
    CHANGE_PASSWORD: `${API_BASE_URL}/shipper/change-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  },

  // Shipper Profile Endpoints
  SHIPPER: {
    COMPLETE_PROFILE: `${API_BASE_URL}/shipper/complete-shipper-profile`,
    GET_PROFILE: (shipperId) => `${API_BASE_URL}/shipper/${shipperId}`,
    UPDATE_PROFILE: () => `${API_BASE_URL}/setting/shipper-profile`,
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
    GET_TRANSPORTER_SHIPMENTS: (transporterId) => `${API_BASE_URL}/shipment/transporter/${transporterId}`,
    UPDATE: (id) => `${API_BASE_URL}/shipment/${id}`,
    DELETE: (id) => `${API_BASE_URL}/shipment/${id}`,
    TRACK: (id) => `${API_BASE_URL}/shipment/${id}/track`,
  },

  // Issues Endpoints
  ISSUES: {
    GET_BY_SHIPMENT: (shipmentId) => `${API_BASE_URL}/issues/shipper/${shipmentId}`,
    GET_BY_TRANSPORTER: (transporterId) => `${API_BASE_URL}/issues/transporter/${transporterId}`,
    GET_BY_ID: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
    CREATE: `${API_BASE_URL}/issues/`,
    UPDATE: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
    DELETE: (issueId) => `${API_BASE_URL}/issues/${issueId}`,
  },

  // Bid Endpoints (for Transporter)
  BID: {
    GET_ALL: `${API_BASE_URL}/bid/`,
    GET_BY_ID: (id) => `${API_BASE_URL}/bid/${id}`,
    PLACE: `${API_BASE_URL}/bid/`,
    UPDATE: (id) => `${API_BASE_URL}/bid/${id}`,
    WITHDRAW: (id) => `${API_BASE_URL}/bid/${id}`,
  },

  // Stats Endpoints
  STATS: {
    SHIPPER: (shipperId) => `${API_BASE_URL}/stats/shipper/${shipperId}`,
    TRANSPORTER: (transporterId) => `${API_BASE_URL}/stats/transporter/${transporterId}`,
  },

  // Vehicle Endpoints (for Transporter)
  VEHICLE: {
    GET_BY_TRANSPORTER: (transporterId) => `${API_BASE_URL}/vehicle/transporter/${transporterId}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/vehicle/${id}`,
    CREATE: `${API_BASE_URL}/vehicle/`,
    UPDATE: (id) => `${API_BASE_URL}/vehicle/${id}`,
    DELETE: (id) => `${API_BASE_URL}/vehicle/${id}`,
  },

  // Driver Endpoints (for Transporter)
  DRIVER: {
    GET_BY_TRANSPORTER: (transporterId) => `${API_BASE_URL}/driver/transporter/${transporterId}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/driver/${id}`,
    CREATE: `${API_BASE_URL}/driver/`,
    UPDATE: (id) => `${API_BASE_URL}/driver/${id}`,
    DELETE: (id) => `${API_BASE_URL}/driver/${id}`,
  },

  // Payment Endpoints
  PAYMENT: {
    INITIALIZE: `${API_BASE_URL}/pay`,
  },

  // Bank Endpoints
  BANK: {
    GET: `${API_BASE_URL}/bank/shipper`,
    CREATE: `${API_BASE_URL}/bank/shipper`,
    UPDATE: (id) => `${API_BASE_URL}/bank/shipper/${id}`,
    DELETE: (id) => `${API_BASE_URL}/bank/shipper/${id}`,
  }
};

export default API_BASE_URL;