import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';
import ProgressBar from '../../components/ProgressBar';

export default function CampaignDetailScreen({ route, navigation }: any) {
  const { id } = route.params || {};
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/campaigns/${id}`)
        .then(res => setCampaign(res.data))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color="#0f5238" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <Text>Campanha não encontrada.</Text>
      </View>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1 pb-24">
        {/* Header Image */}
        <View className="relative h-64 w-full bg-surface-container">
          {campaign.image_url ? (
            <Image source={{ uri: campaign.image_url }} className="w-full h-full" resizeMode="cover" />
          ) : (
             <View className="flex-1 items-center justify-center bg-primary-container">
                <MaterialIcons name="image" size={40} color="#a8e7c5" />
             </View>
          )}
          
          <TouchableOpacity 
            className="absolute top-12 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute top-12 right-4 bg-white/90 px-3 py-1 rounded-full">
            <Text className="text-primary font-bold text-xs">{campaign.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-6 bg-surface rounded-t-[30px] -mt-6">
          <Text className="text-2xl font-headline font-bold text-on-surface mb-2">{campaign.title}</Text>
          
          <TouchableOpacity 
            className="flex-row items-center mb-6"
            onPress={() => navigation.navigate('NGODetail', { id: campaign.ong_id })}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 overflow-hidden bg-primary-container">
              {campaign.ong_avatar ? (
                <Image source={{ uri: campaign.ong_avatar }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <MaterialIcons name="business" size={20} color="#a8e7c5" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-on-surface font-bold">{campaign.ong_name || campaign.org_name}</Text>
              <Text className="text-on-surface-variant text-xs">ONG Verificada ✓</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#707973" />
          </TouchableOpacity>

          {/* Progress */}
          <View className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-low mb-6">
            <ProgressBar percentage={campaign.percentage_complete} />
            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="text-primary font-bold text-xl">{formatCurrency(campaign.raised_amount)}</Text>
                <Text className="text-on-surface-variant text-xs">arrecadados</Text>
              </View>
              <View className="items-end">
                <Text className="text-on-surface font-bold text-lg">{formatCurrency(campaign.goal_amount)}</Text>
                <Text className="text-on-surface-variant text-xs">meta</Text>
              </View>
            </View>
            <View className="flex-row items-center mt-4">
              <MaterialIcons name="people" size={16} color="#707973" />
              <Text className="text-on-surface-variant text-sm ml-2">
                <Text className="font-bold">{campaign.donor_count}</Text> doadores já apoiaram
              </Text>
            </View>
          </View>

          {/* About */}
          <Text className="text-xl font-headline font-bold text-on-surface mb-3">Sobre a Campanha</Text>
          <Text className="text-on-surface-variant text-base leading-6 mb-6">
            {campaign.description}
          </Text>
          
        </View>
      </ScrollView>

      {/* Floating Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface p-4 border-t border-surface-container-low">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full items-center"
          onPress={() => navigation.navigate('MakeDonation', { campaign })}
        >
          <Text className="text-white font-bold text-lg">Apoiar Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
