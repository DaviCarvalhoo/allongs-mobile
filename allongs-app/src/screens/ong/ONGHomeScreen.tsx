import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-surface">
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
              {myCampaigns.map((campaign: any) => (
                <TouchableOpacity
                  key={campaign.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
                >
                  <View className="flex-row">
                    {/* Image */}
                    <View className="w-2/5 min-h-[160px]">
                      {campaign.image_url ? (
                        <Image
                          source={{ uri: campaign.image_url }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full bg-primary-container items-center justify-center">
                          <MaterialIcons name="image" size={32} color="#a8e7c5" />
                        </View>
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 p-5 justify-between">
                      <View>
                        <View className="flex-row justify-between items-start mb-2">
                          <View className="px-2.5 py-1 bg-primary-fixed rounded-full">
                            <Text className="text-[10px] font-bold uppercase" style={{ color: '#0e5138' }}>
                              {campaign.category}
                            </Text>
                          </View>
                          <Text className="text-xs text-on-surface-variant">
                            {campaign.percentage_complete}%
                          </Text>
                        </View>
                        <Text className="text-base font-headline-bold text-on-surface leading-tight mb-2" numberOfLines={2}>
                          {campaign.title}
                        </Text>
                      </View>

                      <View>
                        <View className="w-full h-2 bg-surface-container-high rounded-full mb-2">
                          <View
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${Math.min(campaign.percentage_complete || 0, 100)}%` }}
                          />
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-xs font-bold text-on-surface">
                            {formatCurrency(parseFloat(campaign.raised_amount))}
                          </Text>
                          <Text className="text-xs font-bold text-primary">
                            {formatCurrency(parseFloat(campaign.goal_amount))}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
