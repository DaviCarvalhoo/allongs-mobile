import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function DonorHomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<any[]>([]);
  const [urgent, setUrgent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [featuredRes, urgentRes] = await Promise.all([
        api.get('/campaigns/featured'),
        api.get('/campaigns/urgent'),
      ]);
      setFeatured(featuredRes.data);
      setUrgent(urgentRes.data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const getFirstName = (fullName: string) => {
    return fullName ? fullName.split(' ')[0] : 'Usuário';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const heroCampaign = featured.length > 0 ? featured[0] : null;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>

        {/* Search Bar */}
        <View className="mb-12 mt-4">
          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <MaterialIcons name="search" size={24} color="#707973" />
            </View>
            <TextInput
              className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-xl font-body text-base text-on-surface"
              placeholder="Procure uma causa ou santuário..."
              placeholderTextColor="#707973"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : (
          <>
            {/* Featured Sanctuary - Hero Float Asymmetric Layout */}
            {heroCampaign && (
              <View className="mb-16">
                <View className="flex-col gap-6">
                  {/* Image Part */}
                  <View className="w-full relative">
                    <View className="absolute -top-4 -left-4 w-24 h-24 bg-tertiary-fixed rounded-full opacity-40 blur-2xl z-0" />
                    <View className="w-full h-[300px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-xl overflow-hidden z-10 bg-surface-container">
                      {heroCampaign.image_url ? (
                        <Image
                          source={{ uri: heroCampaign.image_url }}
                          className="w-full h-full absolute"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full absolute bg-primary-container items-center justify-center">
                          <MaterialIcons name="image" size={48} color="#a8e7c5" />
                        </View>
                      )}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        className="absolute inset-0"
                      />
                      <View className="absolute bottom-6 left-6 bg-surface/80 px-4 py-3 rounded-xl border border-white/20">
                         <Text className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                           Santuário em Destaque
                         </Text>
                         <Text className="text-xl font-headline-extrabold text-on-surface">
                           {heroCampaign.title}
                         </Text>
                      </View>
                    </View>
                  </View>

                  {/* Text Part */}
                  <View className="w-full">
                    <Text className="text-3xl font-headline-bold leading-tight text-primary mb-4">
                      Crie santuários para aqueles que não podem falar.
                    </Text>
                    <Text className="text-on-surface-variant font-body text-base leading-relaxed mb-6">
                      {heroCampaign.description}
                    </Text>
                    <View className="flex-row gap-3">
                      <View className="px-4 py-2 bg-primary-fixed rounded-full">
                        <Text className="text-on-primary-fixed-variant text-sm font-bold">#BemEstarAnimal</Text>
                      </View>
                      <View className="px-4 py-2 bg-secondary-fixed rounded-full">
                        <Text className="text-on-secondary-fixed-variant text-sm font-bold">#Conservação</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      className="mt-6 border-2 border-primary rounded-full py-3 items-center"
                      onPress={() => navigation.navigate('CampaignDetail', { id: heroCampaign.id })}
                    >
                      <Text className="text-primary font-headline-bold text-base">Ver Detalhes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Urgent Campaigns - Bento Grid Style */}
            {urgent.length > 0 && (
              <View className="mb-10">
                <View className="flex-row justify-between items-end mb-6">
                  <View className="flex-1">
                    <Text className="text-2xl font-headline-extrabold tracking-tight text-on-surface">
                      Campanhas urgentes
                    </Text>
                    <Text className="text-on-surface-variant font-body mt-1">
                      Precisamos de apoio imediato para missões críticas.
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                    <Text className="text-primary font-bold">Ver todas</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-col gap-6">
                  {/* Main Urgent Card */}
                  {urgent[0] && (
                    <TouchableOpacity
                      className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm min-h-[400px] relative p-6 justify-between"
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('CampaignDetail', { id: urgent[0].id })}
                    >
                      <View className="absolute top-0 right-0 w-3/4 h-full opacity-30 z-0">
                         {urgent[0].image_url ? (
                          <Image
                            source={{ uri: urgent[0].image_url }}
                            className="w-full h-full object-cover"
                          />
                         ) : (
                          <View className="w-full h-full bg-primary-container items-center justify-center">
                            <MaterialIcons name="image" size={48} color="#a8e7c5" />
                          </View>
                         )}
                        <LinearGradient colors={['#f3f4f5', 'transparent', '#f3f4f5']} className="absolute inset-0 opacity-50" />
                        <LinearGradient colors={['#f3f4f5', 'transparent']} start={{x:0, y:0}} end={{x:1, y:0}} className="absolute inset-0" />
                      </View>

                      <View className="z-10 flex-1">
                        <View className="bg-error px-3 py-1 rounded-full self-start mb-6">
                          <Text className="text-white text-xs font-bold tracking-widest">URGENTE</Text>
                        </View>
                        
                        <Text className="text-3xl font-headline-bold text-primary mb-4 leading-tight">
                          {urgent[0].title}
                        </Text>
                        <Text className="text-on-surface-variant text-base leading-relaxed mb-6" numberOfLines={3}>
                          {urgent[0].description}
                        </Text>
                      </View>

                      <View className="z-10 mt-auto">
                        <View className="flex-row justify-between mb-2">
                          <Text className="text-sm font-bold text-on-surface">
                            {formatCurrency(parseFloat(urgent[0].raised_amount))} arrecadados
                          </Text>
                          <Text className="text-sm font-bold text-on-surface">{urgent[0].percentage_complete}%</Text>
                        </View>
                        <View className="w-full h-3 bg-surface-variant rounded-full overflow-hidden mb-6">
                          <View
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${Math.min(urgent[0].percentage_complete || 0, 100)}%` }}
                          />
                        </View>
                        
                        <TouchableOpacity
                          className="bg-primary py-4 rounded-full items-center shadow-lg"
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('MakeDonation', { campaign: urgent[0] });
                          }}
                        >
                          <Text className="text-white font-headline-bold text-lg">Doar Agora</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Secondary Urgent Cards */}
                  {urgent.length > 1 && (
                    <View className="flex-col gap-4">
                      {urgent.slice(1, 3).map((campaign: any, idx: number) => {
                        const isFirst = idx === 0;
                        const bgColor = isFirst ? 'bg-surface-container-highest' : 'bg-surface-container';
                        const tagColorClass = isFirst ? 'text-secondary' : 'text-tertiary-container';

                        return (
                          <TouchableOpacity
                            key={campaign.id}
                            className={`${bgColor} rounded-2xl p-6 flex-col justify-between`}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
                          >
                            <View>
                              <Text className={`${tagColorClass} font-bold text-xs mb-2 uppercase`}>
                                {campaign.category}
                              </Text>
                              <Text className="font-headline-bold text-xl text-on-surface mb-2 leading-tight">
                                {campaign.title}
                              </Text>
                              <Text className="text-on-surface-variant text-sm" numberOfLines={2}>
                                {campaign.description}
                              </Text>
                            </View>
                            
                            <View className="mt-6 pt-4 border-t border-outline-variant/20 flex-row justify-between items-center">
                              <Text className="font-bold text-primary text-sm">
                                {formatCurrency(parseFloat(campaign.raised_amount))} arrecadados
                              </Text>
                              <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center">
                                <MaterialIcons name="arrow-forward" size={16} color="#a8e7c5" />
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
