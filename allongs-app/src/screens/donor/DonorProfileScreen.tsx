import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import * as Print from 'expo-print';
import api from '../../services/api';

export default function DonorProfileScreen({ navigation }: any) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name || undefined,
        avatar_url: avatarUrl || undefined,
      });
      if (updateUser) updateUser(res.data);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setAvatarUrl(user?.avatar_url || '');
    setIsEditing(false);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const [histRes, statsRes] = await Promise.all([
        api.get('/donations/history'),
        api.get('/donations/stats'),
      ]);
      const donations = histRes.data;
      const stats = statsRes.data;

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
      const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const rows = donations.map((d: any) => `
        <tr>
          <td>${formatDate(d.created_at)}</td>
          <td>${d.campaign_title || '—'}</td>
          <td>${formatCurrency(parseFloat(d.amount))}</td>
          <td>${d.transaction_id}</td>
          <td>${d.impact_text || '—'}</td>
        </tr>
      `).join('');

      const html = `
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', sans-serif; padding: 40px; color: #191c1d; }
            h1 { color: #0f5238; font-size: 28px; margin-bottom: 4px; }
            .subtitle { color: #707973; font-size: 14px; margin-bottom: 30px; }
            .stats { display: flex; gap: 20px; margin-bottom: 30px; }
            .stat-card { background: #f3f4f5; border-radius: 12px; padding: 20px; flex: 1; }
            .stat-value { font-size: 24px; font-weight: 800; color: #0f5238; }
            .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #707973; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #0f5238; color: white; padding: 12px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 10px; border-bottom: 1px solid #e7e8e9; }
            tr:nth-child(even) { background: #f8f9fa; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #707973; border-top: 1px solid #e7e8e9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Extrato de Doações — All Ong's</h1>
          <p class="subtitle">Doador: ${user?.name || 'Usuário'} · Gerado em ${formatDate(new Date().toISOString())}</p>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">${formatCurrency(stats.total_donated || 0)}</div>
              <div class="stat-label">Total Doado</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.donation_count || 0}</div>
              <div class="stat-label">Doações</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.campaigns_supported || 0}</div>
              <div class="stat-label">Campanhas</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Campanha</th>
                <th>Valor</th>
                <th>ID Transação</th>
                <th>Impacto</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma doação encontrada</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            All Ong's · Plataforma de Doações · Este documento é um extrato informativo.
          </div>
        </body>
        </html>
      `;

      // Na Web, expo-print as vezes acaba imprimindo a tela principal.
      // Abrir um popup com o HTML e imprimir ele resolve esse problema garantindo que só o extrato seja exportado.
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        } else {
          // Fallback caso o popup seja bloqueado pelo navegador
          await Print.printAsync({ html });
        }
      } else {
        await Print.printAsync({ html });
      }
      
    } catch (err) {
      console.error('PDF export error:', err);
      Alert.alert('Erro', 'Não foi possível gerar o extrato.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center' }}>
        
        {/* Hero Profile Section */}
        <View className="flex-col items-center mb-12 mt-4">
          <View className="relative">
            <View
              className="w-40 h-40 overflow-hidden shadow-2xl"
              style={{ borderTopLeftRadius: 48, borderTopRightRadius: 48, borderBottomRightRadius: 48, borderBottomLeftRadius: 0 }}
            >
              <Image 
                source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            {/* Edit button next to photo */}
            {!isEditing && (
              <TouchableOpacity
                className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-full shadow-lg"
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons name="edit" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View className="w-full mt-6">
              {/* Edit Name */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">Nome</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-4">
                <MaterialIcons name="person" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  placeholderTextColor="#707973"
                />
              </View>

              {/* Edit Avatar URL */}
              <Text className="text-sm font-label font-semibold text-on-surface-variant ml-1 mb-2">URL da Foto</Text>
              <View className="flex-row items-center bg-surface-container-high rounded-xl px-4 mb-6">
                <MaterialIcons name="image" size={20} color="#707973" />
                <TextInput
                  className="flex-1 py-4 ml-3 font-body text-on-surface text-base"
                  value={avatarUrl}
                  onChangeText={setAvatarUrl}
                  placeholder="https://..."
                  placeholderTextColor="#707973"
                  autoCapitalize="none"
                />
              </View>

              {/* Save / Cancel buttons */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="flex-1 py-4 rounded-full items-center bg-surface-container-high"
                  onPress={handleCancel}
                >
                  <Text className="font-headline-bold text-on-surface">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-4 rounded-full items-center bg-primary"
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-headline-bold">Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="mt-6 text-3xl font-headline-extrabold text-on-surface tracking-tight text-center">
                {user?.name || 'Usuário Doador'}
              </Text>
              <Text className="text-on-surface-variant font-body font-medium mt-1 text-center">
                Doador e voluntário Ativo
              </Text>
            </>
          )}
        </View>

        {/* Impact Bento Grid + Actions */}
        {!isEditing && (
          <>
            <View className="w-full flex-row gap-4 mb-8">
              {/* Doações */}
              <View className="flex-1 bg-surface-container-low p-6 rounded-2xl justify-between" style={{ aspectRatio: 1 }}>
                <View>
                  <MaterialIcons name="favorite" size={28} color="#0f5238" style={{ marginBottom: 8 }} />
                  <Text className="font-headline-bold text-lg text-primary">Doações</Text>
                </View>
                <View>
                  <Text className="text-3xl font-headline-extrabold text-on-surface">R$ 1.250</Text>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Contribuído</Text>
                </View>
              </View>

              {/* Voluntariado */}
              <View className="flex-1 p-6 rounded-2xl justify-between" style={{ aspectRatio: 1, backgroundColor: '#a3d8fe' }}>
                <View>
                  <MaterialIcons name="schedule" size={28} color="#255f80" style={{ marginBottom: 8 }} />
                  <Text className="font-headline-bold text-lg" style={{ color: '#255f80' }}>Voluntariado</Text>
                </View>
                <View>
                  <Text className="text-3xl font-headline-extrabold" style={{ color: '#255f80' }}>48h</Text>
                  <Text className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#255f80', opacity: 0.7 }}>Horas Dedicadas</Text>
                </View>
              </View>
            </View>

            {/* Export PDF Button */}
            <View className="w-full mb-4">
              <TouchableOpacity
                className="p-5 rounded-2xl border flex-row items-center"
                style={{ backgroundColor: 'rgba(177, 240, 206, 0.15)', borderColor: 'rgba(15, 82, 56, 0.1)' }}
                activeOpacity={0.7}
                onPress={handleExportPDF}
                disabled={isExporting}
              >
                <View className="p-3 rounded-full bg-primary-fixed">
                  {isExporting ? (
                    <ActivityIndicator size={22} color="#0f5238" />
                  ) : (
                    <MaterialIcons name="picture-as-pdf" size={22} color="#0f5238" />
                  )}
                </View>
                <View className="ml-4">
                  <Text className="font-headline-bold text-on-surface text-base">Exportar Extrato</Text>
                  <Text className="text-sm font-body text-on-surface-variant">Gerar PDF das doações</Text>
                </View>
                <View className="ml-auto">
                  <MaterialIcons name="chevron-right" size={24} color="#707973" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View className="w-full">
              <TouchableOpacity 
                className="p-5 rounded-2xl border flex-row items-center"
                style={{ backgroundColor: 'rgba(255, 218, 214, 0.2)', borderColor: 'rgba(186, 26, 26, 0.05)' }}
                activeOpacity={0.7}
                onPress={logout}
              >
                <View className="p-3 rounded-full" style={{ backgroundColor: '#ffdad6' }}>
                  <MaterialIcons name="logout" size={22} color="#93000a" />
                </View>
                <View className="ml-4">
                  <Text className="font-headline-bold text-on-surface text-base">Sair da Conta</Text>
                  <Text className="text-sm font-body text-on-surface-variant">Desconectar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
