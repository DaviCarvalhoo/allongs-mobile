import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ONGProfileScreen({ navigation }: any) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [orgName, setOrgName] = useState(user?.org_name || '');
  const [orgDescription, setOrgDescription] = useState(user?.org_description || '');
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        api.get('/donations/ong-stats'),
        api.get('/campaigns/my'),
      ]);
      setStats(statsRes.data);
      setCampaigns(campaignsRes.data);
    } catch (err) {
      console.error('Failed to fetch ONG profile data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [fetchData])
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name || undefined,
        avatar_url: avatarUrl || undefined,
        org_name: orgName || undefined,
        org_description: orgDescription || undefined,
      });
      if (updateUser) updateUser(res.data);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil da ONG atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setOrgName(user?.org_name || '');
    setOrgDescription(user?.org_description || '');
    setName(user?.name || '');
    setAvatarUrl(user?.avatar_url || '');
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
        {!isEditing && (
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center"
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={20} color="#0f5238" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>

        {/* Hero Profile Section */}
        <View className="flex-col items-center mb-12">
          <View className="relative">
            <View
              className="w-40 h-40 overflow-hidden shadow-lg"
              style={{ borderTopLeftRadius: 48, borderTopRightRadius: 48, borderBottomRightRadius: 48, borderBottomLeftRadius: 0 }}
            >
              {(avatarUrl || user?.avatar_url) ? (
                <Image
                  source={{ uri: avatarUrl || user?.avatar_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-primary items-center justify-center">
                  <Text className="text-white text-5xl font-headline-bold">
                    {orgName?.charAt(0) || user?.name?.charAt(0) || 'O'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {isEditing ? (
            <View className="w-full mt-6">
              {/* Edit Org Name */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Nome da Organização</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-4">
                <MaterialIcons name="business" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={orgName}
                  onChangeText={setOrgName}
                  placeholder="Nome da ONG"
                  placeholderTextColor="#707973"
                />
              </View>

              {/* Edit Responsible Name */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Responsável</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-4">
                <MaterialIcons name="person" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={name}
                  onChangeText={setName}
                  placeholder="Nome do responsável"
                  placeholderTextColor="#707973"
                />
              </View>

              {/* Edit Description */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Descrição</Text>
              <View className="flex-row items-start bg-surface-container-high rounded-xl px-4 mb-4">
                <MaterialIcons name="description" size={20} color="#707973" style={{ marginTop: 16 }} />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base h-32"
                  value={orgDescription}
                  onChangeText={setOrgDescription}
                  placeholder="Descrição da organização..."
                  placeholderTextColor="#707973"
                  multiline
                  textAlignVertical="top"
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
                {user?.org_name || user?.name || 'Minha ONG'}
              </Text>
              <Text className="text-on-surface-variant font-body font-medium mt-1">
                ONG · Desde {user?.org_since || '2024'}
              </Text>

              {/* Badges */}
              <View className="flex-row items-center gap-2 mt-3">
                <View className="flex-row items-center px-3 py-1 bg-primary-fixed rounded-full">
                  <MaterialIcons name="verified" size={12} color="#0e5138" style={{ marginRight: 4 }} />
                  <Text className="text-xs font-bold tracking-tight" style={{ color: '#0e5138' }}>Verificada</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* About Section — only in view mode */}
        {!isEditing && (
          <View className="mb-10">
            <View className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
              <View className="flex-row items-center gap-2 mb-3">
                <MaterialIcons name="info" size={22} color="#0f5238" />
                <Text className="font-headline-bold text-lg text-primary">Sobre a Organização</Text>
              </View>
              <Text className="text-on-surface-variant text-sm leading-relaxed font-body">
                {user?.org_description || 'Descrição da organização não disponível.'}
              </Text>
            </View>
          </View>
        )}

        {/* Impact Bento Grid 2x2 */}
        {!isEditing && (
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0f5238" className="mt-10 mb-10" />
            ) : stats && (
              <View className="mb-12">
                <View className="flex-row gap-4 mb-4">
                  {/* Arrecadado */}
                  <View className="flex-1 bg-surface-container-low p-6 rounded-2xl" style={{ aspectRatio: 1 }}>
                    <View className="flex-1 justify-between">
                      <View>
                        <MaterialIcons name="volunteer-activism" size={28} color="#0f5238" />
                        <Text className="font-headline-bold text-lg text-primary mt-2">Arrecadado</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-headline-extrabold text-on-surface">{formatCurrency(stats.total_raised)}</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Recebido</Text>
                      </View>
                    </View>
                  </View>
                  {/* Campanhas */}
                  <View className="flex-1 p-6 rounded-2xl" style={{ aspectRatio: 1, backgroundColor: '#a3d8fe' }}>
                    <View className="flex-1 justify-between">
                      <View>
                        <MaterialIcons name="campaign" size={28} color="#255f80" />
                        <Text className="font-headline-bold text-lg mt-2" style={{ color: '#255f80' }}>Campanhas</Text>
                      </View>
                      <View>
                        <Text className="text-3xl font-headline-extrabold" style={{ color: '#255f80' }}>{stats.campaign_count}</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#255f80', opacity: 0.7 }}>Ativas Atualmente</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  {/* Doadores */}
                  <View className="flex-1 p-6 rounded-2xl" style={{ aspectRatio: 1, backgroundColor: 'rgba(255, 223, 150, 0.3)' }}>
                    <View className="flex-1 justify-between">
                      <View>
                        <MaterialIcons name="group" size={28} color="#5a4400" />
                        <Text className="font-headline-bold text-lg mt-2" style={{ color: '#5a4400' }}>Doadores</Text>
                      </View>
                      <View>
                        <Text className="text-3xl font-headline-extrabold text-on-surface">{stats.active_donors}</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Apoiadores Ativos</Text>
                      </View>
                    </View>
                  </View>
                  {/* Doações */}
                  <View className="flex-1 bg-surface-container-low p-6 rounded-2xl" style={{ aspectRatio: 1 }}>
                    <View className="flex-1 justify-between">
                      <View>
                        <MaterialIcons name="payments" size={28} color="#0f5238" />
                        <Text className="font-headline-bold text-lg text-primary mt-2">Doações</Text>
                      </View>
                      <View>
                        <Text className="text-3xl font-headline-extrabold text-on-surface">{stats.donation_count}</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Recebidas</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Logout Button */}
            <TouchableOpacity
              className="mt-4 p-5 rounded-2xl border flex-row items-center"
              style={{ backgroundColor: 'rgba(255, 218, 214, 0.2)', borderColor: 'rgba(186, 26, 26, 0.05)' }}
              onPress={logout}
              activeOpacity={0.7}
            >
              <View className="p-3 rounded-full" style={{ backgroundColor: '#ffdad6' }}>
                <MaterialIcons name="logout" size={22} color="#93000a" />
              </View>
              <View className="ml-4">
                <Text className="font-headline-bold text-on-surface text-base">Sair da Conta</Text>
                <Text className="text-sm font-body text-on-surface-variant">Desconectar</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
