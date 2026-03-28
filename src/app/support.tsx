import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function SupportPage() {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@noredflags.xyz?subject=Support Request');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Navbar Section */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.navLogo}>REDFLAGS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text style={styles.navLogin}>Log In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Support & FAQ</Text>
        <Text style={styles.pageDescription}>
          How can we help you decode your dating life? Find answers to common questions below, or reach out to our team directly.
        </Text>
      </View>

      <View style={styles.faqSection}>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>How does the Free Trial work?</Text>
          <Text style={styles.faqAnswer}>
            REDFLAGS offers a 3-day free trial for all new users to configure their Relationship Lens and scan signals. After 3 days, you can choose to upgrade to Core ($2.99/week) or Pro ($9.99/month). You will not be automatically billed if you signed in as an Anonymous Guest without a linked App Store or Google Play account.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>What is the Relationship Lens?</Text>
          <Text style={styles.faqAnswer}>
            Your Relationship Lens is the core AI filter REDFLAGS uses to evaluate statements. Instead of generic advice, our AI cross-references what you consider a "dealbreaker" with what your partner actually said to provide a hyper-personalized Green Light or Red Flag rating.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>How do I cancel my subscription?</Text>
          <Text style={styles.faqAnswer}>
            If you subscribed via the App Store, open your iPhone Settings &gt; Apple ID &gt; Subscriptions. Select REDFLAGS and tap "Cancel Subscription". If you subscribed via Google Play, open the Play Store app, go to Payments &amp; subscriptions, and cancel REDFLAGS.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Are my texts and logs private?</Text>
          <Text style={styles.faqAnswer}>
            Yes. REDFLAGS is built as an emotionally sensitive second brain for dating. We do not sell your personal Relationship Lens responses or scanned texts to third parties or advertising networks.
          </Text>
        </View>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactHeader}>Still need help?</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
          <Text style={styles.contactButtonText}>Email support@noredflags.xyz</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerCopyright}>© {new Date().getFullYear()} 19B PROJECTS. All rights reserved.</Text>
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
    paddingBottom: 60,
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
  pageHeader: {
    maxWidth: 800,
    width: '100%',
    marginBottom: 48,
    alignItems: isMobile ? 'flex-start' : 'center',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: isMobile ? 48 : 72,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 16,
    textAlign: isMobile ? 'left' : 'center',
  },
  pageDescription: {
    color: '#888888',
    fontSize: 18,
    lineHeight: 28,
    textAlign: isMobile ? 'left' : 'center',
    maxWidth: 600,
  },
  faqSection: {
    width: '100%',
    maxWidth: 800,
    gap: 24,
    marginBottom: 60,
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  faqQuestion: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  faqAnswer: {
    color: '#aaaaaa',
    fontSize: 16,
    lineHeight: 24,
  },
  contactSection: {
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
    paddingVertical: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contactHeader: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  contactButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 60,
    paddingTop: 40,
    borderTopWidth: 1,
    borderColor: '#222',
    width: '100%',
    alignItems: 'center',
  },
  footerCopyright: {
    color: '#555555',
    fontSize: 12,
  }
});
