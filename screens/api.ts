// Utility to get API base URL from environment
// For Expo, use process.env or import from 'react-native-dotenv' if configured

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
 
export default API_BASE_URL; 