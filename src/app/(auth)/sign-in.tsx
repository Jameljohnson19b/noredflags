import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic auth logic placeholder integrating with Firebase Auth later
    console.log("Logged in with:", email);
    router.replace('/capture/live-input');
  };

  const handleAppleLogin = () => {
    console.log("Logged in with Apple");
    router.replace('/capture/live-input');
  };

  const handleGuestLogin = () => {
    // Optional anonymous guest mode for onboarding/MVP trial flow
    console.log("Continuing as Anonymous Guest");
    router.replace('/capture/live-input');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back! 💌</Text>
      <Text style={styles.subtitle}>Time to decode your latest dates.</Text>

      <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
        <Text style={styles.appleButtonText}> Sign in with Apple</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with email</Text>
        <View style={styles.divider} />
      </View>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In & Analyze</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.link}>Don't have an account? Sign up here! ✨</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.guestLink} onPress={handleGuestLogin}>
        <Text style={styles.guestText}>Continue as Guest (Test MVP)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 32,
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 18,
    marginBottom: 40,
  },
  appleButton: {
    backgroundColor: Colors.text, // White/Text color
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
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.border,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
    marginTop: 20,
    alignItems: 'center',
  },
  guestText: {
    color: Colors.textMuted,
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});
