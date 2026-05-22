import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

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
        setUser(JSON.parse(storedUser));
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
