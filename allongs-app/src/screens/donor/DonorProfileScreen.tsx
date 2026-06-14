import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import MonthlyExtractModal from '../../components/MonthlyExtractModal';

export default function DonorProfileScreen({ navigation }: any) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtractVisible, setIsExtractVisible] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [stats, setStats] = useState<any>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const res = await api.get('/donations/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch donation stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name || undefined,
        avatar_url: avatarUrl || undefined,
      });
      if (updateUser) updateUser(res.data);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setAvatarUrl(user?.avatar_url || '');
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
          <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center' }}>
        
        {/* Hero Profile Section */}
        <View className="flex-col items-center mb-12 mt-4">
          <View className="relative">
            <View
              className="w-40 h-40 overflow-hidden shadow-2xl"
              style={{ borderTopLeftRadius: 48, borderTopRightRadius: 48, borderBottomRightRadius: 48, borderBottomLeftRadius: 0 }}
            >
              <Image 
                source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            {/* Edit button next to photo */}
            {!isEditing && (
              <TouchableOpacity
                className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-full shadow-lg"
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons name="edit" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View className="w-full mt-6">
              {/* Edit Name */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Nome</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-4">
                <MaterialIcons name="person" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  placeholderTextColor="#707973"
                />
              </View>

              {/* Edit Avatar URL */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">URL da Foto</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-6">
                <MaterialIcons name="image" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={avatarUrl}
                  onChangeText={setAvatarUrl}
                  placeholder="https://..."
                  placeholderTextColor="#707973"
                  autoCapitalize="none"
                />
              </View>

              {/* Save / Cancel buttons */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="flex-1 py-4 rounded-full items-center bg-surface-container-high"
                  onPress={handleCancel}
                >
                  <Text className="font-headline-bold text-on-surface">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-4 rounded-full items-center bg-primary"
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-headline-bold">Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="mt-6 text-3xl font-headline-extrabold text-on-surface tracking-tight text-center">
                {user?.name || 'Usuário Doador'}
              </Text>
              <Text className="text-on-surface-variant font-body font-medium mt-1 text-center">
                Doador Ativo · Transformando Vidas
              </Text>
            </>
          )}
        </View>

        {/* Impact Bento Grid + Actions */}
        {!isEditing && (
          <>
            <View className="w-full flex-row gap-4 mb-8">
              {/* Doações — dados reais da API */}
              <View className="flex-1 bg-surface-container-low p-6 rounded-2xl justify-between" style={{ aspectRatio: 1 }}>
                <View>
                  <MaterialIcons name="favorite" size={28} color="#0f5238" style={{ marginBottom: 8 }} />
                  <Text className="font-headline-bold text-lg text-primary">Doações</Text>
                </View>
                <View>
                  {isLoadingStats ? (
                    <ActivityIndicator size="small" color="#0f5238" style={{ alignSelf: 'flex-start', marginBottom: 4 }} />
                  ) : (
                    <Text className="text-3xl font-headline-extrabold text-on-surface">
                      {formatCurrency(stats?.total_donated || 0)}
                    </Text>
                  )}
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Contribuído</Text>
                </View>
              </View>

              {/* Campanhas Apoiadas — dados reais da API */}
              <View className="flex-1 p-6 rounded-2xl justify-between" style={{ aspectRatio: 1, backgroundColor: '#d4f5e2' }}>
                <View>
                  <MaterialIcons name="emoji-events" size={28} color="#0f5238" style={{ marginBottom: 8 }} />
                  <Text className="font-headline-bold text-lg" style={{ color: '#0f5238' }}>Campanhas</Text>
                </View>
                <View>
                  {isLoadingStats ? (
                    <ActivityIndicator size="small" color="#0f5238" style={{ alignSelf: 'flex-start', marginBottom: 4 }} />
                  ) : (
                    <Text className="text-3xl font-headline-extrabold" style={{ color: '#0f5238' }}>
                      {stats?.campaigns_supported || 0}
                    </Text>
                  )}
                  <Text className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#0f5238', opacity: 0.7 }}>Causas Apoiadas</Text>
                </View>
              </View>
            </View>

            {/* Export Extract Button */}
            <View className="w-full mb-4">
              <TouchableOpacity
                className="p-5 rounded-2xl border flex-row items-center"
                style={{ backgroundColor: 'rgba(177, 240, 206, 0.15)', borderColor: 'rgba(15, 82, 56, 0.1)' }}
                activeOpacity={0.7}
                onPress={() => setIsExtractVisible(true)}
              >
                <View className="p-3 rounded-full bg-primary-fixed">
                  <MaterialIcons name="receipt-long" size={22} color="#0f5238" />
                </View>
                <View className="ml-4">
                  <Text className="font-headline-bold text-on-surface text-base">Exportar Extrato Mensal</Text>
                  <Text className="text-sm font-body text-on-surface-variant">Gerar relatório de doações</Text>
                </View>
                <View className="ml-auto">
                  <MaterialIcons name="chevron-right" size={24} color="#707973" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View className="w-full">
              <TouchableOpacity 
                className="p-5 rounded-2xl border flex-row items-center"
                style={{ backgroundColor: 'rgba(255, 218, 214, 0.2)', borderColor: 'rgba(186, 26, 26, 0.05)' }}
                activeOpacity={0.7}
                onPress={logout}
              >
                <View className="p-3 rounded-full" style={{ backgroundColor: '#ffdad6' }}>
                  <MaterialIcons name="logout" size={22} color="#93000a" />
                </View>
                <View className="ml-4">
                  <Text className="font-headline-bold text-on-surface text-base">Sair da Conta</Text>
                  <Text className="text-sm font-body text-on-surface-variant">Desconectar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        </ScrollView>
      </KeyboardAvoidingView>

      <MonthlyExtractModal 
        visible={isExtractVisible} 
        onClose={() => setIsExtractVisible(false)} 
        userType="doador" 
      />
    </SafeAreaView>
  );
}
