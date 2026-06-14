import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { eventBus } from '../services/eventBus';

type UserType = 'doador' | 'ong';

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  avatar_url?: string;
  org_name?: string;
  org_description?: string;
  org_since?: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  // Escuta evento de logout forçado pelo interceptor 401 do api.ts
  useEffect(() => {
    const handleForceLogout = () => {
      console.log('AuthContext: Logout forçado por token inválido.');
      setUser(null);
    };
    eventBus.on('auth:logout', handleForceLogout);
    return () => eventBus.off('auth:logout', handleForceLogout);
  }, []);

  async function loadStorageData() {
    try {
      console.log('AuthContext: Loading storage data...');
      let storedToken = null;
      let storedUser = null;

      try {
        storedToken = await AsyncStorage.getItem('@allongs_token');
        storedUser = await AsyncStorage.getItem('@allongs_user');
      } catch (storageError) {
        console.error('AsyncStorage error:', storageError);
      }

      if (storedToken && storedUser) {
        // Valida o token com o backend antes de considerar o usuário logado
        try {
          const res = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          // Token válido: usa os dados frescos do backend
          setUser(res.data);
          await AsyncStorage.setItem('@allongs_user', JSON.stringify(res.data));
          console.log('AuthContext: Token válido, sessão restaurada.');
        } catch (validationError: any) {
          const status = validationError?.response?.status;
          if (status === 401 || status === 403) {
            // Token inválido/expirado: limpa sessão
            console.log('AuthContext: Token inválido, limpando sessão...');
            await AsyncStorage.removeItem('@allongs_token');
            await AsyncStorage.removeItem('@allongs_user');
          } else {
            // Erro de rede (backend offline): mantém sessão com dados em cache
            console.log('AuthContext: Backend offline, mantendo sessão em cache.');
            setUser(JSON.parse(storedUser));
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse auth state', e);
    } finally {
      console.log('AuthContext: Loading finished.');
      setIsLoading(false);
    }
  }

  async function login(token: string, userData: User) {
    await AsyncStorage.setItem('@allongs_token', token);
    await AsyncStorage.setItem('@allongs_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function logout() {
    await AsyncStorage.removeItem('@allongs_token');
    await AsyncStorage.removeItem('@allongs_user');
    setUser(null);
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
    AsyncStorage.setItem('@allongs_user', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
