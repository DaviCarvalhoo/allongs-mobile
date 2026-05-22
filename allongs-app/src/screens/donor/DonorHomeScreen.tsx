import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function DonorHomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');

  const getFirstName = (fullName: string) => {
    return fullName ? fullName.split(' ')[0] : 'Usuário';
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            className="w-10 h-10 rounded-full overflow-hidden bg-primary items-center justify-center"
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-white font-headline-bold">{getFirstName(user?.name).charAt(0)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>
        
        {/* Header Greeting */}
        <View className="mt-4 mb-8">
          <Text className="text-on-surface-variant font-body text-lg">Olá, {getFirstName(user?.name)} 👋</Text>
          <Text className="text-on-surface font-headline-extrabold text-3xl mt-1 tracking-tight">Pronto para causar impacto?</Text>
        </View>

        {/* Search Bar */}
        <View className="mb-10 relative">
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

        {/* Featured Sanctuary */}
        <View className="mb-12">
          <View className="w-full bg-surface-container-low rounded-3xl overflow-hidden shadow-sm">
            <View className="w-full h-[300px] relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxo-AeON_OfknykjEp-R4P6gmTBeyP-BOaUbefoIlrc4uWlZ3W-AtBTyEilBqqVKdHRm-fHTgrVdjHasrsKHaRUXNMrzO-ndRBfrpqFl2w-a0U_sHYNhzJrwKF3wNUQB3K_CqDZBjbMN34vTTqT1fAEejXS-vyGYCK6GOx1IQTHsqu2AmMzdEgocF8g6CAk5ENQfz7ApbBxMBYp5ShnQeKNd1aHb9mc5QrMV6v99Z3yX8lOPoZJkEbycJShj1TiE-Z52g1m0wmdQ' }}
                className="w-full h-full absolute"
              />
              <LinearGradient 
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                className="absolute inset-0"
              />
              <View className="absolute bottom-6 left-6 right-6">
                <Text className="text-xs font-bold uppercase tracking-widest text-primary-fixed mb-1">Santuário em Destaque</Text>
                <Text className="text-2xl font-headline-extrabold text-white">O Santuário dos Gigantes</Text>
              </View>
            </View>
            <View className="p-6">
              <Text className="text-2xl font-headline-bold leading-tight text-primary mb-3">
                Crie santuários para aqueles que não podem falar.
              </Text>
              <Text className="text-on-surface-variant font-body text-base leading-relaxed mb-4">
                Junte-se à nossa missão de fornecer cuidados ao longo da vida para elefantes aposentados. Seu apoio constrói lares, fornece medicamentos e garante uma vida pacífica.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1.5 bg-primary-fixed rounded-full">
                  <Text className="text-on-primary-fixed text-xs font-bold">#BemEstarAnimal</Text>
                </View>
                <View className="px-3 py-1.5 bg-secondary-fixed rounded-full">
                  <Text className="text-on-secondary-fixed text-xs font-bold">#Conservação</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Urgent Campaigns */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-6">
            <View className="flex-1">
              <Text className="text-2xl font-headline-extrabold tracking-tight text-on-surface">Campanhas urgentes</Text>
              <Text className="text-on-surface-variant font-body mt-1">Precisamos de apoio imediato.</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text className="text-primary font-bold">Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-6">
            {/* Main Urgent Card */}
            <TouchableOpacity 
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm"
              activeOpacity={0.9}
              onPress={() => navigation.navigate('CampaignDetail', { id: 'urgent1' })}
            >
              <View className="w-full h-48 relative">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDXJ197LHyUvrLfZD4ts81y56yzXza0Yr9b260Dau-WCkDo25LD3Ym9ubsiAPSQYbbo2mu_ecNVTvMEN3ptHPR5VPqwVdfr_v9x0cg9230PNFC8SNVKZEglOhjRFm8KYUijCXG1tsMKUTDlzaqoCI2w-AhUBz1kA2xvuAW9jbIx5rI8-mlVaeTMiBokx66AE6pB2IdKM0h0wEeYdfZJDgYqiy13trjz7dkM3vFZqOOtk9wnBkWyNAykFczpgGCyLgHDOyfgC8eIA' }}
                  className="w-full h-full absolute"
                />
                <LinearGradient 
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute inset-0"
                />
                <View className="absolute top-4 left-4 bg-error px-2 py-1 rounded-md">
                  <Text className="text-white text-xs font-bold">URGENTE</Text>
                </View>
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-2xl font-headline-bold text-white mb-1">Patrulhas florestais</Text>
                  <Text className="text-white/80 text-sm font-body" numberOfLines={2}>Protegendo tigres contra a caça ilegal.</Text>
                </View>
              </View>
              <View className="p-5">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm font-bold text-on-surface">R$42.500</Text>
                  <Text className="text-sm font-bold text-primary">85%</Text>
                </View>
                <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-4">
                  <View className="bg-primary h-full w-[85%] rounded-full" />
                </View>
                <TouchableOpacity 
                  className="w-full bg-primary py-3 rounded-full items-center"
                  onPress={() => navigation.navigate('MakeDonation')}
                >
                  <Text className="text-white font-headline-bold">Doar Agora</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Secondary Urgent Cards */}
            <View className="flex-row gap-4">
              {/* Card 1 */}
              <TouchableOpacity 
                className="flex-1 bg-surface-container-highest rounded-2xl p-4"
                activeOpacity={0.8}
              >
                <Text className="text-secondary font-bold text-[10px] mb-1">LIMPEZA OCEÂNICA</Text>
                <Text className="font-headline-bold text-base text-on-surface mb-2" numberOfLines={2}>Filtros de microplásticos</Text>
                <View className="mt-auto pt-3 border-t border-outline-variant/20 flex-row justify-between items-center">
                  <Text className="font-bold text-primary text-xs">R$12k arr.</Text>
                  <View className="w-6 h-6 rounded-full bg-primary-container items-center justify-center">
                    <MaterialIcons name="arrow-forward" size={12} color="#a8e7c5" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Card 2 */}
              <TouchableOpacity 
                className="flex-1 bg-surface-container rounded-2xl p-4"
                activeOpacity={0.8}
              >
                <Text className="text-tertiary-container font-bold text-[10px] mb-1">REFLORESTAMENTO</Text>
                <Text className="font-headline-bold text-base text-on-surface mb-2" numberOfLines={2}>1 milhão de árvores</Text>
                <View className="mt-auto pt-3 border-t border-outline-variant/20 flex-row justify-between items-center">
                  <Text className="font-bold text-primary text-xs">2,405 docs</Text>
                  <View className="w-6 h-6 rounded-full bg-primary-container items-center justify-center">
                    <MaterialIcons name="arrow-forward" size={12} color="#a8e7c5" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
