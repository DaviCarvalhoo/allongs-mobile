import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';

export default function ExploreScreen({ navigation }: any) {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'Meio Ambiente', icon: 'eco' as const },
    { id: 'Causa Animal', icon: 'pets' as const },
    { id: 'Social', icon: 'people' as const },
    { id: 'Saúde', icon: 'medical-services' as const },
    { id: 'Educação', icon: 'school' as const },
  ];

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const res = await api.get('/campaigns', { params });
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [search, selectedCategory]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Meio Ambiente':
        return { bg: 'bg-[#b1f0ce]', text: { color: '#0e5138' } };
      case 'Causa Animal':
        return { bg: 'bg-[#a3d8fe]', text: { color: '#255f80' } };
      case 'Social':
        return { bg: 'bg-[#ffdf96]', text: { color: '#251a00' } };
      case 'Saúde':
        return { bg: 'bg-[#ffdf96]', text: { color: '#251a00' } };
      case 'Educação':
        return { bg: 'bg-[#95d4b3]', text: { color: '#0e5138' } };
      default:
        return { bg: 'bg-[#e7e8e9]', text: { color: '#404943' } };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>

        {/* Search Bar */}
        <View className="mb-6 mt-2">
          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <MaterialIcons name="search" size={24} color="#707973" />
            </View>
            <TextInput
              className="w-full pl-14 pr-12 py-5 bg-surface-container-high rounded-xl font-body text-base text-on-surface"
              placeholder="Procure uma causa ou ONG..."
              placeholderTextColor="#707973"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity
                className="absolute right-4 top-4 z-10"
                onPress={() => setSearch('')}
              >
                <MaterialIcons name="close" size={24} color="#707973" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
              selectedCategory === null ? 'bg-primary border-primary' : 'bg-surface border-surface-variant'
            }`}
            onPress={() => setSelectedCategory(null)}
          >
            <Text className={`font-bold text-sm ${selectedCategory === null ? 'text-white' : 'text-on-surface-variant'}`}>
              Todas
            </Text>
          </TouchableOpacity>
          
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
                selectedCategory === cat.id ? 'bg-primary border-primary' : 'bg-surface border-surface-variant'
              }`}
              onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            >
              <MaterialIcons 
                name={cat.icon as any} 
                size={16} 
                color={selectedCategory === cat.id ? 'white' : '#707973'} 
              />
              <Text className={`ml-2 font-bold text-sm ${selectedCategory === cat.id ? 'text-white' : 'text-on-surface-variant'}`}>
                {cat.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-on-surface-variant font-body text-sm">
            Mostrando <Text className="text-primary font-bold">{campaigns.length}</Text> campanhas
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : campaigns.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <MaterialIcons name="search-off" size={48} color="#707973" />
            <Text className="text-on-surface-variant mt-4 text-lg font-body">Nenhuma campanha encontrada.</Text>
            <Text className="text-on-surface-variant/60 text-sm mt-1 font-body">Tente buscar por outra causa ou ONG</Text>
          </View>
        ) : (
          <View className="gap-6">
            {/* Featured Card (first campaign) */}
            {campaigns.length > 0 && (
              <TouchableOpacity
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm"
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CampaignDetail', { id: (campaigns[0] as any).id })}
              >
                <View className="w-full h-[220px] bg-primary-container">
                  {(campaigns[0] as any).image_url ? (
                    <Image
                      source={{ uri: (campaigns[0] as any).image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <MaterialIcons name="image" size={48} color="#a8e7c5" />
                    </View>
                  )}
                  <View className="absolute top-3 left-3">
                    <View className={`px-3 py-1 rounded-full ${getCategoryBadgeStyle((campaigns[0] as any).category).bg}`}>
                      <Text className="text-[10px] font-bold uppercase tracking-widest" style={getCategoryBadgeStyle((campaigns[0] as any).category).text}>
                        {(campaigns[0] as any).category}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="p-5">
                  <View className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="verified" size={14} color="#5a4400" />
                    <Text className="text-xs font-bold uppercase tracking-widest" style={{ color: '#775b06' }}>Instituição verificada</Text>
                  </View>
                  <Text className="text-xl font-headline-bold text-on-surface mb-2 leading-tight">
                    {(campaigns[0] as any).title}
                  </Text>
                  <Text className="text-on-surface-variant text-sm font-body leading-relaxed mb-4" numberOfLines={2}>
                    {(campaigns[0] as any).description}
                  </Text>

                  {/* Progress */}
                  <View className="mb-4">
                    <View className="flex-row justify-between items-end mb-2">
                      <Text className="text-xs font-bold text-on-surface-variant">Meta de arrecadação</Text>
                      <Text className="text-sm font-bold text-primary">
                        {formatCurrency(parseFloat((campaigns[0] as any).raised_amount))} / {formatCurrency(parseFloat((campaigns[0] as any).goal_amount))}
                      </Text>
                    </View>
                    <View className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min((campaigns[0] as any).percentage_complete || 0, 100)}%` }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-primary py-3 px-8 rounded-full self-start"
                    onPress={() => navigation.navigate('CampaignDetail', { id: (campaigns[0] as any).id })}
                  >
                    <Text className="text-white font-headline-bold text-sm">Apoiar Missão</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}

            {/* Grid Cards */}
            {campaigns.slice(1).map((campaign: any) => {
              const badgeStyle = getCategoryBadgeStyle(campaign.category);
              return (
                <TouchableOpacity
                  key={campaign.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden"
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
                >
                  <View className="w-full h-[180px] bg-primary-container">
                    {campaign.image_url ? (
                      <Image
                        source={{ uri: campaign.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <MaterialIcons name="image" size={40} color="#a8e7c5" />
                      </View>
                    )}
                  </View>
                  <View className="p-5">
                    <View className="flex-row items-center gap-2 mb-3">
                      <View className={`px-3 py-1 rounded-full ${badgeStyle.bg}`}>
                        <Text className="text-[10px] font-bold" style={badgeStyle.text}>
                          {campaign.category}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-headline-bold text-lg text-on-surface mb-2 leading-tight">
                      {campaign.title}
                    </Text>
                    <Text className="text-sm text-on-surface-variant font-body mb-4" numberOfLines={2}>
                      {campaign.description}
                    </Text>
                    <View className="flex-row items-center justify-between pt-4 border-t" style={{ borderTopColor: 'rgba(191,201,193,0.1)' }}>
                      <Text className="font-bold text-primary text-sm">
                        {campaign.percentage_complete}% concluído
                      </Text>
                      <Text className="text-primary font-bold text-sm">
                        Ver detalhes
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
