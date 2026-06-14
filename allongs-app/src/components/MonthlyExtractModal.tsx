import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';

export default function MonthlyExtractModal({ visible, onClose, userType }: { visible: boolean, onClose: () => void, userType: 'ong' | 'doador' }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const fetchExtract = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/donations/extract?month=${month}&year=${year}`);
      setData(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível buscar o extrato.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchExtract();
    } else {
      setData(null);
    }
  }, [visible, month, year]);

  const handleCopy = async () => {
    if (!data || data.donations.length === 0) return;
    
    let text = `Extrato Mensal - ${month}/${year}\n`;
    text += `Total: R$ ${data.total_amount.toFixed(2)}\n\n`;
    
    data.donations.forEach((d: any) => {
      const date = new Date(d.created_at).toLocaleDateString('pt-BR');
      if (userType === 'ong') {
        text += `[${date}] R$ ${d.amount} de ${d.donor_name || 'Anônimo'} - Campanha: ${d.campaign_title || 'N/A'}\n`;
      } else {
        text += `[${date}] R$ ${d.amount} para ${d.ong_name || 'ONG'} - Campanha: ${d.campaign_title || 'N/A'}\n`;
      }
    });

    await Clipboard.setStringAsync(text);
    Alert.alert('Sucesso', 'Extrato copiado para a área de transferência.');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-surface w-full h-[85%] rounded-t-3xl overflow-hidden p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-headline-bold text-primary">Extrato Mensal</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-surface-container-high rounded-full">
              <MaterialIcons name="close" size={24} color="#191c1d" />
            </TouchableOpacity>
          </View>

          {/* Month Selector */}
          <View className="mb-6">
            <Text className="font-label font-bold text-on-surface-variant mb-3">Selecione o Mês</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {months.map(m => (
                <TouchableOpacity
                  key={m.value}
                  className={`px-4 py-2.5 rounded-full mr-2 border ${month === m.value ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant/30'}`}
                  onPress={() => setMonth(m.value)}
                >
                  <Text className={`font-label font-bold ${month === m.value ? 'text-white' : 'text-on-surface-variant'}`}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0f5238" />
            </View>
          ) : data && (
            <>
              <View className="bg-surface-container-lowest p-6 rounded-2xl mb-6 shadow-sm border border-outline-variant/20">
                <Text className="text-sm font-label font-bold text-on-surface-variant mb-1">Total {userType === 'ong' ? 'Arrecadado' : 'Doado'} no Mês</Text>
                <Text className="text-3xl font-headline-bold text-primary">{formatCurrency(data.total_amount)}</Text>
                <Text className="text-xs text-on-surface-variant mt-2">{data.count} doações no período</Text>
              </View>

              <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
                {data.donations.length === 0 ? (
                  <View className="items-center justify-center py-10">
                    <MaterialIcons name="receipt-long" size={48} color="#c4c7c5" />
                    <Text className="text-on-surface-variant mt-4 font-body">Nenhuma doação encontrada neste mês.</Text>
                  </View>
                ) : (
                  data.donations.map((d: any) => (
                    <View key={d.id} className="py-4 border-b border-outline-variant/20 flex-row justify-between items-center">
                      <View className="flex-1 pr-4">
                        <Text className="font-headline-bold text-on-surface mb-1">
                          {userType === 'ong' ? d.donor_name || 'Anônimo' : d.ong_name || 'ONG'}
                        </Text>
                        <Text className="text-xs text-on-surface-variant mb-1" numberOfLines={1}>
                          {d.campaign_title || 'Sem campanha'}
                        </Text>
                        <Text className="text-[10px] text-on-surface-variant">
                          {new Date(d.created_at).toLocaleDateString('pt-BR')} • {d.payment_method.toUpperCase()}
                        </Text>
                      </View>
                      <Text className="font-headline-bold text-primary text-base">
                        {formatCurrency(parseFloat(d.amount))}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity 
                className={`w-full py-4 rounded-full flex-row items-center justify-center shadow-sm ${data.donations.length === 0 ? 'bg-surface-variant' : 'bg-primary'}`}
                onPress={handleCopy}
                disabled={data.donations.length === 0}
              >
                <MaterialIcons name="content-copy" size={20} color={data.donations.length === 0 ? '#707973' : '#fff'} />
                <Text className={`font-headline-bold ml-2 ${data.donations.length === 0 ? 'text-on-surface-variant' : 'text-white'}`}>
                  Copiar Dados
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
