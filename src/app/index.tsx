import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Image, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const isWeb = Platform.OS === 'web';

export default function LandingPage() {
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2500, useNativeDriver: isWeb ? false : true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: isWeb ? false : true })
      ])
    ).start();
  }, [floatAnim]);

  const floatStyle = {
    transform: [{
      translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] })
    }]
  };

  const openAppStore = () => {
    Linking.openURL('https://apps.apple.com/app/redflags');
  };

  const openPlayStore = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.noredflags');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Navbar Section */}
      <View style={styles.nav}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={require('../../assets/images/logo.png')} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
          <Text style={styles.navLogo}>REDFLAGS</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {!isWeb && (
            <TouchableOpacity onPress={() => router.push('/paywall/pro')} style={styles.navProLink}>
              <Text style={styles.navProText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.navLogin}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroSuper}>Stop wasting time.</Text>
        <Text style={styles.heroTitle}>KNOW EXACTLY</Text>
        <Text style={styles.heroTitleOutlined}>WHO THEY ARE.</Text>
        
        <Text style={styles.heroDescription}>
          REDFLAGS is a real-time dating signal interpreter. We decode their texts, map their traits to your own Relationship Lens, and reveal what it might mean.
        </Text>

        {isWeb ? (
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
        ) : (
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/paywall/pro')}>
              <Text style={styles.primaryButtonText}>Build Your Filter Now</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

      {/* Floating Demo Elements */}
      <Animated.View style={[styles.floatingCard, styles.cardRed, floatStyle]}>
        <Text style={styles.floatingText}>"I'm not looking for anything serious rn but..."</Text>
        <View style={styles.badgeRed}><Text style={styles.badgeTextInverse}>🚩 RED FLAG: TIME WASTER</Text></View>
      </Animated.View>

      <Animated.View style={[styles.floatingCard, styles.cardGreen, floatStyle]}>
        <Text style={styles.floatingText}>"I bought us tickets to that band you mentioned!"</Text>
        <View style={styles.badgeGreen}><Text style={styles.badgeText}>🟢 GREEN FLAG: LISTENS</Text></View>
      </Animated.View>

      {/* COMPANY & PRODUCT INFO SECTION - High value for Web */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>THE PROBLEM</Text>
          <Text style={styles.infoTitle}>Dating is noisy.</Text>
          <Text style={styles.infoBody}>
            Modern dating apps offer volume, not clarity. We spend hours decoding screenshots with friends, often ignoring what's right in front of us.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>THE FIX</Text>
          <Text style={styles.infoTitle}>Signal Intelligence.</Text>
          <Text style={styles.infoBody}>
            REDFLAGS converts fragmented input into structured risk signals. It’s not just an analyzer; it’s a second brain for your intuition.
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <Text style={styles.footerLogo}>NOREDFLAGS</Text>
          <Text style={styles.footerMotto}>Real-time Emotional Intelligence.</Text>
        </View>

        <View style={styles.footerLinksRow}>
           <TouchableOpacity><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
           <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
           <TouchableOpacity onPress={() => router.push('/support')}><Text style={styles.footerLink}>Support & Contact</Text></TouchableOpacity>
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
  navProLink: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  navProText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: isMobile ? 18 : 24,
    fontWeight: '500',
    lineHeight: 32,
    textAlign: 'center',
    maxWidth: 700,
    marginBottom: 48,
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
    fontWeight: '600',
  },
  storeBadgeMain: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ctaContainer: {
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 999,
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
  },
  floatingCard: {
    marginTop: 40,
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  cardRed: {
    alignSelf: isMobile ? 'center' : 'flex-start',
    marginLeft: isMobile ? 0 : '10%',
  },
  cardGreen: {
    alignSelf: isMobile ? 'center' : 'flex-end',
    marginRight: isMobile ? 0 : '10%',
    marginTop: 20,
    marginBottom: 80,
  },
  floatingText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  badgeRed: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  badgeGreen: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  badgeTextInverse: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
  },
  infoSection: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: isMobile ? 'column' : 'row',
    gap: 48,
    marginTop: 80,
    paddingTop: 80,
    borderTopWidth: 1,
    borderColor: '#222',
  },
  infoBlock: {
    flex: 1,
    alignItems: isMobile ? 'center' : 'flex-start',
  },
  infoLabel: {
    color: Colors.maxRisk,
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
    color: Colors.textMuted,
    fontSize: 18,
    lineHeight: 28,
    textAlign: isMobile ? 'center' : 'left',
  },
  companySection: {
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
    marginTop: 120,
    padding: 48,
    backgroundColor: '#111',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#222',
  },
  companyLabel: {
    color: '#555',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 2,
  },
  companyTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 24,
    letterSpacing: -1,
  },
  companyDescription: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
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
