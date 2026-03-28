import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>REDFLAGS 🚦</Text>
        <Text style={styles.subtitle}>Green for Go, or Stop on Red?</Text>
        <Text style={styles.description}>
          Stop wasting time over-analyzing texts and second-guessing every date! Tell us what you're really looking for, log what they said, and let's decode if it's true love or a *major* red flag. 🚩
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={styles.buttonText}>Get Started & Tell Us About You</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => router.push('/(auth)/sign-in')}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => router.push('/paywall/pro')}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>View Pro Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 32,
  },
  hero: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.text,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  outlineButtonText: {
    color: Colors.text,
  }
});
