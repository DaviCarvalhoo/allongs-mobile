import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import api from '../../services/api';

export default function ONGDonationHistoryScreen() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [topCampaign, setTopCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [donationsRes, statsRes, campaignsRes] = await Promise.all([
        api.get('/donations/received'),
        api.get('/donations/ong-stats'),
        api.get('/campaigns/my'),
      ]);
      setDonations(donationsRes.data);
      setStats(statsRes.data);

      const campaigns = campaignsRes.data;
      if (campaigns.length > 0) {
        const top = campaigns.reduce((a: any, b: any) =>
          parseFloat(a.raised_amount) > parseFloat(b.raised_amount) ? a : b
        );
        setTopCampaign(top);
      }
    } catch (err) {
      console.error('Failed to fetch ONG donation history', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [fetchData])
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const formatDateFull = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const generatePDF = async () => {
    if (donations.length === 0) {
      Alert.alert('Sem dados', 'Não há doações para exportar.');
      return;
    }

    setIsExporting(true);
    try {
      const today = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      const donationRows = (donations as any[]).map((donation: any, index: number) => {
        const method = donation.payment_method === 'pix'
          ? 'PIX'
          : donation.payment_method === 'cartao'
          ? 'Cartão'
          : donation.payment_method?.toUpperCase() || 'PIX';

        const rowBg = index % 2 === 0 ? '#f8faf9' : '#ffffff';

        return `
          <tr style="background-color: ${rowBg};">
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; color: #404943; font-size: 13px;">
              ${formatDateFull(donation.created_at)}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; color: #191c1d; font-size: 13px; font-weight: 600;">
              ${donation.campaign_title || '—'}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; color: #404943; font-size: 13px;">
              ${donation.donor_name || 'Anônimo'}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; text-align: center;">
              <span style="
                background-color: ${donation.payment_method === 'pix' ? '#fff8e1' : '#e3f2fd'};
                color: ${donation.payment_method === 'pix' ? '#5a4400' : '#0d47a1'};
                padding: 3px 10px;
                border-radius: 999px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
              ">${method}</span>
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; color: #0f5238; font-size: 13px; font-weight: 700; text-align: right;">
              ${formatCurrency(parseFloat(donation.amount))}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e8ede9; color: #707973; font-size: 11px; font-family: monospace;">
              ${donation.transaction_id || '—'}
            </td>
          </tr>
        `;
      }).join('');

      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Extrato de Doações — All Ong's</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
              background: #ffffff;
              color: #191c1d;
              padding: 40px;
            }
            .header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-bottom: 40px;
              padding-bottom: 32px;
              border-bottom: 2px solid #0f5238;
            }
            .logo-area h1 {
              font-size: 28px;
              font-weight: 800;
              color: #0f5238;
              letter-spacing: -0.5px;
            }
            .logo-area p {
              font-size: 13px;
              color: #707973;
              margin-top: 4px;
            }
            .meta-area {
              text-align: right;
            }
            .meta-area .badge {
              display: inline-block;
              background: #0f5238;
              color: white;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
              padding: 4px 12px;
              border-radius: 999px;
              margin-bottom: 8px;
            }
            .meta-area p {
              font-size: 12px;
              color: #707973;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 40px;
            }
            .stat-card {
              background: #f1f5f2;
              border-radius: 16px;
              padding: 20px;
              border-left: 4px solid #0f5238;
            }
            .stat-card .label {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #0f5238;
              margin-bottom: 8px;
            }
            .stat-card .value {
              font-size: 22px;
              font-weight: 800;
              color: #191c1d;
            }
            .stat-card .sub {
              font-size: 11px;
              color: #707973;
              margin-top: 4px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #191c1d;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .section-title::before {
              content: '';
              display: inline-block;
              width: 4px;
              height: 18px;
              background: #0f5238;
              border-radius: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 1px 4px rgba(0,0,0,0.06);
            }
            thead {
              background: #0f5238;
            }
            thead th {
              padding: 14px 16px;
              text-align: left;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              color: rgba(255,255,255,0.9);
            }
            thead th:last-child { text-align: right; }
            .footer {
              margin-top: 40px;
              padding-top: 24px;
              border-top: 1px solid #e8ede9;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .footer p {
              font-size: 11px;
              color: #bfc9c1;
            }
            .footer .total-box {
              background: #0f5238;
              color: white;
              padding: 12px 24px;
              border-radius: 12px;
              text-align: right;
            }
            .footer .total-box .total-label {
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 1px;
              text-transform: uppercase;
              opacity: 0.8;
            }
            .footer .total-box .total-value {
              font-size: 20px;
              font-weight: 800;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-area">
              <h1>All Ong's</h1>
              <p>Extrato Oficial de Doações Recebidas</p>
            </div>
            <div class="meta-area">
              <div class="badge">Documento Oficial</div>
              <p>Gerado em ${today}</p>
              <p style="margin-top: 4px; font-weight: 600; color: #404943;">${donations.length} transações</p>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="label">Total Arrecadado</div>
              <div class="value">${stats ? formatCurrency(stats.total_raised) : 'R$ 0,00'}</div>
              <div class="sub">Soma de todas as doações</div>
            </div>
            <div class="stat-card" style="border-left-color: #2b6485;">
              <div class="label" style="color: #2b6485;">Total de Doações</div>
              <div class="value">${stats?.donation_count || 0}</div>
              <div class="sub">Transações recebidas</div>
            </div>
            <div class="stat-card" style="border-left-color: #5a4400;">
              <div class="label" style="color: #5a4400;">Campanhas Ativas</div>
              <div class="value">${stats?.campaign_count || 0}</div>
              <div class="sub">${stats?.active_donors || 0} apoiadores únicos</div>
            </div>
          </div>

          <div class="section-title">Histórico Completo de Doações</div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Campanha</th>
                <th>Doador</th>
                <th style="text-align: center;">Método</th>
                <th style="text-align: right;">Valor</th>
                <th>Transação</th>
              </tr>
            </thead>
            <tbody>
              ${donationRows}
            </tbody>
          </table>

          <div class="footer">
            <p>All Ong's · Plataforma de doações · Documento gerado automaticamente</p>
            <div class="total-box">
              <div class="total-label">Total Geral</div>
              <div class="total-value">${stats ? formatCurrency(stats.total_raised) : 'R$ 0,00'}</div>
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
          dialogTitle: 'Exportar Extrato de Doações',
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

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between z-50 bg-[#f8f9fa]/70">
        <Text className="text-3xl font-headline-bold tracking-tight text-primary">All Ong's</Text>

        {/* Botão Exportar PDF */}
        {!isLoading && donations.length > 0 && (
          <TouchableOpacity
            onPress={generatePDF}
            disabled={isExporting}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: isExporting ? '#bfc9c1' : '#0f5238',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
            )}
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
              {isExporting ? 'Gerando...' : 'Exportar PDF'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>

        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <View className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={['#0f5238', '#2d6a4f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 32, position: 'relative' }}
            >
              <View className="z-10">
                <Text 
                  className="font-headline-extrabold text-white mb-2 tracking-tight" 
                  style={{ fontSize: 32 }}
                  adjustsFontSizeToFit 
                  numberOfLines={1} 
                  minimumFontScale={0.7}
                >
                  Doações Recebidas.
                </Text>
                <Text className="text-sm mb-6" style={{ color: 'rgba(168, 231, 197, 0.8)', lineHeight: 20 }}>
                  {stats
                    ? `Sua ONG recebeu ${stats.donation_count} doações de ${stats.active_donors} apoiadores.`
                    : 'Carregando dados...'}
                </Text>

                {/* Mini stats */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <View style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, borderRadius: 16, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', marginRight: 6 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', width: '100%' }} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
                      {stats?.donation_count || 0}
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.8)', marginTop: 4, textAlign: 'center', width: '100%' }} numberOfLines={1} adjustsFontSizeToFit>
                      Doações
                    </Text>
                  </View>
                  <View style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, borderRadius: 16, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', marginLeft: 6 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', width: '100%' }} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
                      {donations ? new Set(donations.map((d: any) => d.campaign_title).filter(Boolean)).size : 0}
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.8)', marginTop: 4, textAlign: 'center', width: '100%' }} numberOfLines={1} adjustsFontSizeToFit>
                      Campanhas
                    </Text>
                  </View>
                </View>
              </View>

              {/* Decorative blurs */}
              <View className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <View className="absolute top-0 left-1/4 w-32 h-32 rounded-full" style={{ backgroundColor: 'rgba(177,240,206,0.1)' }} />
            </LinearGradient>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0f5238" className="mt-10" />
        ) : (
          <>
            {/* Bento Stats — dois cards iguais */}
            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 24 }}>

              {/* Card Total Arrecadado */}
              <View style={{ flex: 1, backgroundColor: '#f1f5f2', borderRadius: 20, padding: 24, minHeight: 150, marginRight: 8 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#b1f0ce', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <MaterialIcons name="volunteer-activism" size={20} color="#0f5238" />
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: '#0f5238', marginBottom: 6 }} adjustsFontSizeToFit numberOfLines={1}>
                  Total Arrecadado
                </Text>
                <View style={{ width: '100%', overflow: 'hidden' }}>
                  <Text
                    style={{ fontSize: 24, fontWeight: '800', color: '#191c1d' }}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    minimumFontScale={0.4}
                  >
                    {stats ? formatCurrency(stats.total_raised) : 'R$ 0,00'}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#707973', marginTop: 6 }} adjustsFontSizeToFit numberOfLines={1}>
                  {stats?.donation_count || 0} doações
                </Text>
              </View>

              {/* Card Campanha Top */}
              <View style={{ flex: 1, backgroundColor: 'rgba(163, 216, 254, 0.35)', borderRadius: 20, padding: 24, minHeight: 150, marginLeft: 8 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#2b6485', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <MaterialIcons name="trending-up" size={20} color="#fff" />
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: '#2b6485', marginBottom: 6 }} adjustsFontSizeToFit numberOfLines={1}>
                  Campanha Top
                </Text>
                {topCampaign ? (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a3f55', lineHeight: 18 }} numberOfLines={2}>
                      {topCampaign.title}
                    </Text>
                    <View style={{ width: '100%', overflow: 'hidden', marginTop: 6 }}>
                      <Text
                        style={{ fontSize: 18, fontWeight: '800', color: '#2b6485' }}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        minimumFontScale={0.4}
                      >
                        {formatCurrency(parseFloat(topCampaign.raised_amount))}
                      </Text>
                    </View>
                    <View style={{ width: '100%', height: 4, backgroundColor: 'rgba(43,100,133,0.2)', borderRadius: 2, marginTop: 8 }}>
                      <View style={{ height: 4, backgroundColor: '#2b6485', borderRadius: 2, width: `${Math.min(topCampaign.percentage_complete || 0, 100)}%` }} />
                    </View>
                  </>
                ) : (
                  <Text style={{ fontSize: 12, color: '#255f80', opacity: 0.6 }}>Nenhuma campanha ainda</Text>
                )}
              </View>

            </View>

            {/* Timeline Header */}
            <View style={{ marginHorizontal: 20, marginBottom: 16 }} className="flex-row items-center gap-3">
              <MaterialIcons name="history" size={24} color="#0f5238" />
              <Text className="text-2xl font-headline-bold text-on-surface">Histórico de Doações</Text>
            </View>

            {/* Timeline */}
            {donations.length === 0 ? (
              <View style={{ marginHorizontal: 20 }} className="bg-surface-container-lowest p-8 rounded-2xl items-center border border-outline-variant/10">
                <Text className="text-4xl mb-4">💰</Text>
                <Text className="text-on-surface font-headline-bold text-lg mb-2">Nenhuma doação recebida</Text>
                <Text className="text-on-surface-variant font-body text-center">
                  Quando doadores apoiarem suas campanhas, as doações aparecerão aqui.
                </Text>
              </View>
            ) : (
              <View style={{ paddingBottom: 8 }}>
                {/* Linha vertical */}
                <View
                  style={{
                    position: 'absolute',
                    left: 20 + 20 - 1,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'rgba(191, 201, 193, 0.35)',
                  }}
                />

                {(donations as any[]).map((donation: any, index: number) => (
                  <View key={donation.id} style={{ flexDirection: 'row', marginBottom: 16, paddingHorizontal: 20 }}>
                    {/* Dot */}
                    <View style={{ width: 40, alignItems: 'center', paddingTop: 18 }}>
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: '#fff',
                          borderWidth: 3,
                          borderColor: index < 2 ? '#0f5238' : '#bfc9c1',
                        }}
                      />
                    </View>

                    {/* Card — ocupa todo o espaço restante */}
                    <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                      {/* Accent bar */}
                      <View style={{ height: 3, backgroundColor: index < 2 ? '#0f5238' : '#e8ede9' }} />
                      <View style={{ padding: 20 }}>
                        {/* Data + Valor */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: index < 2 ? '#0f5238' : '#707973', marginBottom: 4 }}>
                              {formatDate(donation.created_at)}
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '800', color: '#191c1d', lineHeight: 20 }} numberOfLines={2}>
                              {donation.campaign_title || 'Campanha'}
                            </Text>
                          </View>
                          <View style={{ flex: 1, alignItems: 'flex-end', overflow: 'hidden' }}>
                            <Text
                              style={{ fontSize: 16, fontWeight: '800', color: index < 2 ? '#0f5238' : '#191c1d', textAlign: 'right' }}
                              adjustsFontSizeToFit
                              numberOfLines={1}
                              minimumFontScale={0.4}
                            >
                              {formatCurrency(parseFloat(donation.amount))}
                            </Text>
                          </View>
                        </View>

                        {/* Doador */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(191,201,193,0.15)', marginBottom: 10 }}>
                          <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: index % 2 === 0 ? '#b1f0ce' : '#c7e7ff', flexShrink: 0 }}>
                            <MaterialIcons name="person" size={13} color={index % 2 === 0 ? '#0f5238' : '#2b6485'} />
                          </View>
                          <Text style={{ fontSize: 13, color: '#707973', marginLeft: 8, flex: 1 }} numberOfLines={1}>
                            {donation.donor_name || 'Doador Anônimo'}
                          </Text>
                        </View>

                        {/* Tags */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          <View style={{ backgroundColor: '#d4edda', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: '#0e5138', letterSpacing: 0.3 }}>
                              {donation.campaign_category || 'Geral'}
                            </Text>
                          </View>
                          <View style={{ backgroundColor: donation.payment_method === 'pix' ? '#ffdf96' : '#c7e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: donation.payment_method === 'pix' ? '#251a00' : '#001e2e', letterSpacing: 0.3 }}>
                              {donation.payment_method === 'pix' ? 'PIX' : donation.payment_method === 'cartao' ? 'Cartão' : donation.payment_method?.toUpperCase() || 'PIX'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
