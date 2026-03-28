import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Image, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const isWeb = Platform.OS === 'web';

// DYNAMIC MODULATOR COMPONENT: Shows the core mechanic
const SignalSystemDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const colorAnim = useRef(new Animated.Value(0)).current; // 0: Neutral, 1: Orange, 2: Yellow, 3: Red

  const steps = [
    { text: "Searching...", color: '#222', label: "WAITING FOR SIGNAL" },
    { text: "\"I have 6 kids and 3 ex-wives.\"", color: '#F97316', label: "🟠 CAUTION: HIGH COMPLEXITY" },
    { text: "\"I've held my current job for 12 years.\"", color: '#EAB308', label: "🟡 OFFSET: STABILITY DETECTED" },
    { text: "\"I just got indicted for federal fraud.\"", color: '#EF4444', label: "🔴 MAX RISK: LEGAL COMPROMISE" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: currentStep,
      duration: 800,
      useNativeDriver: false
    }).start();
  }, [currentStep]);

  const bgColor = colorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#111111', '#F9731633', '#EAB30833', '#EF444433']
  });

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#333', '#F97316', '#EAB308', '#EF4444']
  });

  return (
    <Animated.View style={[styles.demoContainer, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <Text style={styles.demoLabel}>{steps[currentStep].label}</Text>
      <Text style={styles.demoText}>{steps[currentStep].text}</Text>
      <View style={styles.demoWaveform}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={[styles.waveBar, { height: 10 + (Math.random() * 30), backgroundColor: steps[currentStep].color }]} />
        ))}
      </View>
    </Animated.View>
  );
};

export default function LandingPage() {
  const openAppStore = () => Linking.openURL('https://apps.apple.com/app/noredflags');
  const openPlayStore = () => Linking.openURL('https://play.google.com/store/apps/details?id=com.noredflags');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Navbar Section */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <View style={styles.nav}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={require('../../assets/images/logo.png')} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
            <Text style={styles.navLogo}>NOREDFLAGS</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {!isWeb && (
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                <Text style={styles.navLogin}>Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </div>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroSuper}>KNOW BEFORE YOU GO BACK.</Text>
        <Text style={styles.heroTitle}>YOU SEE THE</Text>
        <Text style={styles.heroTitleOutlined}>SIGNS.</Text>

        <Text style={styles.heroDescription}>
          Capture what they said. Watch the signals change in real-time. NOREDFLAGS uses Personalized AI to reveal the psychological gaps you're prone to missing.
        </Text>

        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={isWeb ? openAppStore : () => router.push('/onboarding')}>
            <Text style={styles.primaryButtonText}>Try It Free</Text>
          </TouchableOpacity>
        </View>

        {isWeb && (
          <View style={styles.webDownloadRow}>
            <TouchableOpacity style={styles.storeBadge} onPress={openAppStore}>
              <Text style={styles.storeBadgeIcon}></Text>
              <View>
                <Text style={styles.storeBadgeSub}>Download on the</Text>
                <Text style={styles.storeBadgeMain}>App Store</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeBadge} onPress={openPlayStore}>
              <Text style={styles.storeBadgeIcon}>▶</Text>
              <View>
                <Text style={styles.storeBadgeSub}>Get it on</Text>
                <Text style={styles.storeBadgeMain}>Google Play</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* CORE MECHANIC DEMO */}
      <Text style={styles.sectionHeader}>REAL-TIME SIGNAL MODULATION</Text>
      <SignalSystemDemo />

      {/* PROBLEM & FIX INFO SECTION */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>THE PROBLEM</Text>
          <Text style={styles.infoTitle}>Dating is noisy.</Text>
          <Text style={styles.infoBody}>
            Modern apps offer volume, not clarity. We spend hours decoding screenshots with friends, often ignoring the red flags right in front of us.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>THE FIX</Text>
          <Text style={styles.infoTitle}>Signal Intelligence.</Text>
          <Text style={styles.infoBody}>
            NOREDFLAGS converts fragmented input into structured risk signals. It’s a second brain for your intuition that maps their words to your personal standard.
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <Text style={styles.footerLogo}>NOREDFLAGS</Text>
          <Text style={styles.footerMotto}>Capture what was said. Reveal what it might mean.</Text>
        </View>

        <View style={styles.footerLinksRow}>
          <TouchableOpacity><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/support')}><Text style={styles.footerLink}>Support</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://x.com/noredflags_app')}><Text style={styles.footerLink}>Twitter</Text></TouchableOpacity>
        </View>

        <Text style={styles.footerCopyright}>© {new Date().getFullYear()} JEDI LLC. All rights reserved.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 100,
    flexGrow: 1,
  },
  nav: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 40,
  },
  navLogo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  navLogin: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hero: {
    maxWidth: 900,
    width: '100%',
    alignItems: 'center',
    marginTop: isMobile ? 20 : 60,
    zIndex: 10,
    marginBottom: 60,
  },
  heroSuper: {
    color: '#EAB308',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: isMobile ? 54 : 96,
    fontWeight: '900',
    lineHeight: isMobile ? 60 : 100,
    letterSpacing: -2,
    textAlign: 'center',
  },
  heroTitleOutlined: {
    color: 'transparent',
    fontSize: isMobile ? 54 : 96,
    fontWeight: '900',
    lineHeight: isMobile ? 60 : 100,
    letterSpacing: -2,
    textAlign: 'center',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    marginBottom: 24,
  },
  heroDescription: {
    color: '#888888',
    fontSize: isMobile ? 18 : 22,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'center',
    maxWidth: 700,
    marginBottom: 48,
  },
  ctaContainer: {
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 22,
    paddingHorizontal: 64,
    borderRadius: 999,
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '900',
  },
  webDownloadRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 16,
    alignItems: 'center',
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 200,
  },
  storeBadgeIcon: {
    color: '#fff',
    fontSize: 32,
    marginRight: 12,
  },
  storeBadgeSub: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  storeBadgeMain: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionHeader: {
    color: '#555',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 24,
    marginTop: 40,
  },
  demoContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 32,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 80,
  },
  demoLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 1,
  },
  demoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 32,
    minHeight: 64,
  },
  demoWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  infoSection: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: isMobile ? 'column' : 'row',
    gap: 48,
    marginTop: 40,
    paddingTop: 80,
    borderTopWidth: 1,
    borderColor: '#222',
  },
  infoBlock: {
    flex: 1,
    alignItems: isMobile ? 'center' : 'flex-start',
  },
  infoLabel: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: isMobile ? 'center' : 'left',
  },
  infoBody: {
    color: '#888',
    fontSize: 18,
    lineHeight: 28,
    textAlign: isMobile ? 'center' : 'left',
  },
  footer: {
    marginTop: 120,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#222',
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerBrand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerLogo: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  footerMotto: {
    color: '#555',
    fontSize: 16,
    marginTop: 8,
  },
  footerLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 40,
  },
  footerLink: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  footerCopyright: {
    color: '#333',
    fontSize: 12,
  }
});
