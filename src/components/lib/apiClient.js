// ============================================
// FILE: lib/apiClient.js
// COMPLETE AUTHENTICATION API CLIENT
// WITH ENHANCED ROLE DETECTION
// ============================================

import { API_ENDPOINTS } from "../../config/api";
import { extractIdsFromToken, extractRoleFromToken, extractUserIdFromToken } from "./jwtDecoder";

// ============================================
// COOKIE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Get authentication token from cookie
 */
const getTokenFromCookie = () => {
  if (typeof document === "undefined") return null;

  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      const token = cookie.substring(name.length);
      console.log('✅ Token found in cookie');
      return token;
    }
  }

  console.warn('⚠️ No token found in cookie');
  return null;
};

/**
 * Save authentication token to cookie
 */
const setTokenInCookie = (token, expiryDays = 30) => {
  if (!token) {
    console.error('❌ Cannot set token - token is empty/null');
    return;
  }

  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();

  // Set cookie with proper security flags
  document.cookie = `token=${token};${expires};path=/;SameSite=Lax;Secure`;
  console.log('✅ Token saved in cookie');
  console.log('🔑 Token preview:', token.substring(0, 20) + '...');
};

/**
 * Remove authentication token from cookie
 */
const removeTokenFromCookie = () => {
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  console.log('🔄 Token removed from cookie');
};

// ============================================
// ROLE EXTRACTION HELPER
// ============================================

/**
 * Extract role from API response with comprehensive checks
 */
const extractRole = (data) => {
  if (!data) return null;

  console.log('🔍 Extracting role from data:', JSON.stringify(data, null, 2));

  // List of possible role field names
  const roleFields = [
    'role',
    'Role',
    'ROLE',
    'user_role',
    'userRole',
    'UserRole',
    'user_type',
    'userType',
    'account_type',
    'accountType'
  ];

  // 1. Check direct fields in data
  for (const field of roleFields) {
    if (data[field]) {
      console.log(`✅ Role found in data.${field}:`, data[field]);
      return data[field].toUpperCase();
    }
  }

  // 2. Check in nested user object
  if (data.user) {
    for (const field of roleFields) {
      if (data.user[field]) {
        console.log(`✅ Role found in data.user.${field}:`, data.user[field]);
        return data.user[field].toUpperCase();
      }
    }
  }

  // 3. Check by pattern matching (case-insensitive)
  for (const key in data) {
    if (key.toLowerCase().includes('role') || key.toLowerCase().includes('type')) {
      console.log(`✅ Role found by pattern ${key}:`, data[key]);
      return String(data[key]).toUpperCase();
    }
  }

  console.warn('⚠️ Role not found in response data');
  return null;
};

/**
 * Extract user ID from API response
 */
const extractUserId = (data) => {
  if (!data) return null;

  const idFields = [
    'user_id',
    'userId',
    'id',
    'ID',
    '_id',
    'user'
  ];

  for (const field of idFields) {
    if (data[field]) {
      // If it's an object, try to get id from it
      if (typeof data[field] === 'object' && data[field].id) {
        return data[field].id;
      }
      // Otherwise return the value directly
      if (typeof data[field] === 'string' || typeof data[field] === 'number') {
        return data[field];
      }
    }
  }

  return null;
};

// ============================================
// SHIPPER PROFILE FUNCTIONS
// ============================================

/**
 * Get shipper profile
 */
