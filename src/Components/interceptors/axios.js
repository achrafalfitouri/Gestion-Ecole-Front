import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'http://127.0.0.1:3000';

// Function to set the Authorization header
const setAuthHeader = (token) => {
  axios.defaults.headers.common['Authorization'] = `${token}`;
};

// Interceptor to handle token expiration
axios.interceptors.response.use(
  response => {
    // Any specific handling of successful responses can go here
    return response;
  },
  async error => {
    const { config, response: { status } } = error;
    if (status === 401) {
      // Handle unauthorized error (token expired or invalid)
      Cookies.remove('token');
      localStorage.removeItem('user');
      // Optionally, you can redirect to login or show a message
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

const fetchUserData = async () => {
  try {
    const token = Cookies.get('token');
    if (token) {
      setAuthHeader(token); // Set the token in the Authorization header
      const response = await axios.get('/api/auth/me', {
        withCredentials: true,
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
