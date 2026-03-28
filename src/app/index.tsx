import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>REDFLAGS</Text>
        <Text style={styles.subtitle}>Capture what was said. Reveal what it might mean.</Text>
        <Text style={styles.description}>
          A real-time dating signal interpreter that converts fragmented user input into structured insights, risk signals, and actionable follow-ups.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/capture/live-input')}>
          <Text style={styles.buttonText}>Capture Signal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => router.push('/paywall/pro')}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>View Pro Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => router.push('/reports')}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>View Reports</Text>
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 48,
  },
  button: {
    backgroundColor: Colors.text,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 8,
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
