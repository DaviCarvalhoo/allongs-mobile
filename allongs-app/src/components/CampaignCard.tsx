import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';

interface CampaignCardProps {
  title: string;
  category: string;
  ongName: string;
  raisedAmount: number;
  goalAmount: number;
  percentageComplete: number;
  donorCount: number;
  imageUrl: string;
  isUrgent?: boolean;
  onPress: () => void;
}

export default function CampaignCard({
  title,
  category,
  ongName,
  raisedAmount,
  goalAmount,
  percentageComplete,
  donorCount,
  imageUrl,
  isUrgent,
  onPress,
}: CampaignCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      className="bg-surface-container-lowest rounded-3xl overflow-hidden mb-6 shadow-sm border border-surface-container-low"
    >
      <View className="relative h-48 w-full bg-surface-container">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center bg-primary-container">
            <MaterialIcons name="image" size={40} color="#a8e7c5" />
          </View>
        )}
        
        {isUrgent && (
          <View className="absolute top-4 left-4 bg-error px-3 py-1 rounded-full flex-row items-center">
            <MaterialIcons name="priority-high" size={14} color="white" />
            <Text className="text-white text-xs font-bold ml-1">Urgente</Text>
          </View>
        )}

        <View className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-primary font-bold text-xs">{category}</Text>
        </View>
      </View>

      <View className="p-5">
        <Text className="text-xl font-headline font-bold text-on-surface mb-1" numberOfLines={2}>
          {title}
        </Text>
        <Text className="text-on-surface-variant text-sm mb-4">por {ongName}</Text>

        <ProgressBar percentage={percentageComplete} />

        <View className="flex-row justify-between items-center mt-3">
          <View>
            <Text className="text-primary font-bold text-lg">{formatCurrency(raisedAmount)}</Text>
            <Text className="text-on-surface-variant text-xs">arrecadados</Text>
          </View>
          <View className="items-end">
            <Text className="text-on-surface font-bold text-lg">{formatCurrency(goalAmount)}</Text>
            <Text className="text-on-surface-variant text-xs">meta</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-4 pt-4 border-t border-surface-container-low">
          <MaterialIcons name="people" size={16} color="#707973" />
          <Text className="text-on-surface-variant text-xs ml-2">
            <Text className="font-bold">{donorCount}</Text> doadores já apoiaram
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
