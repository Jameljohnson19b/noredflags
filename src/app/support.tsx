import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Dimensions, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import { SignalBackground } from '../components/signals/SignalBackground';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function SupportPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@noredflags.xyz?subject=Support Request');
  };

  const handleSubmit = () => {
    if (!email || !message) return;
    setSubmitted(true);
    // Future: API call to submit form
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const FAQS = [
    {
      q: "How does the Free Trial work?",
      a: "REDFLAGS offers a 3-day full spectrum trial. Configure your Relationship Lens, scan signals, and get deep analysis. No credit card required for guest mode. After 3 days, choose your level of insight."
    },
    {
      q: "What is the Relationship Lens?",
      a: "It's your personal AI filter. We don't give generic advice. We cross-reference what YOU value with what they actually said. A 'Red Flag' for one person might be a 'Yellow' for another based on their specific Lens."
    },
    {
      q: "How secure is my data?",
      a: "Maximum privacy is our core. Encryption at rest and in transit. We are a tool for YOUR clarity, not a data broker. Your logs and Lens profiles are yours alone."
    },
    {
      q: "Can I upgrade from Core to Pro?",
      a: "Yes. Upgrading to Pro gives you deeper psychological reads, behavioral pattern matching, and unlimited scans. Transition instantly via the 'Profile' or 'Paywall' tabs."
    }
  ];

  return (
    <SignalBackground score={85} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header Navigation */}
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
              <Text style={styles.navLogo}>NOREDFLAGS</Text>
            </TouchableOpacity>
            {!isMobile && (
              <View style={styles.navLinks}>
                <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.navLinkText}>Mission</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}><Text style={styles.navLinkText}>Log In</Text></TouchableOpacity>
              </View>
            )}
          </View>

          {/* Hero Branding */}
          <View style={styles.heroSection}>
            <Text style={styles.heroPreTitle}>MISSION SUPPORT</Text>
            <Text style={styles.heroTitle}>HELP</Text>
            <Text style={styles.heroTitleOutlined}>CENTRE.</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.mainGrid}>
            
            {/* FAQ Column */}
            <View style={styles.faqColumn}>
              <Text style={styles.columnHeader}>FREQUENT QUESTIONS</Text>
              {FAQS.map((faq, idx) => (
                <View key={idx} style={styles.faqCard}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                </View>
              ))}
            </View>

            {/* Contact Column */}
            <View style={styles.contactColumn}>
              <View style={styles.contactCard}>
                <Text style={styles.columnHeader}>DIRECT INQUIRY</Text>
                <Text style={styles.contactDescription}>
                  Need a human perspective on a technical issue? Send us a message below.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>REPLY ADDRESS</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="you@email.com"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>YOUR MESSAGE</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your issue..."
                    placeholderTextColor="#555"
                    multiline
                    numberOfLines={4}
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, submitted && styles.submitButtonSuccess]} 
                  onPress={handleSubmit}
                  disabled={submitted}
                >
                  <Text style={styles.submitButtonText}>
                    {submitted ? "SENT" : "SEND MESSAGE"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.directEmail} onPress={handleEmailSupport}>
                  <Text style={styles.directEmailText}>Or email support@noredflags.xyz</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerLogo}>NOREDFLAGS</Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerCopyright}>
              © {new Date().getFullYear()} JEDI LLC. SYSTEM VERSION 1.0.0
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SignalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 20 : 60,
    alignItems: 'center',
    paddingBottom: 100,
  },
  nav: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
  },
  navLogo: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  navLinkText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  heroSection: {
    width: '100%',
    maxWidth: 1100,
    marginBottom: 60,
  },
  heroPreTitle: {
    color: Colors.caution,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: isMobile ? 64 : 120,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: isMobile ? 60 : 110,
  },
  heroTitleOutlined: {
    color: 'transparent',
    fontSize: isMobile ? 64 : 120,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: isMobile ? 60 : 110,
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  separator: {
    width: 60,
    height: 4,
    backgroundColor: Colors.safe,
    marginTop: 32,
  },
  mainGrid: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: isMobile ? 'column' : 'row',
    gap: 60,
  },
  faqColumn: {
    flex: 1.2,
    gap: 20,
  },
  contactColumn: {
    flex: 1,
  },
  columnHeader: {
    color: '#555',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  faqQuestion: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  faqAnswer: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactDescription: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonSuccess: {
    backgroundColor: Colors.safe,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
  directEmail: {
    marginTop: 24,
    alignItems: 'center',
  },
  directEmailText: {
    color: Colors.textMuted,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 100,
    width: '100%',
    maxWidth: 1100,
    alignItems: 'center',
  },
  footerLogo: {
    color: '#333',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#222',
    marginVertical: 20,
  },
  footerCopyright: {
    color: '#555',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  }
});
