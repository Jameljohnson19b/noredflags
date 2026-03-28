import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { RevenueCatService } from '../../lib/purchases/revenueCat';
import { router } from 'expo-router';

export default function CorePaywallScreen() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkgId: string) => {
    setLoading(true);
    try {
      // Mock logic for core until RC syncs packages
      Alert.alert("Subscription Started", "Core tier features unlocked.");
      router.replace('/');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>CORE</Text>
          <Text style={styles.subtitle}>Don't second guess what you already felt.</Text>
        </View>

        <View style={styles.pricingItem}>
          <View style={styles.pricingHeader}>
             <Text style={styles.pricingName}>Weekly Core</Text>
             <Text style={styles.pricingAmt}>$2.99<Text style={styles.pricingInterval}>/wk</Text></Text>
          </View>
          <Text style={styles.pricingDesc}>Full real-time risk scoring and green/red signal mapping.</Text>
          <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase('weekly_core')}>
            <Text style={styles.buyButtonText}>GET CORE NOW</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pricingItem}>
          <View style={styles.pricingHeader}>
             <Text style={styles.pricingName}>Annual Core</Text>
             <Text style={styles.pricingAmt}>$29.99<Text style={styles.pricingInterval}>/yr</Text></Text>
          </View>
          <Text style={styles.pricingDesc}>Save 80% and keep your dating second-brain forever.</Text>
          <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase('annual_core')}>
            <Text style={styles.buyButtonText}>CHOOSE ANNUAL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.proUpgrade} onPress={() => router.push('/paywall/pro')}>
          <Text style={styles.proUpgradeText}>Wait, I want the full Psychology Read →</Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  closeText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    marginTop: 20,
    marginBottom: 60,
  },
  title: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -4,
  },
  subtitle: {
    color: '#888',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    marginTop: 8,
  },
  pricingItem: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    padding: 32,
    borderRadius: 24,
    marginBottom: 16,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  pricingName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  pricingAmt: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  pricingInterval: {
    fontSize: 14,
    color: '#444',
  },
  pricingDesc: {
    color: '#666',
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  buyButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 99,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
  proUpgrade: {
    marginTop: 40,
    alignItems: 'center',
  },
  proUpgradeText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  }
});
