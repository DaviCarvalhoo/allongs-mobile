import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        
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
                  Seu Histórico.
                </Text>
                <Text className="text-base mb-2" style={{ color: 'rgba(168, 231, 197, 0.8)' }}>
                  Você apoiou {stats?.campaigns_supported || 0} iniciativas únicas.
                </Text>
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
            {/* Stats Card — only real data */}
            <View className="bg-surface-container-low rounded-2xl p-6 justify-between mb-12" style={{ minHeight: 140 }}>
              <View>
                <Text className="text-primary font-bold text-xs tracking-widest uppercase mb-2">Total de Doações</Text>
                <Text className="text-4xl font-headline-extrabold text-on-surface">
                  {stats ? formatCurrency(stats.total_donated) : 'R$ 0,00'}
                </Text>
                <Text className="text-on-surface-variant text-sm mt-2">
                  {stats?.donation_count || 0} doações realizadas
                </Text>
              </View>
            </View>

            {/* Timeline Header */}
            <View className="flex-row items-center gap-3 mb-8">
              <MaterialIcons name="history" size={24} color="#0f5238" />
              <Text className="text-2xl font-headline-bold text-on-surface">Histórico de Doações</Text>
            </View>

            {/* Timeline */}
            {donations.length === 0 ? (
              <View className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/10">
                <Text className="text-4xl mb-4">🙌</Text>
                <Text className="text-on-surface font-headline-bold text-lg mb-2">Nenhuma doação ainda</Text>
                <Text className="text-on-surface-variant font-body text-center">Quando você apoiar uma causa, ela aparecerá aqui.</Text>
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
                        borderColor: index === 0 ? '#0f5238' : '#bfc9c1',
                      }}
                    >
                      <MaterialIcons name="circle" size={8} color={index === 0 ? '#0f5238' : '#bfc9c1'} />
                    </View>

                    {/* Card */}
                    <View className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
                      {/* Date + Amount */}
                      <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 mr-3">
                          <Text className="text-xs font-bold tracking-widest uppercase" style={{ color: index === 0 ? '#0f5238' : '#404943' }}>
                            {formatDate(donation.created_at)}
                          </Text>
                          <Text className="text-lg font-headline-bold text-on-surface mt-1" numberOfLines={2}>
                            {donation.campaign_title || 'Doação'}
                          </Text>
                        </View>
                        <Text className="text-xl font-headline-extrabold" style={{ color: index === 0 ? '#0f5238' : '#191c1d' }}>
                          {formatCurrency(parseFloat(donation.amount))}
                        </Text>
                      </View>

                      {/* Transaction */}
                      <View className="flex-row items-center py-3 border-t" style={{ borderTopColor: 'rgba(191,201,193,0.1)' }}>
                        <MaterialIcons name="receipt-long" size={16} color="#707973" />
                        <Text className="text-sm text-on-surface-variant ml-2">{donation.transaction_id}</Text>
                      </View>

                      {/* Impact */}
                      {donation.impact_text && (
                        <View className="mt-2 bg-[#b1f0ce]/30 px-3 py-2 rounded-full self-start">
                          <Text className="text-[10px] font-bold uppercase tracking-tight" style={{ color: '#0e5138' }}>
                            Impacto: {donation.impact_text}
                          </Text>
                        </View>
                      )}
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
