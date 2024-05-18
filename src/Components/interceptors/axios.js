import axios from "axios";
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

let isRefreshing = false;
let refreshPromise = null;
let accessTokenExpiry = null;

const updateTokens = (accessToken, refreshToken) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  // Update tokens in memory or wherever needed
};

const getRefreshToken = () => {
  // Assuming you're storing the refresh token in a cookie
  return Cookies.get('refresh_token');
};

const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const response = await axios.post(
      '/api/token/refresh',
      { refreshToken },
      { withCredentials: true }
    );
    const { token, refreshToken: newRefreshToken } = response.data;
    updateTokens(token, newRefreshToken);
    return token;
  } catch (error) {
    // Handle token refresh failure
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const scheduleRefresh = (expiryTime) => {
  const delay = expiryTime - Date.now() - 30000; // Refresh 30 seconds before expiry
  setTimeout(refreshTokens, delay);
};

// Define the refreshTokens function
const refreshTokens = () => {
  // Implement your logic to refresh tokens here
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken()
      .then((token) => {
        const expiryTime = Date.now() + (2592000 * 1000); // 30 days in milliseconds
        scheduleRefresh(expiryTime);
        return token;
      })
      .catch((error) => {
        console.error('Failed to refresh token:', error);
        throw error;
      });
  }

  return refreshPromise;
};

axios.interceptors.response.use(
  response => {
    // Update access token expiry time when a new token is received
    if (response.config.url === '/api/token/refresh') {
      accessTokenExpiry = Date.now() + (2592000 * 1000); // 30 days in milliseconds
    }
    return response;
  },
  async error => {
    const { config, response: { status } } = error;
    if (status === 401 && !isRefreshing) {
      try {
        const token = await refreshTokens();
        config.headers['Authorization'] = `Bearer ${token}`;
        return axios.request(config);
      } catch (refreshError) {
        // Handle failed token refresh
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

const fetchUserData = async () => {
  try {
    const token = Cookies.get('token');
    if (token) {
      const response = await axios.get("/api/user/me", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

export { axios, fetchUserData };
