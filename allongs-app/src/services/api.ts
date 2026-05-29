import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In emulator, localhost points to the emulator itself.
// Use 10.0.2.2 for Android emulator, or your machine's IP for physical devices.
const api = axios.create({
  baseURL: 'http://10.50.0.63:3001/api', // Updated to host machine's local IP
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Se for erro de rede e ainda não tentamos o fallback para emulador
    if (!config._retry && (error.message === 'Network Error' || error.code === 'ECONNABORTED')) {
      config._retry = true;
      
      // Se estava tentando o IP da máquina, tenta o IP do emulador
      if (config.baseURL.includes('10.50.0.63')) {
        console.log('Falha na rede (Firewall?), tentando IP do emulador (10.0.2.2)...');
        config.baseURL = 'http://10.0.2.2:3001/api';
        return axios(config); // Refaz a requisição com o novo baseURL
      }
    }
    return Promise.reject(error);
  }
);

export default api;
