import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';
import CampaignCard from '../../components/CampaignCard';
import SearchBar from '../../components/SearchBar';

export default function ExploreScreen({ navigation }: any) {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'Meio Ambiente', icon: 'eco' },
    { id: 'Causa Animal', icon: 'pets' },
    { id: 'Social', icon: 'people' },
    { id: 'Saúde', icon: 'medical-services' },
    { id: 'Educação', icon: 'school' },
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

  return (
    <View className="flex-1 bg-surface">
      <View className="px-4 pt-12 pb-4 bg-surface border-b border-surface-container-low">
        <Text className="text-3xl font-headline font-bold text-primary mb-4">Explorar</Text>
        <SearchBar value={search} onChangeText={setSearch} />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
              selectedCategory === null ? 'bg-primary border-primary' : 'bg-surface border-surface-variant'
            }`}
            onPress={() => setSelectedCategory(null)}
          >
            <Text className={`font-bold ${selectedCategory === null ? 'text-white' : 'text-on-surface-variant'}`}>
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
              <Text className={`ml-2 font-bold ${selectedCategory === cat.id ? 'text-white' : 'text-on-surface-variant'}`}>
                {cat.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : campaigns.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <MaterialIcons name="search-off" size={48} color="#707973" />
            <Text className="text-on-surface-variant mt-4 text-lg">Nenhuma campanha encontrada.</Text>
          </View>
        ) : (
          campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign.id}
              title={campaign.title}
              category={campaign.category}
              ongName={campaign.ong_name}
              raisedAmount={parseFloat(campaign.raised_amount)}
              goalAmount={parseFloat(campaign.goal_amount)}
              percentageComplete={campaign.percentage_complete}
              donorCount={campaign.donor_count}
              imageUrl={campaign.image_url}
              isUrgent={campaign.is_urgent}
              onPress={() => navigation.navigate('CampaignDetail', { id: campaign.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
