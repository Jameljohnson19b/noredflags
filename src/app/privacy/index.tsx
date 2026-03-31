import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SignalBackground } from '../../components/signals/SignalBackground';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function PrivacyPage() {
  return (
    <SignalBackground score={30} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Navigation */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={styles.navLogo}>NOREDFLAGS</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroPreTitle}>DATA PROTOCOL</Text>
          <Text style={styles.heroTitle}>PRIVACY</Text>
          <Text style={styles.heroTitleOutlined}>POLICY.</Text>
          <View style={styles.separator} />
        </View>

        {/* Content Section */}
        <View style={styles.textContainer}>
          <Section title="1. DATA COLLECTION">
            We collect data provided by you: Relationship Lens profiles, text-based session inputs, and feedback. We do NOT record audio metadata or location beyond basic regional requirements.
          </Section>

          <Section title="2. SIGNAL PROCESSING">
            Your inputs are processed using advanced AI models. While we use cloud providers like Google and OpenAI for processing, we maintain strict encryption at rest and in transit. Your personal Relationship Lens is private and used only for your specific analysis.
          </Section>

          <Section title="3. SUBSCRIPTIONS & STRIPE">
            Payment processing is handled by Stripe. We do NOT store your credit card information on our servers. Your payment history is linked to your account for subscription management.
          </Section>

          <Section title="4. DELETION RIGHTS">
            You maintain full sovereignty over your data. You may request the full deletion of your account and all associated Signal Logs at any time from within the account settings.
          </Section>

          <Section title="5. SECURITY MAXIMS">
            No system is 100% impenetrable. REDFLAGS uses industry-standard security practices to ensure that your emotional intellectual property remains yours.
          </Section>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>RETURN</Text>
          </TouchableOpacity>
          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} JEDI LLC. FINAL REVISION 2026.03.31
          </Text>
        </View>

      </ScrollView>
    </SignalBackground>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 24 : 80,
    alignItems: 'center',
    paddingBottom: 100,
  },
  nav: {
    width: '100%',
    maxWidth: 900,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 60,
  },
  navLogo: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroSection: {
    width: '100%',
    maxWidth: 900,
    marginBottom: 60,
  },
  heroPreTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: isMobile ? 48 : 80,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: isMobile ? 50 : 85,
  },
  heroTitleOutlined: {
    color: 'transparent',
    fontSize: isMobile ? 48 : 80,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: isMobile ? 50 : 85,
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  separator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.text,
    marginTop: 24,
  },
  textContainer: {
    width: '100%',
    maxWidth: 900,
    gap: 40,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.5,
  },
  sectionText: {
    color: Colors.text,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  footer: {
    marginTop: 100,
    width: '100%',
    maxWidth: 900,
    alignItems: 'center',
    gap: 40,
  },
  backButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  footerCopyright: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  }
});
