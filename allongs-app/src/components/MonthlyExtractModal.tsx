import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import api from '../services/api';

export default function MonthlyExtractModal({ visible, onClose, userType }: { visible: boolean, onClose: () => void, userType: 'ong' | 'doador' }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const monthLabel = months.find(m => m.value === month)?.label ?? '';

  const handleExportPDF = async () => {
    if (!data || data.donations.length === 0) return;

    setIsExporting(true);
    try {
      const today = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      const donationRows = data.donations.map((d: any, index: number) => {
        const date = new Date(d.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short', year: 'numeric',
        });

        const name = userType === 'ong'
          ? (d.donor_name || 'Anônimo')
          : (d.ong_name || 'ONG');

        const method = d.payment_method === 'pix'
          ? 'PIX'
          : d.payment_method === 'cartao'
          ? 'Cartão'
          : d.payment_method?.toUpperCase() || '—';

        const rowBg = index % 2 === 0 ? '#f8faf9' : '#ffffff';
        const methodBg = d.payment_method === 'pix' ? '#fff8e1' : '#e3f2fd';
        const methodColor = d.payment_method === 'pix' ? '#5a4400' : '#0d47a1';

        return `
          <tr style="background-color: ${rowBg};">
            <td style="padding: 12px 14px; border-bottom: 1px solid #e8ede9; color: #707973; font-size: 12px;">${date}</td>
            <td style="padding: 12px 14px; border-bottom: 1px solid #e8ede9; color: #191c1d; font-size: 13px; font-weight: 600;">${name}</td>
            <td style="padding: 12px 14px; border-bottom: 1px solid #e8ede9; color: #404943; font-size: 12px;">${d.campaign_title || '—'}</td>
            <td style="padding: 12px 14px; border-bottom: 1px solid #e8ede9; text-align: center;">
              <span style="background-color:${methodBg}; color:${methodColor}; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;">${method}</span>
            </td>
            <td style="padding: 12px 14px; border-bottom: 1px solid #e8ede9; color: #0f5238; font-size: 13px; font-weight: 700; text-align: right;">${formatCurrency(parseFloat(d.amount))}</td>
          </tr>
        `;
      }).join('');

      const title = userType === 'ong' ? 'Extrato de Doações Recebidas' : 'Extrato de Doações Realizadas';
      const totalLabel = userType === 'ong' ? 'Total Arrecadado' : 'Total Doado';
      const partyLabel = userType === 'ong' ? 'Doador' : 'ONG';

      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>${title} — All Ong's</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; background: #fff; color: #191c1d; padding: 40px; }
            .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; padding-bottom: 28px; border-bottom: 2px solid #0f5238; }
            .logo h1 { font-size: 26px; font-weight: 800; color: #0f5238; letter-spacing: -0.5px; }
            .logo p { font-size: 12px; color: #707973; margin-top: 4px; }
            .meta { text-align: right; }
            .meta .badge { display: inline-block; background: #0f5238; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 6px; }
            .meta p { font-size: 11px; color: #707973; }
            .summary { display: flex; gap: 16px; margin-bottom: 36px; }
            .card { flex: 1; background: #f1f5f2; border-radius: 14px; padding: 18px 20px; border-left: 4px solid #0f5238; }
            .card .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0f5238; margin-bottom: 6px; }
            .card .value { font-size: 22px; font-weight: 800; color: #191c1d; }
            .card .sub { font-size: 11px; color: #707973; margin-top: 4px; }
            .section-title { font-size: 15px; font-weight: 700; color: #191c1d; margin-bottom: 14px; padding-left: 8px; border-left: 3px solid #0f5238; }
            table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
            thead { background: #0f5238; }
            thead th { padding: 13px 14px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.9); }
            thead th:last-child { text-align: right; }
            .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e8ede9; display: flex; justify-content: space-between; align-items: center; }
            .footer small { font-size: 10px; color: #bfc9c1; }
            .total-box { background: #0f5238; color: #fff; padding: 12px 24px; border-radius: 12px; text-align: right; }
            .total-box .tl { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; }
            .total-box .tv { font-size: 20px; font-weight: 800; margin-top: 2px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <h1>All Ong's</h1>
              <p>${title} · ${monthLabel} de ${year}</p>
            </div>
            <div class="meta">
              <div class="badge">Extrato Oficial</div>
              <p>Gerado em ${today}</p>
              <p style="margin-top:3px; font-weight:600; color:#404943;">${data.count} transação(ões)</p>
            </div>
          </div>

          <div class="summary">
            <div class="card">
              <div class="label">${totalLabel} no Mês</div>
              <div class="value">${formatCurrency(data.total_amount)}</div>
              <div class="sub">${monthLabel} / ${year}</div>
            </div>
            <div class="card" style="border-left-color:#2b6485;">
              <div class="label" style="color:#2b6485;">Total de Transações</div>
              <div class="value">${data.count}</div>
              <div class="sub">no período selecionado</div>
            </div>
          </div>

          <div class="section-title">Detalhamento das Transações</div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>${partyLabel}</th>
                <th>Campanha</th>
                <th style="text-align:center;">Método</th>
                <th style="text-align:right;">Valor</th>
              </tr>
            </thead>
            <tbody>${donationRows}</tbody>
          </table>

          <div class="footer">
            <small>All Ong's · Documento gerado automaticamente · ${today}</small>
            <div class="total-box">
              <div class="tl">${totalLabel}</div>
              <div class="tv">${formatCurrency(data.total_amount)}</div>
            </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Salvar Extrato em PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Gerado', `Arquivo salvo em:\n${uri}`);
      }
    } catch (err) {
      console.error('PDF export error:', err);
      Alert.alert('Erro', 'Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!visible) return null;

  const hasData = data && data.donations.length > 0;

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
                <Text className="text-sm font-label font-bold text-on-surface-variant mb-1">
                  Total {userType === 'ong' ? 'Arrecadado' : 'Doado'} em {monthLabel}
                </Text>
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
                        <Text className="font-headline-bold text-on-surface mb-1" numberOfLines={1}>
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

              {/* Botão Exportar PDF */}
              <TouchableOpacity
                className={`w-full py-4 rounded-full flex-row items-center justify-center shadow-sm ${!hasData || isExporting ? 'bg-surface-variant' : 'bg-primary'}`}
                onPress={handleExportPDF}
                disabled={!hasData || isExporting}
                activeOpacity={0.85}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color="#0f5238" />
                ) : (
                  <MaterialIcons name="picture-as-pdf" size={20} color={!hasData ? '#707973' : '#fff'} />
                )}
                <Text className={`font-headline-bold ml-2 ${!hasData || isExporting ? 'text-on-surface-variant' : 'text-white'}`}>
                  {isExporting ? 'Gerando PDF...' : 'Baixar Extrato em PDF'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
