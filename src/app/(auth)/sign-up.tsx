import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aboutYou, setAboutYou] = useState('');
  const [partnerGoals, setPartnerGoals] = useState('');

  const handleSignUp = () => {
    console.log("Registered with email: ", email);
    router.replace('/capture/live-input');
  };

  const handleAppleSignUp = () => {
    console.log("Registered with Apple");
    router.replace('/capture/live-input');
  };

  const handleGuestSignUp = () => {
    console.log("Continuing as Anonymous Guest");
    router.replace('/capture/live-input');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Let's get Personal! 💖</Text>
      <Text style={styles.subtitle}>Stop wasting time. Tell us exactly who you are and what makes someone a *Green for Go*! We'll use your answers to customize your red flags. 🚦</Text>

      <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignUp}>
        <Text style={styles.appleButtonText}> Sign up with Apple</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with email</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.label}>Account Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor={Colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Who are you? 🌟</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: I'm a creative who values independence..."
        placeholderTextColor={Colors.textMuted}
        value={aboutYou}
        onChangeText={setAboutYou}
        multiline
      />

      <Text style={styles.label}>What's your Green Light? 🟢</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: Someone who communicates openly and isn't afraid of commitment."
        placeholderTextColor={Colors.textMuted}
        value={partnerGoals}
        onChangeText={setPartnerGoals}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create My Filter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.guestLink} onPress={handleGuestSignUp}>
        <Text style={styles.guestText}>Continue as Guest (Test MVP)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
        <Text style={styles.link}>Already have an account? Log in! 💌</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 32,
    paddingTop: 80,
    paddingBottom: 60,
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  appleButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  appleButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  label: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.border,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  guestLink: {
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  guestText: {
    color: Colors.textMuted,
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});
