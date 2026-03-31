import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { RevenueCatService } from '../../lib/purchases/revenueCat';
import { router } from 'expo-router';
import { auth } from '../../lib/firebase';

export default function CorePaywallScreen() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkgId: string) => {
    setLoading(true);
    try {
      if (!auth.currentUser || auth.currentUser.isAnonymous) {
        Alert.alert(
          "Secure Subscription",
          "A permanent account (Apple or Google) is required to subscribe and start your core dating analysis.",
          [
            { text: "Log In or Sign Up", onPress: () => router.push('/(auth)/sign-in' as any) }
          ],
          { cancelable: false }
        );
        return;
      }

      await finalizePurchase(pkgId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finalizePurchase = async (pkgId: string) => {
    // Mock logic for core until RC syncs packages
    Alert.alert("Subscription Started", "Core tier features unlocked.");
    router.replace('/');
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

        <TouchableOpacity style={styles.proUpgrade} onPress={() => router.push('/paywall/pro' as any)}>
          <Text style={styles.proUpgradeText}>Wait, I want the full Psychology Read →</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink} onPress={() => RevenueCatService.restorePurchases()}>
            <Text style={styles.footerLinkText}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/terms' as any)}>
            <Text style={styles.footerLinkText}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/privacy' as any)}>
            <Text style={styles.footerLinkText}>Privacy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          Subscriptions start with a 3-day free trial. Your account will be charged after the trial ends. Cancel anytime.
        </Text>
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
    paddingBottom: 60,
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
    marginBottom: 60,
    alignItems: 'center',
  },
  proUpgradeText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 20,
  },
  footerLink: {
    padding: 4,
  },
  footerLinkText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  legal: {
    color: '#222',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  }
});
