import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView, Linking } from 'react-native';
import { Colors } from '../../constants/colors';
import { RevenueCatService } from '../../lib/purchases/revenueCat';
import { router } from 'expo-router';
import { auth, db } from '../../lib/firebase';
import { signOut, signInWithCredential, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LensService } from '../../lib/onboarding/lensService';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function ProPaywallScreen() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [offering, setOffering] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser && !auth.currentUser.isAnonymous);
  const [userEmail, setUserEmail] = useState<string | null>(auth.currentUser?.email || null);

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '606183804439-4fshjefn9ev5h8iu8935int44e9aevc9.apps.googleusercontent.com',
    webClientId: '606183804439-4fshjefn9ev5h8iu8935int44e9aevc9.apps.googleusercontent.com',
    responseType: 'id_token',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'com.googleusercontent.apps.606183804439-4fshjefn9ev5h8iu8935int44e9aevc9',
    }),
  });

  useEffect(() => {
    loadOfferings();
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      const isAuth = !!user && !user.isAnonymous;
      setIsAuthenticated(isAuth);
      setUserEmail(user?.email || null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          setIsAuthenticated(true);
          // FLOW FIX: Stay on paywall after login as requested
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert("Google Auth Error", e.message);
        });
    }
  }, [response]);

  const loadOfferings = async () => {
    try {
      // In production we'd fetch from RevenueCat
      setFetching(false);
    } catch (e) {
      setFetching(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed Out", "You have been logged out.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSocialSignIn = async (provider: 'apple' | 'google') => {
    if (provider === 'google') {
      if (request) {
        promptAsync();
      } else {
        Alert.alert("Error", "Google Auth is not ready.");
      }
      return;
    }

    setLoading(true);
    try {
      const appleResult = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleResult;
      if (identityToken) {
        const provider = new OAuthProvider('apple.com');
        const credential = provider.credential({ idToken: identityToken });
        await signInWithCredential(auth, credential);
        setIsAuthenticated(true);
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        console.error("Auth Failure:", e);
        Alert.alert("Authentication Error", e.message || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: any) => {
    if (!isAuthenticated) {
      Alert.alert("Authentication Required", "Please sign in with Apple, Google, or Email below to secure your subscription before purchasing.");
      return;
    }

    setLoading(true);
    try {
      const result = await RevenueCatService.purchasePackage(pkg);
      if (result.success) {
        Alert.alert("Welcome to Pro", "Your dating intelligence is now officially unlocked.");
        // After purchase, move to Lens setup.
        router.replace('/onboarding');
      } else if (result.error) {
        Alert.alert("Purchase Failed", result.error);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "An unexpected error occurred during purchase.");
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
          <Text style={styles.title}>CHOOSE YOUR DEPTH</Text>
          <Text style={styles.subtitle}>Unlock your 3-day free trial on any plan.</Text>
          
          {isAuthenticated && (
            <View style={styles.loggedInIndicator}>
              <Text style={styles.loggedInText}>Signed in as: <Text style={{fontWeight: '900'}}>{userEmail || 'User'}</Text></Text>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.signOutLink}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.tierHeader}>CORE:</Text>
          <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'core_weekly' })} disabled={loading}>
            <View style={{ flex: 1 }}>
              <Text style={styles.masterButtonText}>3-Day Trial then $2.99 / week</Text>
              <Text style={styles.planSub}>Track 3 people simultaneously.</Text>
            </View>
            <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'core_yearly' })} disabled={loading}>
            <View style={{ flex: 1 }}>
              <Text style={styles.masterButtonText}>$29.99 per year</Text>
              <Text style={styles.planSub}>Lock in the lowest annual rate.</Text>
            </View>
            <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
          </TouchableOpacity>

          <Text style={styles.tierHeader}>PRO:</Text>
          <TouchableOpacity style={styles.masterButton} onPress={() => handlePurchase({ id: 'pro_monthly' })} disabled={loading}>
            <View style={{ flex: 1 }}>
              <Text style={styles.masterButtonText}>3-Day Trial then $9.99 / month</Text>
              <Text style={styles.planSub}>Track 10 people + Advanced Patterns.</Text>
            </View>
            <View style={styles.selectBadge}><Text style={styles.selectText}>SELECT</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.masterButton, styles.masterButtonFeatured]} onPress={() => handlePurchase({ id: 'pro_yearly' })} disabled={loading}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.masterButtonText, { color: '#000' }]}>$49.99 per year</Text>
              <Text style={[styles.planSub, { color: '#444' }]}>Unlimited Intelligence Access.</Text>
            </View>
            <View style={[styles.selectBadge, { backgroundColor: '#000' }]}><Text style={[styles.selectText, { color: '#fff' }]}>SELECT</Text></View>
          </TouchableOpacity>
        </View>

        {!isAuthenticated && (
          <View style={styles.authSection}>
            <Text style={[styles.title, { fontSize: 24, marginTop: 40 }]}>SECURE YOUR ACCOUNT</Text>
            <Text style={styles.subtitle}>Sign in to lock in your subscription.</Text>
            
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.authButton} onPress={() => handleSocialSignIn('apple')}>
                <Text style={styles.authButtonText}> Sign in with Apple</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.authButton, styles.googleButton]} onPress={() => handleSocialSignIn('google')}>
                <Text style={styles.googleButtonText}>G Sign in with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{ marginTop: 12 }} onPress={() => router.push('/(auth)/sign-in')}>
                <Text style={{ color: '#888', textDecorationLine: 'underline' }}>Already have an account? Log in with Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink} onPress={() => RevenueCatService.restorePurchases()}>
            <Text style={styles.footerLinkText}>Restore Purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/terms' as any)}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/privacy' as any)}>
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
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 24, paddingTop: 40 },
  closeButton: { alignSelf: 'flex-end', width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  header: { marginTop: 20, marginBottom: 40, alignItems: 'center' },
  title: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#888', fontSize: 16, fontWeight: '600', marginTop: 8 },
  loggedInIndicator: { marginTop: 16, alignItems: 'center', backgroundColor: '#111', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  loggedInText: { color: '#888', fontSize: 13, marginBottom: 4 },
  signOutLink: { color: '#EF4444', fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' },
  pricingSection: { marginTop: 40, gap: 8 },
  tierHeader: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 24, marginBottom: 12 },
  masterButton: { backgroundColor: '#111', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  masterButtonFeatured: { backgroundColor: '#fff', borderColor: '#fff' },
  masterButtonText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: -0.5, flex: 1, textAlign: 'left' },
  selectBadge: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginLeft: 12 },
  selectText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  authSection: { marginTop: 60, alignItems: 'center' },
  authButtons: { width: '100%', gap: 16, marginTop: 40 },
  authButton: { backgroundColor: '#fff', paddingVertical: 18, borderRadius: 16, alignItems: 'center', width: '100%' },
  authButtonText: { color: '#000', fontSize: 16, fontWeight: '900' },
  googleButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333' },
  googleButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 40 },
  footerLink: { padding: 8 },
  footerLinkText: { color: '#555', fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline' },
  planSub: { color: '#666', fontSize: 12, fontWeight: '600', marginTop: 4 },
  legal: { color: '#333', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 100 }
});
