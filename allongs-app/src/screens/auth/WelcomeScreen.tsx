import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }: any) {
  const handleSelectRole = (role: 'doador' | 'ong') => {
    navigation.navigate('Login', { role });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 32 }}>
        {/* Editorial Headline */}
        <View className="items-center mb-10">
          <View className="px-4 py-1.5 rounded-full bg-primary-fixed mb-6">
            <Text className="text-on-primary-fixed font-label text-xs font-bold uppercase tracking-wider">Comece sua jornada</Text>
          </View>
          <Text className="text-4xl md:text-5xl font-headline-extrabold tracking-tight text-on-surface leading-tight text-center mb-4">
            Como você quer <Text className="text-primary">impactar</Text> o mundo hoje?
          </Text>
          <Text className="text-on-surface-variant text-lg font-body text-center leading-relaxed">
            Escolha o seu caminho para unir forças com causas que transformam realidades e constroem futuros.
          </Text>
        </View>

        {/* Choice Grid */}
        <View className="w-full flex-col gap-8 md:flex-row">
          {/* Option 1: Donor */}
          <TouchableOpacity 
            className="flex-1 p-2 rounded-2xl bg-surface-container-lowest"
            activeOpacity={0.9}
            onPress={() => handleSelectRole('doador')}
          >
            <View className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJWWf6ztzJcjNZJcB2fzSckOatc-hwni4nkNTMwiiCQKmu6Gh9JJlgM-Uc8eBcJ0-9lNYD3fu7S1MD5teXtdd8criPcU48f0U-lbrn8kPh5oqsFgUfBglbyMxoozFuCRi5fjUHm9vEmqLnuG2ynlg0KyDQQxQAecl39N5K1_Hux8WQhzxDKWO9FzhdwK4v8PHk9fY9hBlb-zSDW6TLoLzTwXpKQJ4E_tnDRc9OrEpzYbd9qx4jF853E-ymvDgvmATDRtuI0sJtHw' }}
                className="w-full h-full absolute"
              />
              <LinearGradient 
                colors={['transparent', 'rgba(15,82,56,0.6)', 'rgba(15,82,56,0.9)']}
                className="absolute inset-0"
              />
              <View className="absolute bottom-6 left-6">
                <View className="flex-row items-center gap-2 px-3 py-1 bg-surface/90 rounded-full">
                  <MaterialIcons name="favorite" size={14} color="#0f5238" />
                  <Text className="text-[10px] font-bold text-primary tracking-widest uppercase">Propósito</Text>
                </View>
              </View>
            </View>

            <View className="px-4 pb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-3xl font-headline-bold text-on-surface mr-2">Sou Doador</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#0f5238" />
              </View>
              <Text className="text-on-surface-variant font-body text-base leading-relaxed mb-4">
                Desejo encontrar causas confiáveis, acompanhar o impacto das minhas doações e fazer a diferença.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1 rounded-full bg-surface-container">
                  <Text className="text-on-surface-variant text-xs font-semibold">Doação Transparente</Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-surface-container">
                  <Text className="text-on-surface-variant text-xs font-semibold">Impacto Social</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: NGO */}
          <TouchableOpacity 
            className="flex-1 p-2 rounded-2xl bg-surface-container-lowest"
            activeOpacity={0.9}
            onPress={() => handleSelectRole('ong')}
          >
            <View className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeuLe9kpBlfPsUxddgFOnRMfUY30Mbz5NcC_jexy6-fckkm7FBG5K5RU9Pag1Bd7td7QUY4ohIY6HGIqSSN-oeWUCXEI8nvzi5GihnO4-_K9eiQW2iBNeDW8_GmuoVVMRLesS2QAp6VtSRM3Gp-2WpWGy5vO8_DBIA5wYc_sefnw8GtMqm-HZURW8g3zX5t8MsZI8FA_pzPevluyqsktUwjWNwLHKHEIx4mYwm2t7moPXmIAG6iY-8zUtBPjBmtn-vx6BWnjZwDA' }}
                className="w-full h-full absolute"
              />
              <LinearGradient 
                colors={['transparent', 'rgba(43,100,133,0.6)', 'rgba(43,100,133,0.9)']}
                className="absolute inset-0"
              />
              <View className="absolute bottom-6 left-6">
                <View className="flex-row items-center gap-2 px-3 py-1 bg-surface/90 rounded-full">
                  <MaterialIcons name="groups" size={14} color="#2b6485" />
                  <Text className="text-[10px] font-bold text-secondary tracking-widest uppercase">Gestão</Text>
                </View>
              </View>
            </View>

            <View className="px-4 pb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-3xl font-headline-bold text-on-surface mr-2">Sou ONG</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#2b6485" />
              </View>
              <Text className="text-on-surface-variant font-body text-base leading-relaxed mb-4">
                Represento uma organização e busco visibilidade, ferramentas de gestão e uma rede de doadores.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1 rounded-full bg-surface-container">
                  <Text className="text-on-secondary-fixed-variant text-xs font-semibold">Captar Recursos</Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-surface-container">
                  <Text className="text-on-secondary-fixed-variant text-xs font-semibold">Prestação de Contas</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-12 pt-8 border-t border-outline-variant/20 items-center">
          <Text className="text-on-surface-variant font-body text-sm text-center">
            © 2026 All Ong's. Transformando empatia em ação direta.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
