import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In emulator, localhost points to the emulator itself.
// Use 10.0.2.2 for Android emulator, or your machine's IP for physical devices.
const api = axios.create({
  baseURL: 'http://10.0.2.2:3001/api', // Adjust if testing on physical device
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@allongs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
