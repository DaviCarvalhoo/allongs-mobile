import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function DonationConfirmedScreen({ route, navigation }: any) {
  const { donation, campaign } = route.params || {};

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Decorative background blobs matching base design */}
      <View className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full" style={{ right: -100, top: -100 }} />
      <View className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full" style={{ left: -100 }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Text Section */}
        <View className="items-center mb-10 mt-8">
          <View className="flex-row items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full mb-6 self-center">
            <MaterialIcons name="check-circle" size={18} color="#002114" />
            <Text className="font-label text-xs font-bold tracking-widest uppercase text-on-primary-fixed">
              DOAÇÃO BEM SUCEDIDA
            </Text>
          </View>
          
          <Text className="text-4xl font-headline-extrabold text-primary mb-4 tracking-tight text-center leading-tight">
            Você acabou de mudar{'\n'}o <Text className="text-secondary">mundo de alguém.</Text>
          </Text>
          
          <Text className="text-on-surface-variant text-base text-center leading-relaxed max-w-sm self-center">
            Seu coração generoso torna nossa missão possível. Por sua causa, a esperança continuará a crescer. Obrigado por fazer parte da All Ong's.
          </Text>
        </View>

        {/* Receipt Card */}
        <View className="bg-surface-container-low rounded-2xl p-6 relative overflow-hidden mb-8 shadow-sm">
          {/* Watermark icon */}
          <View className="absolute top-0 right-0 p-4 opacity-5">
            <MaterialIcons name="favorite" size={100} color="#191c1d" />
          </View>

          <View className="relative z-10">
            <Text className="font-headline-bold text-xl text-primary mb-6">
              Resumo de doações
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center pb-4 border-b border-outline-variant/20">
                <Text className="text-on-surface-variant font-medium">Quantia</Text>
                <Text className="text-2xl font-bold text-on-surface">
                  {formatCurrency(donation?.amount ? parseFloat(donation.amount) : 0)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center pb-4 border-b border-outline-variant/20">
                <Text className="text-on-surface-variant font-medium">Causa</Text>
                <Text className="font-bold text-on-surface text-right flex-1 ml-4" numberOfLines={2}>
                  {campaign?.title || donation?.campaign_title || 'Campanha'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-4 border-b border-outline-variant/20">
                <Text className="text-on-surface-variant font-medium">ONG</Text>
                <Text className="font-bold text-on-surface text-right flex-1 ml-4" numberOfLines={1}>
                  {campaign?.ong_name || campaign?.org_name || 'Instituição Verificada'}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center pb-4 border-b border-outline-variant/20">
                <Text className="text-on-surface-variant font-medium">ID da transação</Text>
                <Text className="font-mono text-sm text-on-surface-variant">
                  {donation?.transaction_id || '#AO-000000'}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-on-surface-variant font-medium">Data</Text>
                <Text className="font-bold text-on-surface">
                  {donation?.created_at ? formatDate(donation.created_at) : formatDate(new Date().toISOString())}
                </Text>
              </View>
            </View>

            {/* Impact Box */}
            <View className="mt-6 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
              <View className="flex-row gap-4 items-start">
                <View className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ffdf96]">
                  <MaterialIcons name="auto-awesome" size={24} color="#5a4400" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-on-surface mb-1">
                    Estimativa de Impacto
                  </Text>
                  <Text className="text-xs text-on-surface-variant leading-relaxed">
                    {donation?.impact_text || 'Sua doação contribuirá diretamente para as metas desta missão, gerando impacto positivo e mudança real.'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Single Action Button — no share */}
        <TouchableOpacity
          className="w-full py-4 bg-primary rounded-full items-center justify-center flex-row shadow-sm"
          onPress={() => navigation.navigate('DonorApp', { screen: 'DonorHome' })}
        >
          <MaterialIcons name="home" size={20} color="#fff" />
          <Text className="text-white font-headline-bold text-base ml-2">Voltar para Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
