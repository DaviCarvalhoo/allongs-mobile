import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ONGHomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<any>(null);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        api.get('/donations/ong-stats'),
        api.get('/campaigns/my'),
      ]);
      setStats(statsRes.data);
      setMyCampaigns(campaignsRes.data);
    } catch (err) {
      console.error('Failed to fetch ONG data', err);
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

  const handleDeleteCampaign = (id: number, title: string) => {
    Alert.alert(
      'Excluir Campanha',
      `Tem certeza que deseja excluir a campanha "${title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/campaigns/${id}`);
              setMyCampaigns((prev: any) => prev.filter((c: any) => c.id !== id));
              // Também atualiza os stats para refletir a remoção
              fetchData();
              Alert.alert('Sucesso', 'Campanha excluída com sucesso.');
            } catch (err: any) {
              console.error('Failed to delete campaign', err);
              Alert.alert('Erro', 'Não foi possível excluir a campanha.');
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>

        {/* Hero Gradient Card */}
        <View className="mb-10">
          <View className="rounded-2xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={['#0f5238', '#2d6a4f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-8 relative"
            >
              <View className="z-10">
                <Text className="text-3xl font-headline-bold text-white mb-2 tracking-tight">
                  {getGreeting()}
                </Text>
                <Text className="mb-8" style={{ color: 'rgba(168, 231, 197, 0.8)', maxWidth: 280 }}>
                  Sua causa está alcançando novos horizontes hoje. Veja como está o progresso das suas campanhas.
                </Text>
                <TouchableOpacity
                  className="bg-surface-container-lowest flex-row items-center px-6 py-4 rounded-full shadow-lg self-start"
                  onPress={() => navigation.navigate('NewCampaign')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="add-circle" size={20} color="#0f5238" />
                  <Text className="text-primary font-headline-bold ml-2">Criar Nova Campanha</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 4 Stats Cards */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-6 mb-10" />
        ) : stats && (
          <View className="mb-10">
            <View className="flex-row gap-3 mb-3">
              {/* Arrecadado */}
              <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl" style={{ borderBottomWidth: 4, borderBottomColor: '#0f5238' }}>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="p-2.5 bg-primary-fixed rounded-xl">
                    <MaterialIcons name="volunteer-activism" size={20} color="#0f5238" />
                  </View>
                  <Text className="font-semibold text-on-surface-variant text-sm">Arrecadado</Text>
                </View>
                <Text className="text-2xl font-headline-bold text-on-surface">{formatCurrency(stats.total_raised)}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <MaterialIcons name="trending-up" size={12} color="#16a34a" />
                  <Text className="text-xs font-medium" style={{ color: '#16a34a' }}>+12.4% este mês</Text>
                </View>
              </View>

              {/* Doadores */}
              <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl" style={{ borderBottomWidth: 4, borderBottomColor: '#2b6485' }}>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="p-2.5 rounded-xl" style={{ backgroundColor: '#c7e7ff' }}>
                    <MaterialIcons name="group" size={20} color="#2b6485" />
                  </View>
                  <Text className="font-semibold text-on-surface-variant text-sm">Doadores</Text>
                </View>
                <Text className="text-2xl font-headline-bold text-on-surface">{stats.active_donors}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <MaterialIcons name="trending-up" size={12} color="#16a34a" />
                  <Text className="text-xs font-medium" style={{ color: '#16a34a' }}>Ativos</Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3">
              {/* Campanhas */}
              <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl" style={{ borderBottomWidth: 4, borderBottomColor: '#5a4400' }}>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="p-2.5 rounded-xl" style={{ backgroundColor: '#ffdf96' }}>
                    <MaterialIcons name="campaign" size={20} color="#5a4400" />
                  </View>
                  <Text className="font-semibold text-on-surface-variant text-sm">Campanhas</Text>
                </View>
                <Text className="text-2xl font-headline-bold text-on-surface">{stats.campaign_count}</Text>
                <Text className="text-xs font-medium text-on-surface-variant mt-1">Ativas</Text>
              </View>

              {/* Alcance */}
              <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl" style={{ borderBottomWidth: 4, borderBottomColor: '#bfc9c1' }}>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="p-2.5 bg-surface-variant rounded-xl">
                    <MaterialIcons name="analytics" size={20} color="#404943" />
                  </View>
                  <Text className="font-semibold text-on-surface-variant text-sm">Alcance</Text>
                </View>
                <Text className="text-2xl font-headline-bold text-on-surface">{stats.social_reach}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <MaterialIcons name="trending-up" size={12} color="#16a34a" />
                  <Text className="text-xs font-medium" style={{ color: '#16a34a' }}>Impacto crescente</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Campaigns Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-6">
            <View>
              <Text className="text-2xl font-headline-bold text-primary">Campanhas em Destaque</Text>
              <Text className="text-on-surface-variant font-body mt-1">Acompanhamento em tempo real do seu impacto</Text>
            </View>
          </View>

          {myCampaigns.length === 0 ? (
            <View className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/20 shadow-sm">
              <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-5">
                <MaterialIcons name="campaign" size={40} color="#0f5238" />
              </View>
              <Text className="text-2xl font-headline-bold text-on-surface mb-2 text-center">Sua primeira campanha</Text>
              <Text className="text-on-surface-variant font-body text-center mb-8 leading-relaxed">
                Crie sua primeira campanha para começar a receber doações da nossa comunidade.
              </Text>
              <TouchableOpacity
                className="bg-primary px-8 py-4 rounded-full shadow-sm flex-row items-center"
                onPress={() => navigation.navigate('NewCampaign')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
                <Text className="text-white font-headline-bold ml-2">Criar Campanha</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-6">
              {myCampaigns.map((campaign: any) => {
                const raised = parseFloat(campaign.raised_amount || 0);
                const goal = parseFloat(campaign.goal_amount || 0);
                const percent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
                
                return (
                  <TouchableOpacity
                    key={campaign.id}
                    className="bg-surface-container-lowest mb-6 rounded-3xl overflow-hidden shadow-md border border-outline-variant/20 relative"
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
                  >
                    {/* Botões de Ação */}
                    <View className="absolute top-4 right-4 z-20 flex-row gap-2">
                      <TouchableOpacity
                        className="bg-black/40 p-2 rounded-full"
                        onPress={() => navigation.navigate('EditCampaign', { campaignId: campaign.id })}
                      >
                        <MaterialIcons name="edit" size={20} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-black/40 p-2 rounded-full"
                        onPress={() => handleDeleteCampaign(campaign.id, campaign.title)}
                      >
                        <MaterialIcons name="delete-outline" size={20} color="#ffdad6" />
                      </TouchableOpacity>
                    </View>

                    {/* Imagem de Capa */}
                    <View className="w-full h-48 bg-surface-container-high relative">
                      {campaign.image_url ? (
                        <Image
                          source={{ uri: campaign.image_url }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full bg-primary-container items-center justify-center">
                          <MaterialIcons name="image" size={48} color="#a8e7c5" />
                        </View>
                      )}
                      
                      {campaign.is_urgent && (
                        <View className="absolute top-4 left-4 bg-error px-3 py-1.5 rounded-full flex-row items-center z-10">
                          <MaterialIcons name="warning" size={12} color="#fff" />
                          <Text className="text-white text-xs font-bold ml-1 uppercase">Urgente</Text>
                        </View>
                      )}
                    </View>

                    {/* Conteúdo */}
                    <View className="p-5">
                      <View className="flex-row items-center gap-2 mb-3">
                        <View className="px-3 py-1 bg-primary-fixed rounded-full">
                          <Text className="text-[10px] font-bold uppercase tracking-wide text-on-primary-fixed">
                            {campaign.category || 'Categoria'}
                          </Text>
                        </View>
                        {percent >= 100 && (
                          <View className="px-3 py-1 bg-[#dcfce7] rounded-full">
                            <Text className="text-[10px] font-bold uppercase tracking-wide text-[#166534]">
                              Meta Atingida
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text className="text-xl font-headline-bold text-on-surface leading-tight mb-2" numberOfLines={2}>
                        {campaign.title}
                      </Text>

                      <Text className="text-sm font-body text-on-surface-variant mb-6" numberOfLines={2}>
                        {campaign.description || 'Sem descrição.'}
                      </Text>

                      {/* Progresso */}
                      <View>
                        <View className="flex-row justify-between items-end mb-2">
                          <Text className="text-sm font-bold text-primary">
                            {formatCurrency(raised)}
                          </Text>
                          <Text className="text-xs font-medium text-on-surface-variant">
                            de {formatCurrency(goal)}
                          </Text>
                        </View>
                        
                        <View className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <View
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </View>
                        
                        <View className="flex-row justify-between mt-2">
                          <Text className="text-xs font-bold text-on-surface-variant">
                            {percent.toFixed(0)}% alcançado
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
