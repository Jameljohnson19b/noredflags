import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';

const CookiesPopup = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.cookiesContainer}>
      <Text style={styles.cookiesText}>
        We use cookies to analyze traffic and tailor the REDFLAGS experience. Read our Privacy Policy.
      </Text>
      <View style={styles.cookiesButtons}>
        <TouchableOpacity style={styles.cookiesButton} onPress={() => setVisible(false)}>
          <Text style={styles.cookiesButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cookiesButton, styles.cookiesButtonOutline]}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.cookiesButtonOutlineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Layout() {
  useEffect(() => {
    import('../lib/firebase').catch((err) => {
      console.error('Firebase init failed:', err);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'REDFLAGS', headerShown: false }} />
        <Stack.Screen name="capture/live-input" options={{ title: 'Capture Signal', presentation: 'modal' }} />
        <Stack.Screen name="paywall/core" options={{ title: 'Core', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="paywall/pro" options={{ title: 'Pro', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="reports/index" options={{ title: 'Intelligence' }} />
        <Stack.Screen name="reports/psychology-read" options={{ title: 'Psychology Read' }} />
        <Stack.Screen name="onboarding/index" options={{ title: 'Relationship Lens' }} />
        <Stack.Screen name="(auth)/sign-in" options={{ title: 'Log In', presentation: 'modal' }} />
        <Stack.Screen name="(auth)/sign-up" options={{ title: 'Sign Up', presentation: 'modal' }} />
      </Stack>

      {/* <CookiesPopup /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cookiesContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    flexWrap: 'wrap',
    gap: 16,
    zIndex: 9999,
  },
  cookiesText: {
    color: '#cccccc',
    fontSize: 14,
    flex: 1,
    minWidth: 200,
    lineHeight: 20,
  },
  cookiesButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cookiesButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  cookiesButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  cookiesButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555555',
  },
  cookiesButtonOutlineText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
