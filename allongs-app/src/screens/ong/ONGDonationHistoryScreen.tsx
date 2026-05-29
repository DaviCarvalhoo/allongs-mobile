import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function ONGDonationHistoryScreen() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [topCampaign, setTopCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [donationsRes, statsRes, campaignsRes] = await Promise.all([
        api.get('/donations/received'),
        api.get('/donations/ong-stats'),
        api.get('/campaigns/my'),
      ]);
      setDonations(donationsRes.data);
      setStats(statsRes.data);

      // Find top campaign by raised_amount
      const campaigns = campaignsRes.data;
      if (campaigns.length > 0) {
        const top = campaigns.reduce((a: any, b: any) =>
          parseFloat(a.raised_amount) > parseFloat(b.raised_amount) ? a : b
        );
        setTopCampaign(top);
      }
    } catch (err) {
      console.error('Failed to fetch ONG donation history', err);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>

        {/* Hero Impact Summary */}
        <View className="mb-10">
          <View className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={['#0f5238', '#2d6a4f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-8 relative"
            >
              <View className="z-10">
                <Text className="text-4xl font-headline-extrabold text-white mb-2 tracking-tight">
                  Doações Recebidas.
                </Text>
                <Text className="text-base mb-6" style={{ color: 'rgba(168, 231, 197, 0.8)' }}>
                  {stats
                    ? `Sua ONG recebeu ${stats.donation_count} doações de ${stats.active_donors} apoiadores.`
                    : 'Carregando dados...'}
                </Text>

                {/* Mini stats */}
                <View className="flex-row gap-4">
                  <View className="flex-1 p-4 rounded-xl items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Text className="text-2xl font-headline-bold text-white">{stats?.donation_count || 0}</Text>
                    <Text className="text-[10px] uppercase tracking-widest text-white/80 mt-1">Doações</Text>
                  </View>
                  <View className="flex-1 p-4 rounded-xl items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Text className="text-2xl font-headline-bold text-white">{stats?.campaign_count || 0}</Text>
                    <Text className="text-[10px] uppercase tracking-widest text-white/80 mt-1">Campanhas</Text>
                  </View>
                </View>
              </View>

              {/* Decorative blurs */}
              <View className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <View className="absolute top-0 left-1/4 w-32 h-32 rounded-full" style={{ backgroundColor: 'rgba(177,240,206,0.1)' }} />
            </LinearGradient>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : (
          <>
            {/* Bento Stats */}
            <View className="flex-row gap-4 mb-12">
              {/* Total Arrecadado */}
              <View className="flex-[2] bg-surface-container-low rounded-2xl p-6 justify-between" style={{ minHeight: 180 }}>
                <View>
                  <Text className="text-primary font-bold text-xs tracking-widest uppercase mb-2">Total Arrecadado</Text>
                  <Text className="text-3xl font-headline-extrabold text-on-surface">
                    {stats ? formatCurrency(stats.total_raised) : 'R$ 0,00'}
                  </Text>
                </View>
              </View>

              {/* Campanha Top */}
              {topCampaign && (
                <View className="flex-1 rounded-2xl p-5 items-center justify-center" style={{ backgroundColor: 'rgba(163, 216, 254, 0.3)', minHeight: 180 }}>
                  <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center mb-3">
                    <MaterialIcons name="trending-up" size={24} color="#fff" />
                  </View>
                  <Text className="font-headline-bold text-sm text-center" style={{ color: '#255f80' }}>Campanha Top</Text>
                  <Text className="text-xs text-center mt-1" style={{ color: 'rgba(37,95,128,0.7)' }} numberOfLines={2}>
                    {topCampaign.title}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <Text className="text-xs font-bold" style={{ color: '#255f80' }}>
                      {formatCurrency(parseFloat(topCampaign.raised_amount))}
                    </Text>
                  </View>
                  <View className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: '#e7e8e9' }}>
                    <View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: '#2b6485',
                        width: `${Math.min(topCampaign.percentage_complete || 0, 100)}%`,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Timeline Header */}
            <View className="flex-row items-center gap-3 mb-8">
              <MaterialIcons name="history" size={24} color="#0f5238" />
              <Text className="text-2xl font-headline-bold text-on-surface">Histórico de Doações</Text>
            </View>

            {/* Timeline */}
            {donations.length === 0 ? (
              <View className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/10">
                <Text className="text-4xl mb-4">💰</Text>
                <Text className="text-on-surface font-headline-bold text-lg mb-2">Nenhuma doação recebida</Text>
                <Text className="text-on-surface-variant font-body text-center">
                  Quando doadores apoiarem suas campanhas, as doações aparecerão aqui.
                </Text>
              </View>
            ) : (
              <View className="mb-8" style={{ paddingLeft: 20 }}>
                {/* Vertical line */}
                <View className="absolute left-[19px] top-4 bottom-0 w-[1px]" style={{ backgroundColor: 'rgba(191, 201, 193, 0.3)' }} />

                {donations.map((donation: any, index: number) => (
                  <View key={donation.id} className="relative mb-10" style={{ paddingLeft: 28 }}>
                    {/* Timeline dot */}
                    <View
                      className="absolute top-1 w-10 h-10 rounded-full items-center justify-center z-10"
                      style={{
                        left: -20,
                        backgroundColor: '#f8f9fa',
                        borderWidth: 4,
                        borderColor: index < 2 ? '#0f5238' : '#bfc9c1',
                      }}
                    >
                      <MaterialIcons name="circle" size={8} color={index < 2 ? '#0f5238' : '#bfc9c1'} />
                    </View>

                    {/* Card */}
                    <View className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
                      {/* Date + Amount */}
                      <View className="flex-row justify-between items-start mb-3">
                        <View>
                          <Text className="text-xs font-bold tracking-widest uppercase" style={{ color: index < 2 ? '#0f5238' : '#404943' }}>
                            {formatDate(donation.created_at)}
                          </Text>
                          <Text className="text-lg font-headline-bold text-on-surface mt-1">
                            Doação para {donation.campaign_title || 'Campanha'}
                          </Text>
                        </View>
                        <Text className="text-xl font-headline-extrabold" style={{ color: index < 2 ? '#0f5238' : '#191c1d' }}>
                          {formatCurrency(parseFloat(donation.amount))}
                        </Text>
                      </View>

                      {/* Donor info + Transaction */}
                      <View className="flex-row items-center py-3 border-t" style={{ borderTopColor: 'rgba(191,201,193,0.1)' }}>
                        <View className="flex-row items-center flex-1">
                          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: index % 2 === 0 ? '#b1f0ce' : '#c7e7ff' }}>
                            <MaterialIcons name="person" size={14} color={index % 2 === 0 ? '#0f5238' : '#2b6485'} />
                          </View>
                          <Text className="text-sm text-on-surface-variant font-medium ml-2">
                            {donation.donor_name || 'Doador Anônimo'}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="receipt-long" size={16} color="#707973" />
                          <Text className="text-xs text-on-surface-variant">{donation.transaction_id}</Text>
                        </View>
                      </View>

                      {/* Tags */}
                      <View className="flex-row items-center gap-2 mt-3">
                        <View className="px-2 py-0.5 bg-primary-fixed rounded-full">
                          <Text className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: '#0e5138' }}>
                            {donation.campaign_title ? `Campanha: ${donation.campaign_category || 'Geral'}` : 'Doação Geral'}
                          </Text>
                        </View>
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: donation.payment_method === 'pix' ? '#ffdf96' : '#c7e7ff' }}>
                          <Text className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: donation.payment_method === 'pix' ? '#251a00' : '#001e2e' }}>
                            {donation.payment_method === 'pix' ? 'PIX' : donation.payment_method === 'cartao' ? 'Cartão' : donation.payment_method?.toUpperCase() || 'PIX'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
