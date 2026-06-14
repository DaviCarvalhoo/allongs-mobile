import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
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

  // Espaçamento base horizontal da tela
  const PX = 20;
  // Largura da área da timeline (dot + linha)
  const TIMELINE_LEFT = 40;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ paddingHorizontal: PX, paddingVertical: 16 }} className="flex-row items-center z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Hero Impact Summary */}
        <View style={{ marginHorizontal: PX, marginBottom: 24 }}>
          <View className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={['#0f5238', '#2d6a4f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 28 }}
            >
              <Text className="text-4xl font-headline-extrabold text-white mb-2 tracking-tight">
                Seu Histórico.
              </Text>
              <Text className="text-base" style={{ color: 'rgba(168, 231, 197, 0.8)' }}>
                Você apoiou {stats?.campaigns_supported || 0} iniciativas únicas.
              </Text>
              {/* Decorative blurs */}
              <View className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <View className="absolute top-0 left-1/4 w-32 h-32 rounded-full" style={{ backgroundColor: 'rgba(177,240,206,0.1)' }} />
            </LinearGradient>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Stats Card */}
            <View
              style={{ marginHorizontal: PX, marginBottom: 32, borderRadius: 16, padding: 20, minHeight: 120 }}
              className="bg-surface-container-low"
            >
              <Text className="text-primary font-bold text-xs tracking-widest uppercase mb-2">Total de Doações</Text>
              <Text className="text-4xl font-headline-extrabold text-on-surface">
                {stats ? formatCurrency(stats.total_donated) : 'R$ 0,00'}
              </Text>
              <Text className="text-on-surface-variant text-sm mt-2">
                {stats?.donation_count || 0} doações realizadas
              </Text>
            </View>

            {/* Timeline Header */}
            <View style={{ marginHorizontal: PX, marginBottom: 20 }} className="flex-row items-center gap-3">
              <MaterialIcons name="history" size={24} color="#0f5238" />
              <Text className="text-2xl font-headline-bold text-on-surface">Histórico de Doações</Text>
            </View>

            {/* Timeline */}
            {donations.length === 0 ? (
              <View style={{ marginHorizontal: PX }} className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/10">
                <Text className="text-4xl mb-4">🙌</Text>
                <Text className="text-on-surface font-headline-bold text-lg mb-2">Nenhuma doação ainda</Text>
                <Text className="text-on-surface-variant font-body text-center">Quando você apoiar uma causa, ela aparecerá aqui.</Text>
              </View>
            ) : (
              <View style={{ paddingBottom: 8 }}>
                {/* Linha vertical da timeline */}
                <View
                  style={{
                    position: 'absolute',
                    left: PX + TIMELINE_LEFT / 2 - 1,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'rgba(191, 201, 193, 0.35)',
                  }}
                />

                {(donations as any[]).map((donation: any, index: number) => (
                  <View key={donation.id} style={{ flexDirection: 'row', marginBottom: 16, paddingHorizontal: PX }}>
                    {/* Dot */}
                    <View style={{ width: TIMELINE_LEFT, alignItems: 'center', paddingTop: 18 }}>
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: '#fff',
                          borderWidth: 3,
                          borderColor: index === 0 ? '#0f5238' : '#bfc9c1',
                        }}
                      />
                    </View>

                    {/* Card — ocupa o restante do espaço */}
                    <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                      {/* Accent bar */}
                      <View style={{ height: 3, backgroundColor: index === 0 ? '#0f5238' : '#e8ede9' }} />
                      <View style={{ padding: 14 }}>
                        {/* Data + Valor */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: index === 0 ? '#0f5238' : '#707973' }}>
                              {formatDate(donation.created_at)}
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#191c1d', marginTop: 4 }} numberOfLines={2}>
                              {donation.campaign_title || 'Doação'}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: index === 0 ? '#0f5238' : '#191c1d' }}>
                            {formatCurrency(parseFloat(donation.amount))}
                          </Text>
                        </View>

                        {/* Transação */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(191,201,193,0.2)' }}>
                          <MaterialIcons name="receipt-long" size={13} color="#9ca3af" />
                          <Text style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6, flex: 1 }} numberOfLines={1}>
                            {donation.transaction_id}
                          </Text>
                        </View>

                        {/* Impacto */}
                        {donation.impact_text && (
                          <View style={{ marginTop: 10, backgroundColor: 'rgba(177,240,206,0.3)', borderRadius: 8, padding: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#0e5138', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Impacto: {donation.impact_text}
                            </Text>
                          </View>
                        )}
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
