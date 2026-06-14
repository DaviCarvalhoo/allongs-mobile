import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { eventBus } from './eventBus';

// Detecta o IP do host dinamicamente
function getHostIP(): string {
  // Web: usa o mesmo hostname do browser (mesma máquina que serve o Expo)
  if (Platform.OS === 'web') {
    // window.location.hostname = 'localhost' quando rodando localmente
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    }
    return 'localhost';
  }

  // Mobile: usa o IP do Metro Bundler, que é o mesmo da máquina host
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    console.log(`[api] IP detectado automaticamente: ${ip}`);
    return ip;
  }

  // Fallback: emulador Android usa 10.0.2.2 para acessar o host
  console.log('[api] Usando fallback: 10.0.2.2 (emulador Android)');
  return '10.0.2.2';
}

const HOST_IP = getHostIP();

const api = axios.create({
  baseURL: `http://${HOST_IP}:3001/api`,
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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    // Se token inválido/expirado: limpa storage e força logout
    if (status === 401 || status === 403) {
      const isAuthRoute = config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        console.log('[api] Token inválido (401/403), forçando logout...');
        await AsyncStorage.multiRemove(['@allongs_token', '@allongs_user']);
        eventBus.emit('auth:logout');
      }
      return Promise.reject(error);
    }

    // Tenta fallback 10.0.2.2 apenas no mobile se falhar com IP da máquina
    if (
      Platform.OS !== 'web' &&
      !config._retry &&
      (error.message === 'Network Error' || error.code === 'ECONNABORTED') &&
      !config.baseURL.includes('10.0.2.2')
    ) {
      config._retry = true;
      console.log('Falha na rede, tentando fallback 10.0.2.2 (emulador)...');
      config.baseURL = 'http://10.0.2.2:3001/api';
      return axios(config);
    }
    return Promise.reject(error);
  }
);

export default api;
