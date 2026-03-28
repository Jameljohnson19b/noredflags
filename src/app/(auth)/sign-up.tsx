import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log("Registered with email: ", email);
    router.replace('/onboarding');
  };

  const handleAppleSignUp = () => {
    console.log("Registered with Apple");
    router.replace('/onboarding');
  };

  const handleGoogleSignUp = () => {
    console.log("Registered with Google");
    router.replace('/onboarding');
  };

  const handleGuestSignUp = () => {
    console.log("Continuing as Anonymous Guest");
    router.replace('/onboarding');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome! 💖</Text>
      <Text style={styles.subtitle}>Create an account to build your permanent Relationship Lens and unlock AI emotional intelligence.</Text>

      <TouchableOpacity style={styles.oauthButton} onPress={handleAppleSignUp}>
        <Text style={styles.oauthButtonText}> Sign up with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.oauthButton, styles.googleButton]} onPress={handleGoogleSignUp}>
        <Text style={[styles.oauthButtonText, styles.googleButtonText]}>G Sign up with Google</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Build My Lens</Text>
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
  oauthButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  oauthButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  googleButtonText: {
    color: Colors.text,
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