export const getShipperProfile = async () => {
  console.log('👤 Fetching shipper profile');

  const response = await apiCall(
    API_ENDPOINTS.SHIPPER.GET_PROFILE,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Update shipper profile
 */
export const updateShipperProfile = async (profileData) => {
  console.log('📝 Updating shipper profile:', profileData);

  const response = await apiCall(
    API_ENDPOINTS.SHIPPER.UPDATE_PROFILE,
    'PUT',
    profileData,
    {},
    false
  );

  return response;
};

// ============================================
// BANK DETAILS FUNCTIONS
// ============================================

/**
 * Get bank details for the logged-in user
 */
export const getBankDetails = async () => {
  console.log('🏦 Fetching bank details');
  
  const response = await apiCall(
    API_ENDPOINTS.BANK.GET,
    'GET',
    null,
    {},
    false
  );
  
  return response;
};

/**
 * Create new bank details
 */
export const createBankDetails = async (bankData) => {
  console.log('💰 Creating bank details:', bankData);
  
  const response = await apiCall(
    API_ENDPOINTS.BANK.CREATE,
    'POST',
    bankData,
    {},
    false
  );
  
  return response;
};

/**
 * Update bank details
 */
export const updateBankDetails = async (bankId, bankData) => {
  console.log('📝 Updating bank details:', bankId, bankData);
  
  const response = await apiCall(
    API_ENDPOINTS.BANK.UPDATE(bankId),
    'PUT',
    bankData,
    {},
    false
  );
  
  return response;
};

/**
 * Delete bank details
 */
export const deleteBankDetails = async (bankId) => {
  console.log('🗑️ Deleting bank details:', bankId);
  
  const response = await apiCall(
    API_ENDPOINTS.BANK.DELETE(bankId),
    'DELETE',
    null,
    {},
    false
  );
  
  return response;
};

// ============================================
// MAIN API CALL FUNCTION
// ============================================

/**
 * Generic API call function with authentication
 */
const apiCall = async (
  endpoint,
  method = "POST",
  data = null,
  headers = {},
  isFormData = false
) => {
  try {
    console.log(`🌐 API Call: ${method} ${endpoint}`);

    const token = getTokenFromCookie();

    const options = {
      method,
      headers: {
        ...headers,
      },
    };

    // Add authorization header if token exists
    if (token) {
      options.headers.Authorization = `${token}`;
      console.log('✅ Authorization header added');
    }

    // Add Content-Type for non-FormData requests
    if (!isFormData && method !== "GET") {
      options.headers["Content-Type"] = "application/json";
    }

    // Add request body
    if (data && method !== "GET") {
      if (isFormData) {
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    // Make the API call
    const response = await fetch(endpoint, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - Token invalid/expired');
      removeTokenFromCookie();
      if (typeof window !== "undefined") {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('shipper_id');
        localStorage.removeItem('transporter_id');
        localStorage.removeItem('user_role');
      }
      throw new Error("Session expired. Please login again.");
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }

      console.error(`❌ API Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Parse successful response
    const responseData = await response.json();
    console.log(`✅ API Success: ${response.status}`);

    return responseData;

  } catch (error) {
    console.error("❌ API Error:", error.message);
    throw error;
  }
};

// ============================================
// SIGNUP FUNCTION
// ============================================

export const signUpUser = async (formData) => {
  console.log('🚀 Starting signup process');
  console.log('📋 Signup data:', {
    email: formData.email,
    role: formData.role,
    companyName: formData.companyName
  });

  const formDataObj = new FormData();

  // Add required fields
  formDataObj.append("company_name", formData.companyName);
  formDataObj.append("email", formData.email);
  formDataObj.append("phone", formData.phone);
  formDataObj.append("country", formData.country);
  formDataObj.append("password", formData.password);
  formDataObj.append("role", formData.role.toUpperCase());
  formDataObj.append("service_policy", "true");
  formDataObj.append("terms_and_conditions", "true");

  // Add transporter-specific fields
  if (formData.role.toLowerCase() === "transporter") {
    formDataObj.append("number_of_trucks", formData.numberOfTrucks || "0");

    if (formData.truckTypes && formData.truckTypes.length > 0) {
      formData.truckTypes.forEach((type) => {
        formDataObj.append("truck_type", type);
      });
    }

    if (formData.companyLogo) {
      formDataObj.append("logo", formData.companyLogo);
    }
  }

  // Make API call
  const response = await apiCall(
    API_ENDPOINTS.AUTH.SIGN_UP,
    "POST",
    formDataObj,
    {},
    true
  );

  console.log('📦 Signup response received');
  console.log('📦 Full signup response:', JSON.stringify(response, null, 2));

  if (response.success && response.data) {
    console.log('✅ Signup successful');

    // Extract and store token
    const tokenFields = [
      'token', 'access', 'access_token', 'accessToken',
      'Authorization', 'auth_token', 'jwt', 'bearer'
    ];

    let token = null;
    for (const field of tokenFields) {
      if (response.data[field] || response[field]) {
        token = response.data[field] || response[field];
        console.log(`✅ Token found in ${field}`);
        break;
      }
    }

    if (token) {
      setTokenInCookie(token, 30);
      if (typeof window !== "undefined") {
        localStorage.setItem('auth_token', token);
      }
    }

    // Extract and store role
    const userRole = extractRole(response.data) || formData.role.toUpperCase();
    console.log('👥 User Role:', userRole);

    if (typeof window !== "undefined") {
      localStorage.setItem('user_role', userRole);
    }

    // EXTRACT USER ID - STORE BOTH userID AND shipper_id
    console.log('🔍 Attempting to extract user/shipper ID from response...');

    let userId = null;
    let shipperId = null;
    let transporterId = null;

    // Check response.data first
    if (response.data) {
      console.log('Response.data keys:', Object.keys(response.data));

      // Check for all possible ID fields
      const possibleIdFields = [
        'shipper_id', 'shipperId', 'transporter_id', 'transporterId',
        'user_id', 'userId', 'id', '_id', 'uid', 'uuid'
      ];

      for (const field of possibleIdFields) {
        if (response.data[field]) {
          const idValue = response.data[field];
          console.log(`✅ Found ID in response.data.${field}:`, idValue);

          // Store based on field name
          if (field === 'shipper_id' || field === 'shipperId') {
            shipperId = idValue;
          } else if (field === 'transporter_id' || field === 'transporterId') {
            transporterId = idValue;
          } else {
            // For generic fields, treat as userId
            userId = userId || idValue;
          }
        }
      }

      // Check nested objects if not found
      if (!userId && !shipperId && !transporterId) {
        // Check if data has a nested user object
        if (response.data.user && typeof response.data.user === 'object') {
          console.log('Checking nested user object:', response.data.user);
          for (const field of possibleIdFields) {
            if (response.data.user[field]) {
              const idValue = response.data.user[field];
              console.log(`✅ Found ID in response.data.user.${field}:`, idValue);

              if (field === 'shipper_id' || field === 'shipperId') {
                shipperId = idValue;
              } else if (field === 'transporter_id' || field === 'transporterId') {
                transporterId = idValue;
              } else {
                userId = userId || idValue;
              }
            }
          }
        }

        // Check if data has a nested data object
        if (!userId && !shipperId && !transporterId && response.data.data && typeof response.data.data === 'object') {
          console.log('Checking nested data object:', response.data.data);
          for (const field of possibleIdFields) {
            if (response.data.data[field]) {
              const idValue = response.data.data[field];
              console.log(`✅ Found ID in response.data.data.${field}:`, idValue);

              if (field === 'shipper_id' || field === 'shipperId') {
                shipperId = idValue;
              } else if (field === 'transporter_id' || field === 'transporterId') {
                transporterId = idValue;
              } else {
                userId = userId || idValue;
              }
            }
          }
        }
      }
    }

    // Also try to extract from token as fallback
    if ((!userId && !shipperId && !transporterId) && token) {
      console.log('Attempting to extract user ID from token...');
      const userIdFromToken = extractUserIdFromToken(token);
      if (userIdFromToken) {
        userId = userIdFromToken;
        console.log('✅ Found user ID from token:', userId);
      }
    }

    // If shipperId is still not found but userId exists, use userId as shipperId
    if (!shipperId && userId) {
      shipperId = userId;
      console.log('📌 Using userId as shipper_id:', shipperId);
    }

    // If userId is not found but shipperId exists, use shipperId as userId
    if (!userId && shipperId) {
      userId = shipperId;
      console.log('📌 Using shipper_id as userId:', userId);
    }

    console.log('👤 Final extracted IDs:', {
      userId,
      shipperId,
      transporterId
    });

    // STORE ALL IDs IN LOCALSTORAGE
    if (typeof window !== "undefined") {
      // Always store userId if available
      if (userId) {
        localStorage.setItem('userID', userId);
        console.log('✅ Stored userID:', userId);
      }

      // Store based on role
      if (userRole === 'SHIPPER') {
        if (shipperId) {
          localStorage.setItem('shipper_id', shipperId);
          console.log('✅ Stored shipper_id:', shipperId);
        } else if (userId) {
          // If no specific shipperId but we have userId, use that
          localStorage.setItem('shipper_id', "");
          console.log('✅ Stored shipper_id from userId:', userId);
        }
      } else if (userRole === 'TRANSPORTER') {
        if (transporterId) {
          localStorage.setItem('transporter_id', transporterId);
          console.log('✅ Stored transporter_id:', transporterId);
        } else if (userId) {
          localStorage.setItem('transporter_id', userId);
          console.log('✅ Stored transporter_id from userId:', userId);
        }
      } else {
        // For unknown role, store as both for safety
        if (userId) {
          localStorage.setItem('userID', userId);
          localStorage.setItem('shipper_id', ""); // Store as shipper_id too as fallback
          console.log('✅ Stored userID and shipper_id (fallback):', userId);
        }
      }

      // Final verification log
      console.log('📦 Final localStorage values:', {
        userID: localStorage.getItem('userID'),
        shipper_id: localStorage.getItem('shipper_id'),
        transporter_id: localStorage.getItem('transporter_id'),
        user_role: localStorage.getItem('user_role'),
        auth_token: localStorage.getItem('auth_token') ? 'Present' : 'Missing'
      });
    }
  }

  return response;
};

// ============================================
// LOGIN FUNCTION - ENHANCED ROLE DETECTION
// ============================================

export const loginUser = async (email, password) => {
  console.log('🔐 Login attempt for:', email);

  const response = await apiCall(
    API_ENDPOINTS.AUTH.SIGN_IN,
    "POST",
    {
      email,
      password,
    }
  );

  console.log('📦 Login response received');
  console.log('📋 Full response:', JSON.stringify(response, null, 2));

  if (response.success && response.data) {
    console.log('✅ Login successful');

    // Extract token from response
    const tokenFields = [
      'token', 'access', 'access_token', 'accessToken',
      'Authorization', 'auth_token', 'jwt', 'bearer'
    ];

    let token = null;
    for (const field of tokenFields) {
      if (response.data[field] || response[field]) {
        token = response.data[field] || response[field];
        console.log(`✅ Token found in ${field}`);
        break;
      }
    }

    if (token) {
      // Store token in cookie and localStorage
      setTokenInCookie(token, 30);
      if (typeof window !== "undefined") {
        localStorage.setItem('auth_token', token);
        console.log('✅ Token stored in localStorage');
      }

      // DECODE JWT TO EXTRACT USER INFORMATION
      console.log('🔑 Attempting to decode JWT token...');

      // Extract all IDs from token
      const { userId, shipperId, transporterId, role: roleFromToken } = extractIdsFromToken(token);

      // Also try to extract from response data (fallback)
      const userIdFromResponse = extractUserId(response.data);
      const roleFromResponse = extractRole(response.data);

      // Check specifically for shipper_id in response
      let shipperIdFromResponse = null;
      let transporterIdFromResponse = null;

      if (response.data) {
        // Look for shipper_id field specifically
        if (response.data.shipper_id) {
          shipperIdFromResponse = response.data.shipper_id;
          console.log('✅ Found shipper_id directly in response:', shipperIdFromResponse);
        } else if (response.data.shipperId) {
          shipperIdFromResponse = response.data.shipperId;
          console.log('✅ Found shipperId directly in response:', shipperIdFromResponse);
        }

        // Look for transporter_id field specifically
        if (response.data.transporter_id) {
          transporterIdFromResponse = response.data.transporter_id;
          console.log('✅ Found transporter_id directly in response:', transporterIdFromResponse);
        } else if (response.data.transporterId) {
          transporterIdFromResponse = response.data.transporterId;
          console.log('✅ Found transporterId directly in response:', transporterIdFromResponse);
        }
      }

      // Use token data first (more reliable), fallback to response data
      const finalUserId = userId || userIdFromResponse;
      const finalUserRole = roleFromToken || roleFromResponse;

      // Use specific IDs from token first, then from response
      // IMPORTANT: Only set shipper_id if it exists and is not empty
      const finalShipperId = (shipperId && shipperId !== "") ? shipperId :
        (shipperIdFromResponse && shipperIdFromResponse !== "") ? shipperIdFromResponse : null;

      const finalTransporterId = (transporterId && transporterId !== "") ? transporterId :
        (transporterIdFromResponse && transporterIdFromResponse !== "") ? transporterIdFromResponse : null;

      console.log('📊 Final extracted data:', {
        userId: finalUserId,
        userRole: finalUserRole,
        shipperId: finalShipperId,
        transporterId: finalTransporterId,
        fromToken: { userId, shipperId, transporterId, role: roleFromToken },
        fromResponse: {
          userId: userIdFromResponse,
          role: roleFromResponse,
          shipperId: shipperIdFromResponse,
          transporterId: transporterIdFromResponse
        }
      });

      // Store role
      if (finalUserRole && typeof window !== "undefined") {
        localStorage.setItem('user_role', finalUserRole);
        console.log('✅ Role stored in localStorage:', finalUserRole);
      } else {
        console.error('❌ Could not extract user role!');
      }

      // STORE ALL IDs IN LOCALSTORAGE
      if (typeof window !== "undefined") {
        // Always store userId if available
        if (finalUserId) {
          localStorage.setItem('userID', finalUserId);
          console.log('✅ Stored userID:', finalUserId);
        }

        // Store based on role - ONLY set if the ID actually exists
        if (finalUserRole === 'SHIPPER') {
          if (finalShipperId) {
            localStorage.setItem('shipper_id', finalShipperId);
            console.log('✅ Stored shipper_id:', finalShipperId);
          } else {
            // If user is SHIPPER but no shipper_id found, set to empty string
            localStorage.setItem('shipper_id', '');
            console.log('⚠️ No shipper_id found for SHIPPER role, set to empty string');
          }

          // Ensure transporter_id is empty for shipper
          localStorage.setItem('transporter_id', '');

        } else if (finalUserRole === 'TRANSPORTER') {
          if (finalTransporterId) {
            localStorage.setItem('transporter_id', finalTransporterId);
            console.log('✅ Stored transporter_id:', finalTransporterId);
          } else {
            localStorage.setItem('transporter_id', '');
            console.log('⚠️ No transporter_id found for TRANSPORTER role, set to empty string');
          }

          // Ensure shipper_id is empty for transporter
          localStorage.setItem('shipper_id', '');

        } else {
          // For unknown role, store userId only
          if (finalUserId) {
            localStorage.setItem('userID', finalUserId);
          }
          // Set both role-specific IDs to empty
          localStorage.setItem('shipper_id', '');
          localStorage.setItem('transporter_id', '');
          console.log('✅ Stored userID only for unknown role');
        }

        // Final verification log
        console.log('📦 Final localStorage values:', {
          userID: localStorage.getItem('userID'),
          shipper_id: localStorage.getItem('shipper_id'),
          transporter_id: localStorage.getItem('transporter_id'),
          user_role: localStorage.getItem('user_role'),
          auth_token: localStorage.getItem('auth_token') ? 'Present' : 'Missing'
        });
      }

      // Add role to response.data for easy access
      if (finalUserRole) {
        response.data.role = finalUserRole;
      }
    } else {
      console.warn('⚠️ Token not found in login response');
    }
  }

  return response;
};

// ============================================
// SHIPMENT FUNCTIONS
// ============================================

/**
 * Get shipment details by ID
 */
export const getShipmentDetails = async (shipmentId) => {
  console.log('🔍 Fetching shipment details for ID:', shipmentId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.GET_BY_ID(shipmentId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get all shipments for a shipper
 */
export const getShipperShipments = async (shipperId, page = 1, limit = 10, searchTerm = '') => {
  console.log('📦 Fetching shipments for shipper:', shipperId);

  const baseUrl = API_ENDPOINTS.SHIPMENT.GET_SHIPPER_SHIPMENTS(shipperId);
  const url = new URL(baseUrl);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  if (searchTerm) {
    url.searchParams.append('searchTerm', searchTerm);
  }

  const response = await apiCall(
    url.toString(),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Create a new shipment
 */
export const createShipment = async (formData) => {
  console.log('🚀 Creating new shipment');

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.CREATE,
    'POST',
    formData,
    {},
    true // isFormData = true
  );

  return response;
};

/**
 * Update a shipment
 */
export const updateShipment = async (shipmentId, formData) => {
  console.log('📝 Updating shipment:', shipmentId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.UPDATE(shipmentId),
    'PUT',
    formData,
    {},
    true // isFormData = true
  );

  return response;
};

/**
 * Delete a shipment
 */
export const deleteShipment = async (shipmentId) => {
  console.log('🗑️ Deleting shipment:', shipmentId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.DELETE(shipmentId),
    'DELETE',
    null,
    {},
    false
  );

  return response;
};

/**
 * Track a shipment
 */
export const trackShipment = async (shipmentId) => {
  console.log('📍 Tracking shipment:', shipmentId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.TRACK(shipmentId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

// ============================================
// SHIPMENT FUNCTIONS (for Transporter)
// ============================================

/**
 * Get shipments assigned to a transporter
 */
export const getTransporterShipments = async (transporterId, page = 1, limit = 10, searchTerm = '') => {
  console.log('📦 Fetching shipments for transporter:', transporterId);

  const response = await apiCall(
    API_ENDPOINTS.SHIPMENT.GET_TRANSPORTER_SHIPMENTS(transporterId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

// ============================================
// PAYMENT FUNCTIONS
// ============================================

/**
 * Initialize PayDunya payment
 */
export const initializePayment = async (amount) => {
  console.log('💰 Initializing payment for amount:', amount);

  // Use direct fetch instead of apiCall to avoid extra headers
  const response = await fetch('https://server.lawapantruck.com/api/v1/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ amount: amount })
  });

  const data = await response.json();
  console.log('📦 PayDunya response:', data);

  return data;
};

// ============================================
// VEHICLE FUNCTIONS (for Transporter)
// ============================================

/**
 * Get all vehicles for a transporter
 */
export const getTransporterVehicles = async (transporterId, page = 1, limit = 10, searchTerm = '') => {
  console.log('🚛 Fetching vehicles for transporter:', transporterId);

  const url = `${API_ENDPOINTS.VEHICLE.GET_BY_TRANSPORTER(transporterId)}?page=${page}&limit=${limit}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`;

  const response = await apiCall(
    url,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get vehicle details by ID
 */
export const getVehicleDetails = async (vehicleId) => {
  console.log('🔍 Fetching vehicle details for ID:', vehicleId);

  const response = await apiCall(
    API_ENDPOINTS.VEHICLE.GET_BY_ID(vehicleId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Create a new vehicle
 */
export const createVehicle = async (formData) => {
  console.log('🚛 Creating new vehicle');

  const response = await apiCall(
    API_ENDPOINTS.VEHICLE.CREATE,
    'POST',
    formData,
    {},
    true // isFormData = true for file uploads
  );

  return response;
};

/**
 * Update a vehicle
 */
export const updateVehicle = async (vehicleId, formData) => {
  console.log('📝 Updating vehicle:', vehicleId);

  const response = await apiCall(
    API_ENDPOINTS.VEHICLE.UPDATE(vehicleId),
    'PATCH',
    formData,
    {},
    true // isFormData = true for file uploads
  );

  return response;
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (vehicleId) => {
  console.log('🗑️ Deleting vehicle:', vehicleId);

  const response = await apiCall(
    API_ENDPOINTS.VEHICLE.DELETE(vehicleId),
    'DELETE',
    null,
    {},
    false
  );

  return response;
};

// ============================================
// DRIVER FUNCTIONS (for Transporter)
// ============================================

/**
 * Get all drivers for a transporter
 */
export const getTransporterDrivers = async (transporterId, page = 1, limit = 10, searchTerm = '') => {
  console.log('👤 Fetching drivers for transporter:', transporterId);

  const url = `${API_ENDPOINTS.DRIVER.GET_BY_TRANSPORTER(transporterId)}?page=${page}&limit=${limit}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`;

  const response = await apiCall(
    url,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get driver details by ID
 */
export const getDriverDetails = async (driverId) => {
  console.log('🔍 Fetching driver details for ID:', driverId);

  const response = await apiCall(
    API_ENDPOINTS.DRIVER.GET_BY_ID(driverId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Create a new driver
 */
export const createDriver = async (formData) => {
  console.log('👤 Creating new driver');

  const response = await apiCall(
    API_ENDPOINTS.DRIVER.CREATE,
    'POST',
    formData,
    {},
    true // isFormData = true for file uploads
  );

  return response;
};

/**
 * Update a driver
 */
export const updateDriver = async (driverId, formData) => {
  console.log('📝 Updating driver:', driverId);

  const response = await apiCall(
    API_ENDPOINTS.DRIVER.UPDATE(driverId),
    'PATCH', // Using PATCH method as specified
    formData,
    {},
    true // isFormData = true for file uploads
  );

  return response;
};

/**
 * Delete a driver
 */
export const deleteDriver = async (driverId) => {
  console.log('🗑️ Deleting driver:', driverId);

  const response = await apiCall(
    API_ENDPOINTS.DRIVER.DELETE(driverId),
    'DELETE',
    null,
    {},
    false
  );

  return response;
};



// ============================================
// LOGOUT FUNCTION
// ============================================

export const logoutUser = () => {
  console.log('🚪 Logging out user');

  removeTokenFromCookie();

  if (typeof window !== "undefined") {
    localStorage.removeItem('shipper_id');
    localStorage.removeItem('transporter_id');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('rememberEmail');
    localStorage.removeItem('user_role');
  }

  console.log('✅ User logged out successfully');
  window.location.href = "/login";
};

// ============================================
// FORGOT PASSWORD FUNCTIONS
// ============================================

export const forgotPasswordRequest = async (email) => {
  console.log('🔑 Forgot password request for:', email);
  const response = await apiCall(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, "POST", { email });
  return response;
};

export const verifyOTPForReset = async (email, otp) => {
  console.log('🔢 Verifying OTP for:', email);
  const response = await apiCall(API_ENDPOINTS.AUTH.VERIFY_OTP, "POST", { email, otp });
  return response;
};

export const resetPasswordWithToken = async (verificationToken, newPassword, confirmPassword) => {
  console.log('🔐 Resetting password with verification token');
  const response = await apiCall(API_ENDPOINTS.AUTH.RESET_PASSWORD, "POST", {
    verification_token: verificationToken,
    new_password: newPassword,
    confirm_password: confirmPassword
  });
  return response;
};

// ============================================
// ISSUES FUNCTIONS
// ============================================

/**
 * Get all issues for a shipment
 */
export const getShipmentIssues = async (shipmentId, page = 1, limit = 10, searchTerm = '') => {
  console.log('🔍 Fetching issues for shipment:', shipmentId);

  const url = `${API_ENDPOINTS.ISSUES.GET_BY_SHIPMENT(shipmentId)}?page=${page}&limit=${limit}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`;

  const response = await apiCall(
    url,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get issue details by ID
 */
export const getIssueDetails = async (issueId) => {
  console.log('🔍 Fetching issue details for ID:', issueId);

  const response = await apiCall(
    API_ENDPOINTS.ISSUES.GET_BY_ID(issueId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Delete an issue
 */
export const deleteIssue = async (issueId) => {
  console.log('🗑️ Deleting issue:', issueId);

  const response = await apiCall(
    API_ENDPOINTS.ISSUES.DELETE(issueId),
    'DELETE',
    null,
    {},
    false
  );

  return response;
};

/**
 * Create a new issue
 */
export const createIssue = async (issueData) => {
  console.log('📝 Creating new issue');

  const response = await apiCall(
    API_ENDPOINTS.ISSUES.CREATE,
    'POST',
    issueData,
    {},
    false
  );

  return response;
};

/**
 * Update an issue
 */
export const updateIssue = async (issueId, issueData) => {
  console.log('📝 Updating issue:', issueId);

  const response = await apiCall(
    API_ENDPOINTS.ISSUES.UPDATE(issueId),
    'PUT',
    issueData,
    {},
    false
  );

  return response;
};

// ============================================
// STATS FUNCTIONS
// ============================================

/**
 * Get shipper dashboard stats
 */
export const getShipperStats = async (shipperId) => {
  console.log('📊 Fetching stats for shipper:', shipperId);

  const response = await apiCall(
    API_ENDPOINTS.STATS.SHIPPER(shipperId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get transporter dashboard stats
 */
export const getTransporterStats = async (transporterId) => {
  console.log('📊 Fetching stats for transporter:', transporterId);

  const response = await apiCall(
    API_ENDPOINTS.STATS.TRANSPORTER(transporterId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

// ============================================
// BIDS FUNCTIONS (for Transporter)
// ============================================

/**
 * Get all available bids for transporters
 */
export const getAvailableBids = async (page = 1, limit = 8, searchTerm = '') => {
  console.log('🔍 Fetching available bids...');

  const url = `${API_ENDPOINTS.BID.GET_ALL}?page=${page}&limit=${limit}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`;

  const response = await apiCall(
    url,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Get bid details by ID
 */
export const getBidDetails = async (bidId) => {
  console.log('🔍 Fetching bid details for ID:', bidId);

  const response = await apiCall(
    API_ENDPOINTS.BID.GET_BY_ID(bidId),
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Place a bid on a shipment
 */
export const placeBid = async (bidData) => {
  console.log('📝 Placing bid:', bidData);

  // Expected payload structure:
  // {
  //   transporter_id: "697be5efc75cbc247f0e6a89",
  //   shipment_id: "697bbc23f1facde4e510c1d5",
  //   driver_id: "697e12dba066e5be86b47ee4",
  //   vehicle_id: "697d1ade5f7a078fa03730d4",
  //   bid_amount: "16000"
  // }

  const response = await apiCall(
    API_ENDPOINTS.BID.PLACE,
    'POST',
    bidData,
    {},
    false
  );

  return response;
};

/**
 * Update a bid
 */
export const updateBid = async (bidId, bidData) => {
  console.log('📝 Updating bid:', bidId);

  const response = await apiCall(
    API_ENDPOINTS.BID.UPDATE(bidId),
    'PUT',
    bidData,
    {},
    false
  );

  return response;
};

/**
 * Withdraw a bid
 */
export const withdrawBid = async (bidId) => {
  console.log('🗑️ Withdrawing bid:', bidId);

  const response = await apiCall(
    API_ENDPOINTS.BID.WITHDRAW(bidId),
    'DELETE',
    null,
    {},
    false
  );

  return response;
};

// ============================================
// ISSUES FUNCTIONS (for Transporter)
// ============================================

/**
 * Get all issues for a transporter
 */
export const getTransporterIssues = async (transporterId, page = 1, limit = 10, searchTerm = '') => {
  console.log('📋 Fetching issues for transporter:', transporterId);

  const url = `${API_ENDPOINTS.ISSUES.GET_BY_TRANSPORTER(transporterId)}?page=${page}&limit=${limit}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`;

  const response = await apiCall(
    url,
    'GET',
    null,
    {},
    false
  );

  return response;
};

/**
 * Create a new issue
 */
// export const createIssue = async (issueData) => {
//   console.log('📝 Creating new issue:', issueData);

//   const response = await apiCall(
//     API_ENDPOINTS.ISSUES.CREATE,
//     'POST',
//     issueData,
//     {},
//     false
//   );

//   return response;
// };

/**
 * Get issue details by ID
 */
// export const getIssueDetails = async (issueId) => {
//   console.log('🔍 Fetching issue details for ID:', issueId);

//   const response = await apiCall(
//     API_ENDPOINTS.ISSUES.GET_BY_ID(issueId),
//     'GET',
//     null,
//     {},
//     false
//   );

//   return response;
// };

/**
 * Update an issue
 */
// export const updateIssue = async (issueId, issueData) => {
//   console.log('📝 Updating issue:', issueId);

//   const response = await apiCall(
//     API_ENDPOINTS.ISSUES.UPDATE(issueId),
//     'PUT',
//     issueData,
//     {},
//     false
//   );

//   return response;
// };

/**
 * Delete an issue
 */
// export const deleteIssue = async (issueId) => {
//   console.log('🗑️ Deleting issue:', issueId);

//   const response = await apiCall(
//     API_ENDPOINTS.ISSUES.DELETE(issueId),
//     'DELETE',
//     null,
//     {},
//     false
//   );

//   return response;
// };

// ============================================
// OTHER AUTH FUNCTIONS
// ============================================

export const sendOTP = async (email) => {
  console.log('📧 Sending OTP to:', email);
  return apiCall(API_ENDPOINTS.AUTH.SEND_OTP, "POST", { email });
};

export const verifyOTP = async (email, otp) => {
  console.log('🔢 Verifying OTP');
  return apiCall(API_ENDPOINTS.AUTH.VERIFY_OTP, "POST", { email, otp });
};

export const resetPassword = async (email, otp, newPassword, newPassword2) => {
  console.log('🔐 Resetting password');
  return apiCall(API_ENDPOINTS.AUTH.RESET_PASSWORD, "POST", {
    email, otp,
    new_password: newPassword,
    new_password2: newPassword2,
  });
};

export const changePassword = async (oldPassword, newPassword, newPassword2) => {
  console.log('🔐 Changing password');
  return apiCall(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, "POST", {
    old_password: oldPassword,
    new_password: newPassword,
    new_password2: newPassword2,
  });
};

export const verifyEmail = async (email) => {
  console.log('📧 Verifying email:', email);
  return apiCall(API_ENDPOINTS.AUTH.VERIFY_EMAIL, "POST", { email });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getToken = () => {
  return getTokenFromCookie();
};

export const isAuthenticated = () => {
  const token = getTokenFromCookie();
  return !!token;
};

export const getUserRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('user_role');
  }
  return null;
};


// ============================================
// DEFAULT EXPORT
// ============================================

export default apiCall;