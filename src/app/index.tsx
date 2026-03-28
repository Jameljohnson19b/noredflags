import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Image, Linking } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function LandingPage() {
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
      ])
    ).start();
  }, [floatAnim]);

  const floatStyle = {
    transform: [{
      translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] })
    }]
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
          <TouchableOpacity onPress={() => router.push('/paywall/pro')} style={styles.navProLink}>
            <Text style={styles.navProText}>Upgrade to Pro</Text>
          </TouchableOpacity>
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
          The ultimate social intelligence tool. We decode their texts, map their traits to your own Relationship Lens, and tell you if it's a 🟢 Green Light or a 🔴 Red Flag.
        </Text>

        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.primaryButtonText}>Build Your Filter Now</Text>
          </TouchableOpacity>
        </View>

        {/* App Store Download Badges */}
        <View style={styles.appStoreRow}>
           <TouchableOpacity style={styles.storeBadge} onPress={() => Linking.openURL('https://apple.com/app-store')}>
             <Text style={styles.storeBadgeIcon}></Text>
             <View>
               <Text style={styles.storeBadgeSub}>Download on the</Text>
               <Text style={styles.storeBadgeMain}>App Store</Text>
             </View>
           </TouchableOpacity>

           <TouchableOpacity style={styles.storeBadge} onPress={() => Linking.openURL('https://play.google.com/store/games')}>
             <Text style={styles.storeBadgeIcon}>▶</Text>
             <View>
               <Text style={styles.storeBadgeSub}>GET IT ON</Text>
               <Text style={styles.storeBadgeMain}>Google Play</Text>
             </View>
           </TouchableOpacity>
        </View>
      </View>

      {/* Floating Demo Elements replicating gen-z dynamic layouts */}
      <Animated.View style={[styles.floatingCard, styles.cardRed, floatStyle]}>
        <Text style={styles.floatingText}>"I'm not looking for anything serious rn but..."</Text>
        <View style={styles.badgeRed}><Text style={styles.badgeTextInverse}>🚩 RED FLAG: TIME WASTER</Text></View>
      </Animated.View>

      <Animated.View style={[styles.floatingCard, styles.cardGreen, floatStyle]}>
        <Text style={styles.floatingText}>"I bought us tickets to that band you mentioned!"</Text>
        <View style={styles.badgeGreen}><Text style={styles.badgeText}>🟢 GREEN FLAG: LISTENS</Text></View>
      </Animated.View>

      {/* PAYWALL PRICING SECTION */}
      <View style={styles.pricingSection}>
        <Text style={styles.pricingSectionHeader}>UNLOCK YOUR DATING BRAIN</Text>
        <Text style={styles.pricingSectionDesc}>Get your first 3 days free. Then choose how deep you want to go.</Text>

        <View style={styles.plansContainer}>
            {/* CORE TIER */}
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>CORE</Text>
              <Text style={styles.planTagline}>Don't second guess what you already felt.</Text>
              <Text style={styles.planPrice}>$2.99<Text style={styles.planInterval}>/week</Text></Text>
              <Text style={styles.planSubPrice}>or $29.99/year</Text>
              
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>✓ Real-time risk scoring</Text>
                <Text style={styles.featureItem}>✓ Green/Red color mapping</Text>
                <Text style={styles.featureItem}>✓ Basic AI clarification</Text>
              </View>

              <TouchableOpacity style={styles.planButton} onPress={() => router.push('/paywall/core')}>
                <Text style={styles.planButtonText}>Get Core</Text>
              </TouchableOpacity>
            </View>

            {/* PRO TIER */}
            <View style={[styles.planCard, styles.planCardPro]}>
              <Text style={[styles.planTitle, styles.planTitlePro]}>PRO</Text>
              <Text style={[styles.planTagline, styles.planTaglinePro]}>Now let's break it down.</Text>
              <Text style={[styles.planPrice, styles.planPricePro]}>$9.99<Text style={styles.planIntervalPro}>/mo</Text></Text>
              <Text style={[styles.planSubPrice, styles.planSubPricePro]}>or $45.99/year</Text>
              
              <View style={styles.featureList}>
                <Text style={[styles.featureItem, styles.featureItemPro]}>✓ Everything in Core</Text>
                <Text style={[styles.featureItem, styles.featureItemPro]}>✓ Custom Relationship Lens setup</Text>
                <Text style={[styles.featureItem, styles.featureItemPro]}>✓ Advanced Psychological reporting</Text>
              </View>

              <TouchableOpacity style={[styles.planButton, styles.planButtonActionPro]} onPress={() => router.push('/paywall/pro')}>
                <Text style={styles.planButtonTextPro}>Unlock Pro Analytics</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* MASSIVE FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <Text style={styles.footerLogo}>REDFLAGS</Text>
          <Text style={styles.footerMotto}>Capture what was said. Reveal what it might mean.</Text>
        </View>

        <View style={styles.footerLinksRow}>
           <TouchableOpacity><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
           <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
           <TouchableOpacity onPress={() => router.push('/support')}><Text style={styles.footerLink}>Support & Contact</Text></TouchableOpacity>
           <TouchableOpacity><Text style={styles.footerLink}>Twitter</Text></TouchableOpacity>
           <TouchableOpacity><Text style={styles.footerLink}>Instagram</Text></TouchableOpacity>
        </View>

        <Text style={styles.footerCopyright}>© {new Date().getFullYear()} 19B PROJECTS. All rights reserved.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Wizz style stark dark mode
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 40,
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
    alignItems: isMobile ? 'flex-start' : 'center',
    marginTop: isMobile ? 20 : 60,
    zIndex: 10,
  },
  heroSuper: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: isMobile ? 54 : 96,
    fontWeight: '900',
    lineHeight: isMobile ? 60 : 100,
    letterSpacing: -2,
    textAlign: isMobile ? 'left' : 'center',
  },
  heroTitleOutlined: {
    color: 'transparent',
    fontSize: isMobile ? 54 : 96,
    fontWeight: '900',
    lineHeight: isMobile ? 60 : 100,
    letterSpacing: -2,
    textAlign: isMobile ? 'left' : 'center',
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
    textAlign: isMobile ? 'left' : 'center',
    maxWidth: 700,
    marginBottom: 48,
  },
  ctaContainer: {
    flexDirection: 'row',
    gap: 16,
    width: isMobile ? '100%' : 'auto',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 999,
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  appStoreRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    minWidth: 200,
  },
  storeBadgeIcon: {
    color: '#fff',
    fontSize: 28,
    marginRight: 10,
  },
  storeBadgeSub: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  storeBadgeMain: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  floatingCard: {
    position: 'relative',
    marginTop: 40,
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardRed: {
    alignSelf: isMobile ? 'center' : 'flex-start',
    marginLeft: isMobile ? 0 : '10%',
  },
  cardGreen: {
    alignSelf: isMobile ? 'center' : 'flex-end',
    marginRight: isMobile ? 0 : '10%',
    marginTop: 20,
    marginBottom: 60,
  },
  floatingText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  badgeRed: {
    backgroundColor: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeGreen: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  badgeTextInverse: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  pricingSection: {
    width: '100%',
    maxWidth: 1000,
    marginTop: 80,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#222',
    paddingTop: 80,
  },
  pricingSectionHeader: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
  },
  pricingSectionDesc: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 48,
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 24,
    width: '100%',
    justifyContent: 'center',
  },
  planCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
  planCardPro: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  planTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  planTitlePro: {
    color: '#000',
  },
  planTagline: {
    color: '#888',
    fontSize: 14,
    marginBottom: 24,
  },
  planTaglinePro: {
    color: '#555',
  },
  planPrice: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
  },
  planPricePro: {
    color: '#000',
  },
  planInterval: {
    fontSize: 16,
    color: '#888',
  },
  planIntervalPro: {
    color: '#555',
  },
  planSubPrice: {
    color: '#555',
    fontSize: 14,
    marginBottom: 32,
  },
  planSubPricePro: {
    color: '#888',
  },
  featureList: {
    flex: 1,
    gap: 12,
    marginBottom: 40,
  },
  featureItem: {
    color: '#ccc',
    fontSize: 16,
  },
  featureItemPro: {
    color: '#333',
  },
  planButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  planButtonActionPro: {
    backgroundColor: '#000',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  planButtonTextPro: {
    color: '#fff', // Pro button text is white on black background
  },
  footer: {
    marginTop: 120,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#222',
    paddingTop: 60,
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
    letterSpacing: -1,
  },
  footerMotto: {
    color: '#555',
    fontSize: 16,
    marginTop: 8,
  },
  footerLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
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
