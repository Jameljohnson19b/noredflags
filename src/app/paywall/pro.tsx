import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView, Linking } from 'react-native';
import { Colors } from '../../constants/colors';
import { RevenueCatService } from '../../lib/purchases/revenueCat';
import { router } from 'expo-router';
import { auth } from '../../lib/firebase';

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

  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser && !auth.currentUser.isAnonymous);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user && !user.isAnonymous);
    });
    return unsubscribe;
  }, []);

  const handleSocialSignIn = async (provider: 'apple' | 'google') => {
    const { signInAnonymously } = require('firebase/auth');
    setLoading(true);
    try {
      // FOR SIMULATOR TESTING: 
      // We first try using real Firebase Auth.
      console.log(`Simulating Secure Auth with ${provider}...`);
      await signInAnonymously(auth);
    } catch (e: any) {
      console.warn("Cloud Auth Simulation Blocked. Forcing Local Dev Session...", e.message);
      
      // FALLBACK: 
      // If the project doesn't have Anonymous Sign-In enabled, we manually
      // force the UI into the 'Authenticated' state so the pricing plans show up.
      setIsAuthenticated(true);
      
      // We'll also tell the Lens to use a dev UID if the real user is still null later.
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: any) => {
    setLoading(true);
    try {
      await finalizePurchase(pkg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finalizePurchase = async (pkg: any) => {
    const result = await RevenueCatService.purchasePackage(pkg);
    if (result.success) {
      Alert.alert("Welcome to Pro", "Your dating intelligence is now officially unlocked.");
      router.replace('/onboarding'); // Funnel directly into the Relationship Lens
    } else if (result.error) {
      Alert.alert("Purchase Failed", result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {!isAuthenticated ? (
          <View style={styles.authSection}>
            <Text style={styles.title}>SECURE YOUR INTEL</Text>
            <Text style={styles.subtitle}>Sign in with Apple or Google to unlock your reports and start your trial.</Text>
            
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.authButton} onPress={() => handleSocialSignIn('apple')}>
                <Text style={styles.authButtonText}> Continue with Apple</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.authButton, styles.googleButton]} onPress={() => handleSocialSignIn('google')}>
                <Text style={styles.googleButtonText}>G Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>CHOOSE YOUR DEPTH</Text>
              <Text style={styles.subtitle}>Unlock your 3-day free trial on any plan.</Text>
            </View>

            <View style={styles.pricingSection}>
              {/* CORE TIER */}
              <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'core_weekly' })} disabled={loading}>
                <Text style={styles.masterButtonText}>3-Day Trial then $2.99 per week</Text>
                <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'core_yearly' })} disabled={loading}>
                <Text style={styles.masterButtonText}>$29.99 per year</Text>
                <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
              </TouchableOpacity>

              {/* PRO TIER */}
              <Text style={styles.tierHeader}>PRO:</Text>
              
              <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'pro_monthly' })} disabled={loading}>
                <Text style={styles.masterButtonText}>3-Day Trial then $9.99 per month</Text>
                <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.masterButton, styles.masterButtonFeatured]} onPress={() => handlePurchase({ id: 'pro_yearly' })} disabled={loading}>
                <Text style={[styles.masterButtonText, { color: '#000' }]}>$49.99 per year</Text>
                <View style={[styles.selectBadge, { backgroundColor: '#000' }]}><Text style={[styles.selectText, { color: '#fff' }]}>SELECT</Text></View>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink} onPress={() => RevenueCatService.restorePurchases()}>
            <Text style={styles.footerLinkText}>Restore Purchases</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerLink} onPress={() => Linking.openURL('https://noredflags.xyz/privacy')}>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
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
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  pricingSection: {
    marginTop: 40,
    gap: 8,
  },
  tierHeader: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },
  masterButton: {
    backgroundColor: '#111',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  masterButtonFeatured: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  masterButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'left',
  },
  selectBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  selectText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  authSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  authButtons: {
    width: '100%',
    gap: 16,
    marginTop: 40,
  },
  authButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  authButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 40,
  },
  footerLink: {
    padding: 8,
  },
  footerLinkText: {
    color: '#555',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  legal: {
    color: '#333',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
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
