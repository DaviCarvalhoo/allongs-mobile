import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';

export default function EditCampaignScreen({ route, navigation }: any) {
  const { campaignId } = route.params;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Meio Ambiente');
  const [goalAmount, setGoalAmount] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Meio Ambiente', 'Causa Animal', 'Social', 'Saúde', 'Educação'];

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${campaignId}`);
        const c = res.data;
        setTitle(c.title || '');
        setDescription(c.description || '');
        setCategory(c.category || 'Meio Ambiente');
        setGoalAmount(c.goal_amount ? c.goal_amount.toString() : '');
        setIsUrgent(!!c.is_urgent);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar os dados da campanha.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [campaignId, navigation]);

  const handleUpdate = async () => {
    if (!title || !description || !goalAmount) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/campaigns/${campaignId}`, {
        title,
        description,
        category,
        goal_amount: parseFloat(goalAmount),
        is_urgent: isUrgent,
      });
      Alert.alert('Sucesso', 'Campanha atualizada com sucesso!');
      navigation.goBack();
    } catch (err: any) {
      console.error('API Error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
      Alert.alert('Erro', `Não foi possível atualizar a campanha.\nDetalhe: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#0f5238" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center z-50 bg-[#f8f9fa]/70 absolute top-0 w-full">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center mr-4 shadow-sm"
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#191c1d" />
        </TouchableOpacity>
        <Text className="text-2xl font-headline-bold tracking-tight text-on-surface">Editar Campanha</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 48, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <View className="mb-8">
            <Text className="font-headline-bold text-2xl text-on-surface mb-2">Atualizar informações</Text>
            <Text className="text-on-surface-variant font-body text-sm">Altere os detalhes da sua campanha abaixo.</Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Título da Campanha *</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                <MaterialIcons name="title" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface"
                  placeholder="Ex: Reflorestamento Local"
                  placeholderTextColor="#707973"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Categoria *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    className={`px-4 py-2.5 rounded-full mr-2 flex-row items-center border ${
                      category === cat ? 'bg-primary border-primary' : 'bg-surface-container-highest border-outline-variant/30'
                    }`}
                    onPress={() => setCategory(cat)}
                  >
                    <MaterialIcons 
                      name={cat === 'Meio Ambiente' ? 'eco' : cat === 'Causa Animal' ? 'pets' : cat === 'Social' ? 'people' : cat === 'Saúde' ? 'health-and-safety' : 'school'} 
                      size={16} 
                      color={category === cat ? '#fff' : '#707973'} 
                      style={{ marginRight: 6 }}
                    />
                    <Text className={`font-label font-bold text-sm ${category === cat ? 'text-white' : 'text-on-surface-variant'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Meta de Arrecadação (R$) *</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-md px-4">
                <MaterialIcons name="attach-money" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body font-bold text-lg text-on-surface"
                  placeholder="Ex: 5000"
                  placeholderTextColor="#707973"
                  keyboardType="numeric"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Descrição *</Text>
              <View className="flex-row items-start bg-surface-container-high rounded-md px-4 py-4">
                <MaterialIcons name="description" size={20} color="#707973" style={{ marginTop: 2 }} />
                <TextInput
                  className="flex-1 ml-3 font-body text-on-surface h-32"
                  placeholder="Conte a história e o impacto esperado..."
                  placeholderTextColor="#707973"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <TouchableOpacity
              className={`flex-row items-center p-4 rounded-xl border mt-2 ${isUrgent ? 'bg-error-container/20 border-error' : 'bg-surface-container-high border-transparent'}`}
              onPress={() => setIsUrgent(!isUrgent)}
            >
              <MaterialIcons 
                name={isUrgent ? 'warning' : 'info-outline'} 
                size={24} 
                color={isUrgent ? '#ba1a1a' : '#707973'} 
              />
              <View className="ml-3 flex-1">
                <Text className={`font-label font-bold ${isUrgent ? 'text-error' : 'text-on-surface'}`}>
                  Marcar como urgente
                </Text>
                <Text className={`text-xs mt-0.5 font-body leading-tight ${isUrgent ? 'text-error/80' : 'text-on-surface-variant'}`}>
                  Para campanhas de socorro imediato, como desastres naturais ou crises de saúde.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className={`w-full py-5 rounded-full flex-row items-center justify-center mt-6 shadow-sm ${isSubmitting ? 'bg-surface-variant' : 'bg-primary'}`}
              onPress={handleUpdate}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f5238" />
              ) : (
                <>
                  <Text className="text-white font-headline-bold text-base mr-2">Salvar Alterações</Text>
                  <MaterialIcons name="save" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
