import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';

export default function MakeDonationScreen({ route, navigation }: any) {
  const { campaign } = route.params || {};
  const [amount, setAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = ['25', '50', '100', '200'];

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);
    
    if (isNaN(finalAmount) || finalAmount <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para doação.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.post('/donations', {
        amount: finalAmount,
        payment_method: paymentMethod,
        campaign_id: campaign?.id
      });
      
      navigation.navigate('DonationConfirmed', { 
        donation: res.data,
        campaign
      });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível processar a doação no momento.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center p-4 pt-12 border-b border-surface-container-low bg-surface">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#191c1d" />
        </TouchableOpacity>
        <Text className="text-xl font-headline font-bold text-on-surface">Fazer Doação</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {campaign && (
          <View className="bg-surface-container-low p-4 rounded-2xl mb-8 flex-row items-center">
            <View className="w-12 h-12 bg-primary-container rounded-full items-center justify-center mr-4">
               <MaterialIcons name={campaign.icon || 'volunteer-activism'} size={24} color="#a8e7c5" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-on-surface-variant mb-1">Doando para</Text>
              <Text className="font-bold text-on-surface" numberOfLines={1}>{campaign.title}</Text>
            </View>
          </View>
        )}

        <Text className="text-lg font-headline font-bold text-on-surface mb-4">Selecione o valor</Text>
        
        <View className="flex-row flex-wrap justify-between mb-4">
          {predefinedAmounts.map(val => (
            <TouchableOpacity
              key={val}
              className={`w-[48%] p-4 rounded-xl mb-4 border items-center ${
                amount === val && !customAmount ? 'bg-primary-container border-primary' : 'bg-surface-container-lowest border-surface-variant'
              }`}
              onPress={() => {
                setAmount(val);
                setCustomAmount('');
              }}
            >
              <Text className={`text-lg font-bold ${amount === val && !customAmount ? 'text-on-primary-container' : 'text-on-surface'}`}>
                R$ {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-bold text-on-surface-variant mb-2">Ou digite outro valor</Text>
        <TextInput
          className="w-full bg-surface-container-lowest border border-surface-variant p-4 rounded-xl text-lg font-bold text-on-surface mb-8"
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={customAmount}
          onChangeText={(text) => {
            setCustomAmount(text);
            setAmount('');
          }}
        />

        <Text className="text-lg font-headline font-bold text-on-surface mb-4">Forma de Pagamento</Text>
        
        <TouchableOpacity
          className={`flex-row items-center p-4 rounded-xl mb-3 border ${
            paymentMethod === 'pix' ? 'bg-primary-container border-primary' : 'bg-surface-container-lowest border-surface-variant'
          }`}
          onPress={() => setPaymentMethod('pix')}
        >
          <MaterialIcons name="qr-code-2" size={24} color={paymentMethod === 'pix' ? '#0f5238' : '#707973'} />
          <Text className={`ml-3 font-bold ${paymentMethod === 'pix' ? 'text-primary' : 'text-on-surface'}`}>PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-4 rounded-xl mb-8 border ${
            paymentMethod === 'cartao' ? 'bg-primary-container border-primary' : 'bg-surface-container-lowest border-surface-variant'
          }`}
          onPress={() => setPaymentMethod('cartao')}
        >
          <MaterialIcons name="credit-card" size={24} color={paymentMethod === 'cartao' ? '#0f5238' : '#707973'} />
          <Text className={`ml-3 font-bold ${paymentMethod === 'cartao' ? 'text-primary' : 'text-on-surface'}`}>Cartão de Crédito</Text>
        </TouchableOpacity>

      </ScrollView>

      <View className="p-4 bg-surface border-t border-surface-container-low">
        <TouchableOpacity 
          className={`py-4 rounded-full items-center ${isProcessing ? 'bg-surface-variant' : 'bg-primary'}`}
          onPress={handleDonate}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#0f5238" />
          ) : (
            <Text className="text-white font-bold text-lg">Confirmar Doação</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
