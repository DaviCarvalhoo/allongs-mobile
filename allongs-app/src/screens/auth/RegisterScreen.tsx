import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';

export default function RegisterScreen({ route, navigation }: any) {
  // role may be passed from WelcomeScreen
  const role = route?.params?.role || 'doador';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (!termsAccepted) {
      alert('Você precisa aceitar os termos de serviço');
      return;
    }

    try {
      const payload = role === 'ong' 
        ? { name, email, password, user_type: role, cnpj, phone } 
        : { name, email, password, user_type: role };
      const response = await api.post('/auth/register', payload);
      await login(response.data.token, response.data.user);
    } catch (err: any) {
      console.log("Backend offline, usando cadastro de teste");
      const mockUser = {
        id: '2',
        name: name || (role === 'ong' ? 'Nova ONG' : 'Novo Usuário'),
        email: email || 'novo@email.com',
        user_type: role
      };
      await login('mock-token-456', mockUser);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70 absolute top-0 w-full">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
          <Text className="text-secondary font-label font-semibold text-sm">Log in</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 48, alignItems: 'center' }}>
        <View className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm">
          <View className="mb-10 items-center lg:items-start">
            <Text className="font-headline-bold text-2xl text-on-surface mb-2">Crie sua conta</Text>
            <Text className="text-on-surface-variant font-body text-sm">Junte-se ao nosso santuário editorial de doações.</Text>
          </View>

          <View className="space-y-6">
            {/* Name */}
            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">
                {role === 'ong' ? 'Nome da Instituição' : 'Nome completo'}
              </Text>
              <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                <MaterialIcons name={role === 'ong' ? "business" : "person"} size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface"
                  placeholder={role === 'ong' ? "Nome da ONG" : "John Doe"}
                  placeholderTextColor="#707973"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* CNPJ & Phone for ONG */}
            {role === 'ong' && (
              <View className="flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
                <View className="flex-1">
                  <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">CNPJ</Text>
                  <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                    <MaterialIcons name="badge" size={20} color="#707973" />
                    <TextInput
                      className="flex-1 py-4 ml-3 font-body text-on-surface"
                      placeholder="00.000.000/0000-00"
                      placeholderTextColor="#707973"
                      value={cnpj}
                      onChangeText={setCnpj}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View className="flex-1 mt-6 md:mt-0">
                  <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Telefone</Text>
                  <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                    <MaterialIcons name="phone" size={20} color="#707973" />
                    <TextInput
                      className="flex-1 py-4 ml-3 font-body text-on-surface"
                      placeholder="(00) 00000-0000"
                      placeholderTextColor="#707973"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Email */}
            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Endereço de email</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                <MaterialIcons name="email" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface"
                  placeholder="name@example.com"
                  placeholderTextColor="#707973"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Grid */}
            <View className="flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <View className="flex-1">
                <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Senha</Text>
                <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                  <MaterialIcons name="lock" size={20} color="#707973" />
                  <TextInput
                    className="flex-1 py-4 ml-3 font-body text-on-surface"
                    placeholder="••••••••"
                    placeholderTextColor="#707973"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#707973" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-1 mt-6 md:mt-0">
                <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Confirmar Senha</Text>
                <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                  <MaterialIcons name="lock-outline" size={20} color="#707973" />
                  <TextInput
                    className="flex-1 py-4 ml-3 font-body text-on-surface"
                    placeholder="••••••••"
                    placeholderTextColor="#707973"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons name={showConfirmPassword ? "visibility-off" : "visibility"} size={20} color="#707973" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Terms */}
            <View className="flex-row items-start gap-3 py-2 mt-4">
              <TouchableOpacity 
                className={`w-5 h-5 rounded border items-center justify-center ${termsAccepted ? 'bg-primary border-primary' : 'bg-surface-container-high border-outline-variant'}`}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                {termsAccepted && <MaterialIcons name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-on-surface-variant font-body leading-tight">
                Eu concordo com os <Text className="text-primary font-bold">Termos de Serviço</Text> e <Text className="text-primary font-bold">política de privacidade</Text>.
              </Text>
            </View>

            {/* Submit */}
            <TouchableOpacity 
              className="w-full bg-primary py-5 rounded-full flex-row justify-center items-center gap-2 mt-6"
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text className="text-white font-headline-bold text-base">Criar conta</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Footer */}
            <View className="pt-8 border-t border-outline-variant/15 items-center mt-6">
              <Text className="text-sm text-on-surface-variant font-body">
                Já tem uma conta?{' '}
                <Text 
                  className="text-secondary font-bold"
                  onPress={() => navigation.navigate('Login', { role })}
                >
                  Faça login
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
