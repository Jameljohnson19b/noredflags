import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { RevenueCatService } from '../../lib/purchases/revenueCat';
import { router } from 'expo-router';

export default function ProPaywallScreen() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [offering, setOffering] = useState<any>(null);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const currentOffering = await RevenueCatService.fetchOfferings();
      setOffering(currentOffering);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handlePurchase = async (pkg: any) => {
    setLoading(true);
    try {
      const result = await RevenueCatService.purchasePackage(pkg);
      if (result.success) {
        Alert.alert("Welcome to Pro", "Your dating intelligence is now officially unlocked.");
        router.replace('/');
      } else if (result.error) {
        Alert.alert("Purchase Failed", result.error);
      }
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
          <Text style={styles.title}>PRO ANALYTICS</Text>
          <Text style={styles.subtitle}>Stop guessing. Start knowing.</Text>
        </View>

        <View style={styles.perksList}>
          <View style={styles.perk}>
            <Text style={styles.perkIcon}>🧠</Text>
            <View>
              <Text style={styles.perkTitle}>Deep Psychology Read</Text>
              <Text style={styles.perkDesc}>Full AI breakdown of attachment styles and risk patterns.</Text>
            </View>
          </View>
          
          <View style={styles.perk}>
            <Text style={styles.perkIcon}>🎯</Text>
            <View>
              <Text style={styles.perkTitle}>Custom Relationship Lens</Text>
              <Text style={styles.perkDesc}>Map every signal to your personal dealbreakers.</Text>
            </View>
          </View>

          <View style={styles.perk}>
            <Text style={styles.perkIcon}>🛡️</Text>
            <View>
              <Text style={styles.perkTitle}>Unlimited Signals</Text>
              <Text style={styles.perkDesc}>Scan every text, DM, and prompt with zero limits.</Text>
            </View>
          </View>
        </View>

        {fetching ? (
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.pricingContainer}>
            {offering?.availablePackages.map((pkg: any) => (
              <TouchableOpacity 
                key={pkg.identifier} 
                style={styles.packageCard}
                onPress={() => handlePurchase(pkg)}
                disabled={loading}
              >
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>{pkg.product.title.split(' (')[0]}</Text>
                  <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                </View>
                <View style={styles.buyBadge}>
                  <Text style={styles.buyText}>{loading ? '...' : 'SELECT'}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Mock layout if no packages found during sandbox sync */}
            {!offering && (
               <TouchableOpacity style={styles.packageCard} onPress={() => Alert.alert("Connect Store", "Please configure RevenueCat keys for sandbox testing.")}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>Monthly Pro</Text>
                  <Text style={styles.packagePrice}>$9.99/mo</Text>
                </View>
                <View style={styles.buyBadge}>
                  <Text style={styles.buyText}>ACTIVATE</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.footerLink} onPress={() => RevenueCatService.restorePurchases()}>
           <Text style={styles.footerLinkText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          Subscriptions will be charged to your App Store account. You can cancel at any time in your iCloud settings.
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
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    color: '#555',
    fontSize: 18,
    fontWeight: '600',
  },
  perksList: {
    gap: 32,
    marginBottom: 60,
  },
  perk: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  perkIcon: {
    fontSize: 32,
  },
  perkTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  perkDesc: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
    maxWidth: 250,
  },
  pricingContainer: {
    gap: 12,
  },
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  packagePrice: {
    color: '#000',
    fontSize: 24,
    fontWeight: '900',
  },
  buyBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 99,
  },
  buyText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  footerLink: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerLinkText: {
    color: '#555',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  legal: {
    color: '#333',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  }
});
