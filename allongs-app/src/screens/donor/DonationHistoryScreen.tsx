import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function DonationHistoryScreen({ navigation }: any) {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([
          api.get('/donations/history'),
          api.get('/donations/stats')
        ]);
        setDonations(histRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70 absolute top-0 w-full border-b border-surface-container-low/50">
        <Text className="text-2xl font-headline-bold tracking-tight text-on-surface">Histórico</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 48, alignItems: 'center' }}>
        <View className="w-full max-w-md">
          
          <View className="mb-8">
            <Text className="text-3xl font-headline-extrabold text-primary mb-2">Seu Impacto</Text>
            <Text className="text-on-surface-variant font-body">Acompanhe as vidas que você ajudou a transformar.</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
          ) : (
            <>
              {stats && (
                <View className="flex-row gap-4 mb-10">
                  <View className="bg-surface-container-lowest p-6 rounded-2xl flex-1 shadow-sm border border-outline-variant/10">
                    <Text className="text-2xl mb-2">💖</Text>
                    <Text className="text-primary font-headline-bold text-2xl">{formatCurrency(stats.total_donated)}</Text>
                    <Text className="text-on-surface-variant text-xs font-label uppercase tracking-widest mt-1">Total Doado</Text>
                  </View>
                  <View className="bg-surface-container-lowest p-6 rounded-2xl flex-1 shadow-sm border border-outline-variant/10">
                    <Text className="text-2xl mb-2">🌱</Text>
                    <Text className="text-secondary font-headline-bold text-2xl">{stats.campaigns_supported}</Text>
                    <Text className="text-on-surface-variant text-xs font-label uppercase tracking-widest mt-1">Campanhas</Text>
                  </View>
                </View>
              )}

              <Text className="text-xl font-headline-bold text-on-surface mb-6">Doações Anteriores</Text>

              <View className="pl-4 border-l-2 border-surface-container-high ml-2 mb-8">
                {donations.map((donation: any) => (
                  <View key={donation.id} className="relative mb-8">
                    <View className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                    <View className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-on-surface-variant font-label text-xs uppercase tracking-widest">{formatDate(donation.created_at)}</Text>
                        <Text className="text-primary font-headline-bold">{formatCurrency(parseFloat(donation.amount))}</Text>
                      </View>
                      <Text className="font-headline-bold text-lg text-on-surface mb-1">{donation.campaign_title}</Text>
                      <Text className="text-on-surface-variant font-body text-xs mb-4">
                        Transação: {donation.transaction_id}
                      </Text>
                      <View className="bg-primary/10 p-3 rounded-xl flex-row items-center">
                        <Text className="text-sm mr-2">⭐</Text>
                        <Text className="text-primary font-body text-sm flex-1">
                          {donation.impact_text}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                {donations.length === 0 && (
                  <View className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 items-center">
                    <Text className="text-4xl mb-4">🙌</Text>
                    <Text className="text-on-surface font-headline-bold text-lg mb-2">Nenhuma doação ainda</Text>
                    <Text className="text-on-surface-variant font-body text-center">Quando você apoiar uma causa, ela aparecerá aqui.</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
