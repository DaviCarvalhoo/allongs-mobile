import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';

export default function DonorProfileScreen({ navigation }: any) {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70 absolute top-0 w-full border-b border-surface-container-low/50">
        <Text className="text-2xl font-headline-bold tracking-tight text-on-surface">Sua Conta</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 48, alignItems: 'center' }}>
        <View className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          
          {/* Hero Profile Section */}
          <View className="flex-col items-center mb-10">
            <View className="w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-surface-container-highest shadow-sm relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT8nB1bj2pXC855FDP9Gtx7r-TAXU1JTgD6ncyQx0Ib0SBS5piLGlOjr4cEWmsNT-QMVgwdd6q1aK9RKa7EVki2-qrMASwIDz28DEJf4j0Vb-pQ1gRUzl0rbEvrUax1XgE7jWCutCW5d8O5CH9T61PApz74udrJT1e24Yb-yZz2WsZ1I75aVH83517DvWYo5chzvPeaiia1kMjwESwH-QViCklhSwRfBCa950mZr_GrkJHdtlqliR2jn9pUgrV4Avw26KPjrmrRQ' }}
                className="w-full h-full absolute"
              />
            </View>
            <Text className="text-3xl font-headline-extrabold text-on-surface tracking-tight text-center">
              {user?.name || 'Usuário Doador'}
            </Text>
            <Text className="text-on-surface-variant font-body font-medium mt-1 text-center">
              Doador Ativo 🌟
            </Text>
          </View>

          {/* Impact Bento Grid */}
          <View className="flex-row gap-4 mb-10">
            <View className="bg-surface-container-high p-6 rounded-2xl flex-1 flex-col justify-between">
              <View className="mb-4">
                <Text className="text-2xl mb-1">❤️</Text>
                <Text className="font-headline-bold text-base text-primary">Doações</Text>
              </View>
              <View>
                <Text className="text-2xl font-headline-extrabold text-on-surface">R$ 1.250</Text>
                <Text className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total</Text>
              </View>
            </View>

            <View className="bg-surface-container-high p-6 rounded-2xl flex-1 flex-col justify-between">
              <View className="mb-4">
                <Text className="text-2xl mb-1">🕒</Text>
                <Text className="font-headline-bold text-base text-secondary">Apoio</Text>
              </View>
              <View>
                <Text className="text-2xl font-headline-extrabold text-on-surface">12</Text>
                <Text className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mt-1">Campanhas</Text>
              </View>
            </View>
          </View>

          {/* Action Settings List */}
          <View className="space-y-4">
            <TouchableOpacity 
              className="bg-error/10 p-5 rounded-xl border border-error/20 flex-row items-center justify-between"
              activeOpacity={0.7}
              onPress={logout}
            >
              <View className="flex-row items-center gap-4">
                <View className="bg-error/20 w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-lg">🚪</Text>
                </View>
                <View>
                  <Text className="font-headline-bold text-error text-base">Sair da Conta</Text>
                  <Text className="text-sm font-body text-error/80">Desconectar agora</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
