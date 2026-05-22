import React from 'react';
import { View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar campanhas, ONGs...' }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-surface-container-highest px-4 py-3 rounded-2xl mb-6">
      <MaterialIcons name="search" size={24} color="#707973" />
      <TextInput
        className="flex-1 ml-3 text-base text-on-surface"
        placeholder={placeholder}
        placeholderTextColor="#707973"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
