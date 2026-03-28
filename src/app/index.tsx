import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
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
      
      {/* Navbar Placeholder */}
      <View style={styles.nav}>
        <Text style={styles.navLogo}>REDFLAGS</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text style={styles.navLogin}>Log In</Text>
        </TouchableOpacity>
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
      </View>

      {/* Floating Demo Elements replicating gen-z dynamic layouts */}
      <Animated.View style={[styles.floatingCard, styles.cardRed, floatStyle]}>
        <Text style={styles.floatingText}>"I'm not looking for anything serious rn but..."</Text>
        <View style={styles.badgeRed}><Text style={styles.badgeTextInverse}>🚩 RED FLAG: TIME WASTER</Text></View>
      </Animated.View>

      <Animated.View style={[styles.floatingCard, styles.cardGreen, floatStyle, { animationDelay: '1s' as any }]}>
        <Text style={styles.floatingText}>"I bought us tickets to that band you mentioned!"</Text>
        <View style={styles.badgeGreen}><Text style={styles.badgeText}>🟢 GREEN FLAG: LISTENS</Text></View>
      </Animated.View>

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
    paddingBottom: 120,
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
    alignItems: isMobile ? 'flex-start' : 'center',
    marginTop: isMobile ? 20 : 60,
    zIndex: 10,
  },
  heroSuper: {
    color: Colors.textMuted,
    fontSize: 20,
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
    WebkitTextStrokeWidth: 2,
    WebkitTextStrokeColor: '#ffffff',
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
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 999, // Giant pill
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
  }
});
