import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DonationConfirmedScreen({ route, navigation }: any) {
  const { donation, campaign } = route.params || {};

  return (
    <View className="flex-1 bg-primary items-center justify-center p-6">
      <View className="w-24 h-24 bg-primary-container rounded-full items-center justify-center mb-6">
        <MaterialIcons name="check" size={48} color="#a8e7c5" />
      </View>
      
      <Text className="text-3xl font-headline font-bold text-white text-center mb-4">
        Doação Realizada!
      </Text>
      
      <Text className="text-on-primary-container text-center text-lg mb-8">
        Obrigado por apoiar a campanha "{campaign?.title || 'Selecionada'}".
      </Text>

      <View className="bg-white p-6 rounded-3xl w-full mb-8 items-center">
        <Text className="text-on-surface-variant text-sm mb-1">Seu impacto estimado:</Text>
        <Text className="text-primary font-bold text-center text-lg">
          {donation?.impact_text || 'Você ajudou a fazer a diferença no mundo hoje!'}
        </Text>
      </View>

      <TouchableOpacity 
        className="bg-white py-4 px-8 rounded-full w-full items-center"
        onPress={() => navigation.navigate('DonorHome')}
      >
        <Text className="text-primary font-bold text-lg">Voltar ao Início</Text>
      </TouchableOpacity>
    </View>
  );
}
