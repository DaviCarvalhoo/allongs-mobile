import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

export default function LoginScreen({ route, navigation }: any) {
  // get user role if passed from welcome
  const role = route?.params?.role || 'doador';
  const [email, setEmail] = useState('doador@allongs.com');
  const [password, setPassword] = useState('doador123456');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.data.token, response.data.user);
    } catch (err: any) {
      console.log("Backend offline, usando login de teste");
      const mockUser = {
        id: '1',
        name: 'Usuário Teste',
        email: email,
        user_type: role
      };
      await login('mock-token-123', mockUser);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70 absolute top-0 w-full">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <View className="flex-1 flex-row pt-20 pb-12 px-6 justify-center items-center max-w-6xl mx-auto w-full">
        {/* Left Image Block (Hidden on Mobile, Visible on lg) */}
        <View className="hidden lg:flex flex-1 relative mr-12">
          <View className="w-full h-[600px] rounded-tl-[3rem] rounded-tr-[3rem] rounded-bl-[3rem] overflow-hidden relative">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJeqz3GoANoTEFyCRObVAZC08nxqd4gcNtL90IAl0O1xkXzprzNyqpE_32i0ecmg5lJYWDAfermXeCXwORTL4QJiJ_pnfiLv85fnmuCkJPjUvuocR95wIuAZ3u50fNblr_2rjSD7xrCN3tTnyUZTzEw50Q0b0VXWfFNhI2l6W-gjArOA8RC14Qi_Ovz6aMSbhItQXH1hWq1g8udHhWnilMoUrfEE95s0JNh9oLoyFpqO8b821-O5kKghEWJ0XrNZmatdpZgbTLrg' }}
              className="w-full h-full absolute"
            />
            <LinearGradient 
              colors={['transparent', 'rgba(15,82,56,0.8)']}
              className="absolute inset-0"
            />
            <View className="absolute bottom-0 left-0 right-0 p-12">
              <Text className="font-headline-bold text-4xl text-white mb-4 leading-tight">
                Capacitando missões locais com visão global.
              </Text>
              <Text className="text-on-primary-container text-lg font-body font-medium opacity-90 max-w-md">
                Junte-se ao nosso santuário para organizações sem fins lucrativos e descubra como pequenas ações criam ondas enormes.
              </Text>
            </View>
          </View>
        </View>

        {/* Form Block */}
        <View className="flex-1 w-full max-w-md mx-auto justify-center">
          <View className="mb-10">
            <Text className="font-headline-extrabold text-3xl text-on-surface tracking-tight mb-2">
              Bem vindo de volta
            </Text>
            <Text className="text-on-surface-variant font-body font-medium">
              Faça login em sua conta para continuar causando impacto.
            </Text>
          </View>

          <View className="flex-row items-center mb-8">
            <View className="flex-1 border-t border-outline-variant opacity-30" />
            <Text className="mx-4 text-xs font-bold font-label text-outline uppercase tracking-widest">
              Faça login com seu email
            </Text>
            <View className="flex-1 border-t border-outline-variant opacity-30" />
          </View>

          <View className="space-y-5 mb-8">
            <View>
              <Text className="text-sm font-label font-bold text-on-surface-variant mb-2 ml-1">
                Endereço de email
              </Text>
              <View className="flex-row items-center bg-surface-container-high rounded-lg px-4">
                <MaterialIcons name="email" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body font-medium text-on-surface"
                  placeholder="name@example.com"
                  placeholderTextColor="#707973"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2 ml-1">
                <Text className="text-sm font-label font-bold text-on-surface-variant">Senha</Text>
                <TouchableOpacity>
                  <Text className="text-sm font-label font-bold text-secondary">Esqueceu sua senha?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center bg-surface-container-high rounded-lg px-4">
                <MaterialIcons name="lock" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body font-medium text-on-surface"
                  placeholder="Insira sua senha"
                  placeholderTextColor="#707973"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility-off" : "visibility"} 
                    size={24} 
                    color="#707973" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className="w-full py-4 bg-primary rounded-full items-center shadow-sm"
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text className="text-white font-headline-bold text-lg">Conecte-se</Text>
          </TouchableOpacity>

          <View className="mt-10 pt-8 border-t border-outline-variant/20 items-center">
            <Text className="text-on-surface-variant font-body font-medium">
              Não tem uma conta?{' '}
              <Text 
                className="text-primary font-bold" 
                onPress={() => navigation.navigate('Register', { role })}
              >
                Criar uma conta
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
