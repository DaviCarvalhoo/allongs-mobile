import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import ProgressBar from '../../components/ProgressBar';

export default function NGODetailScreen({ route, navigation }: any) {
  const { id } = route.params || {};
  const [ong, setOng] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/ongs/${id}`)
        .then(res => setOng(res.data))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color="#0f5238" />
      </View>
    );
  }

  if (!ong) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <Text className="text-on-surface-variant font-body">ONG não encontrada.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Hero Section */}
        <View className="relative h-[250px] w-full">
          {ong.avatar_url ? (
            <Image source={{ uri: ong.avatar_url }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-primary-container items-center justify-center">
              <Text className="text-white text-6xl font-headline-bold">
                {ong.org_name?.charAt(0) || 'O'}
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute inset-0"
          />
          <TouchableOpacity 
            className="absolute top-4 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute bottom-6 left-6 right-6">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="verified" size={16} color="#fcd579" />
              <Text className="text-xs font-bold uppercase tracking-widest" style={{ color: '#fcd579' }}>
                Instituição verificada
              </Text>
            </View>
            <Text className="text-3xl font-headline-extrabold text-white tracking-tight">
              {ong.org_name || ong.name}
            </Text>
            <Text className="text-white/70 font-body text-sm mt-1">
              Desde {ong.org_since || '—'}
            </Text>
          </View>
        </View>

        <View className="px-6 pt-6">

          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl shadow-sm" style={{ borderBottomWidth: 4, borderBottomColor: '#0f5238' }}>
              <Text className="text-2xl font-headline-bold text-on-surface">
                {formatCurrency(ong.stats?.total_raised || 0)}
              </Text>
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Arrecadado</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl shadow-sm" style={{ borderBottomWidth: 4, borderBottomColor: '#2b6485' }}>
              <Text className="text-2xl font-headline-bold text-on-surface">{ong.stats?.total_donors || 0}</Text>
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Doadores</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest p-5 rounded-2xl shadow-sm" style={{ borderBottomWidth: 4, borderBottomColor: '#5a4400' }}>
              <Text className="text-2xl font-headline-bold text-on-surface">{ong.stats?.campaign_count || 0}</Text>
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Campanhas</Text>
            </View>
          </View>

          {/* About */}
          <View className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="info" size={22} color="#0f5238" />
              <Text className="font-headline-bold text-lg text-primary">Sobre a Organização</Text>
            </View>
            <Text className="text-on-surface-variant text-sm leading-relaxed font-body">
              {ong.org_description || 'Descrição não disponível.'}
            </Text>
          </View>

          {/* Campaigns */}
          <Text className="text-2xl font-headline-bold text-primary mb-6">
            Campanhas ({ong.campaigns?.length || 0})
          </Text>

          {ong.campaigns && ong.campaigns.length > 0 ? (
            <View className="gap-6">
              {ong.campaigns.map((campaign: any) => (
                <TouchableOpacity
                  key={campaign.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
                >
                  <View className="flex-row">
                    {/* Image */}
                    <View className="w-2/5 min-h-[140px]">
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
                    <View className="flex-1 p-4 justify-between">
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
          ) : (
            <View className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/10">
              <MaterialIcons name="campaign" size={40} color="#707973" />
              <Text className="text-on-surface-variant mt-4 text-lg font-body">Nenhuma campanha ativa</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Donate Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface p-4 border-t border-surface-container-low">
        <TouchableOpacity
          className="bg-primary py-4 rounded-full items-center"
          onPress={() => {
            if (ong.campaigns && ong.campaigns.length > 0) {
              navigation.navigate('MakeDonation', { campaign: ong.campaigns[0] });
            }
          }}
        >
          <Text className="text-white font-headline-bold text-lg">Apoiar esta ONG</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
