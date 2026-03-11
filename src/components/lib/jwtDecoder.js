// Create a new file: lib/jwtDecoder.js
// ============================================
// FILE: lib/jwtDecoder.js
// Utility to decode JWT tokens and extract user info
// ============================================

/**
 * Decode a JWT token without using external libraries
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('⚠️ Invalid JWT format - expected 3 parts');
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Base64 decode (handling URL-safe base64)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return null;
  }
};

/**
 * Extract user ID from JWT token
 * Looks for common ID fields in the token payload
 * @param {string} token - JWT token
 * @returns {object} - Object containing userId and shipperId/transporterId
 */
export const extractIdsFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return { userId: null, shipperId: null, transporterId: null };
    
    console.log('🔍 Decoded JWT payload:', decoded);
    
    // Extract values based on your token structure
    const userId = decoded._id || decoded.id || decoded.userId || decoded.user_id || null;
    const shipperId = decoded.shipper_id || decoded.shipperId || null;
    const transporterId = decoded.transporter_id || decoded.transporterId || null;
    const role = decoded.role || null;
    
    console.log('📊 Extracted from token:', {
      userId,
      shipperId,
      transporterId,
      role
    });
    
    return {
      userId,
      shipperId: shipperId || null, // Will be null if not present or empty string
      transporterId: transporterId || null, // Will be null if not present or empty string
      role: role ? role.toUpperCase() : null
    };
  } catch (error) {
    console.error('❌ Error extracting IDs from token:', error);
    return { userId: null, shipperId: null, transporterId: null, role: null };
  }
};

/**
 * Extract user ID from JWT token (legacy function)
 * @param {string} token - JWT token
 * @returns {string|null} - User ID or null
 */
export const extractUserIdFromToken = (token) => {
  const { userId } = extractIdsFromToken(token);
  return userId;
};

/**
 * Extract role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const extractRoleFromToken = (token) => {
  const { role } = extractIdsFromToken(token);
  return role;
};

/**
 * Extract shipper ID from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - Shipper ID or null
 */
export const extractShipperIdFromToken = (token) => {
  const { shipperId } = extractIdsFromToken(token);
  return shipperId;
};

/**
 * Extract transporter ID from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - Transporter ID or null
 */
export const extractTransporterIdFromToken = (token) => {
  const { transporterId } = extractIdsFromToken(token);
  return transporterId;
};

export default {
  decodeJWT,
  extractIdsFromToken,
  extractUserIdFromToken,
  extractRoleFromToken,
  extractShipperIdFromToken,
  extractTransporterIdFromToken
};