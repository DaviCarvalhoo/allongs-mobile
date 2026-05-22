import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import CampaignCard from '../../components/CampaignCard';

export default function ONGHomeScreen({ navigation }: any) {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState<any>(null);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, campaignsRes] = await Promise.all([
          api.get('/donations/ong-stats'),
          api.get('/campaigns/my')
        ]);
        setStats(statsRes.data);
        setMyCampaigns(campaignsRes.data);
      } catch (err) {
        console.error('Failed to fetch ONG data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Absolute Header (Glassmorphic) */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70 absolute top-0 w-full">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
        <TouchableOpacity 
          className="flex-row items-center px-3 py-1.5 bg-error/10 rounded-full"
          onPress={logout}
        >
          <Text className="text-error font-label font-bold text-xs mr-1 uppercase">Sair</Text>
          <MaterialIcons name="logout" size={16} color="#ba1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 48 }}>
        
        {/* Welcome Section */}
        <View className="mb-8 mt-2">
          <Text className="text-on-surface-variant font-label font-bold text-sm uppercase tracking-widest mb-1">Painel da Instituição</Text>
          <Text className="text-on-surface text-4xl font-headline-extrabold">{user?.org_name || 'Minha Instituição'}</Text>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View className="flex-col md:flex-row gap-4 mb-10">
            {/* Total Raised Card */}
            <View className="flex-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
              <LinearGradient 
                colors={['transparent', 'rgba(15,82,56,0.05)']}
                className="absolute inset-0"
              />
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-4">
                <MaterialIcons name="account-balance-wallet" size={24} color="#0f5238" />
              </View>
              <Text className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Total Arrecadado</Text>
              <Text className="text-on-surface font-headline-bold text-3xl">{formatCurrency(stats.total_raised)}</Text>
            </View>

            {/* Donors Card */}
            <View className="flex-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
              <LinearGradient 
                colors={['transparent', 'rgba(43,100,133,0.05)']}
                className="absolute inset-0"
              />
              <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center mb-4">
                <MaterialIcons name="favorite" size={24} color="#2b6485" />
              </View>
              <Text className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Doadores Ativos</Text>
              <Text className="text-on-surface font-headline-bold text-3xl">{stats.active_donors}</Text>
            </View>
          </View>
        )}

        {/* Campaigns Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-headline-bold text-on-surface">Minhas Campanhas</Text>
          <TouchableOpacity 
            className="flex-row items-center bg-primary px-4 py-2 rounded-full shadow-sm"
            onPress={() => navigation.navigate('NewCampaign')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text className="text-white font-label font-bold ml-1">Nova</Text>
          </TouchableOpacity>
        </View>

        {/* Campaigns List or Empty State */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : myCampaigns.length === 0 ? (
          <View className="bg-surface-container-lowest p-8 rounded-3xl items-center mt-2 border border-outline-variant/20 shadow-sm relative overflow-hidden">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJWWf6ztzJcjNZJcB2fzSckOatc-hwni4nkNTMwiiCQKmu6Gh9JJlgM-Uc8eBcJ0-9lNYD3fu7S1MD5teXtdd8criPcU48f0U-lbrn8kPh5oqsFgUfBglbyMxoozFuCRi5fjUHm9vEmqLnuG2ynlg0KyDQQxQAecl39N5K1_Hux8WQhzxDKWO9FzhdwK4v8PHk9fY9hBlb-zSDW6TLoLzTwXpKQJ4E_tnDRc9OrEpzYbd9qx4jF853E-ymvDgvmATDRtuI0sJtHw' }}
              className="absolute inset-0 w-full h-full opacity-5"
            />
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-5">
              <MaterialIcons name="campaign" size={40} color="#0f5238" />
            </View>
            <Text className="text-2xl font-headline-bold text-on-surface mb-2 text-center">Sua primeira campanha</Text>
            <Text className="text-on-surface-variant font-body text-center mb-8 leading-relaxed">
              Crie sua primeira campanha para começar a receber doações da nossa comunidade e fazer a diferença no mundo.
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
          <View className="gap-4">
            {myCampaigns.map((campaign: any) => (
              <CampaignCard
                key={campaign.id}
                title={campaign.title}
                category={campaign.category}
                ongName={user?.org_name || ''}
                raisedAmount={parseFloat(campaign.raised_amount)}
                goalAmount={parseFloat(campaign.goal_amount)}
                percentageComplete={campaign.percentage_complete}
                donorCount={campaign.donor_count}
                imageUrl={campaign.image_url}
                isUrgent={campaign.is_urgent}
                onPress={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
