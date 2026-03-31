import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, OAuthProvider, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '606183804439-4fshjefn9ev5h8iu8935int44e9aevc9.apps.googleusercontent.com',
    webClientId: '606183804439-4fshjefn9ev5h8iu8935int44e9aevc9.apps.googleusercontent.com',
    responseType: 'id_token',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'com.googleusercontent.apps.606183804439-4fshjefn9ev5h8iu8935int44e9aevc9',
    }),
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/paywall/pro');
        })
        .catch((e) => {
          Alert.alert("Google Sign-Up Error", e.message);
        })
        .finally(() => setLoading(false));
    }
  }, [response]);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered with email: ", email);
      router.replace('/paywall/pro');
    } catch (e: any) {
      console.error(e);
      Alert.alert("Registration Error", e.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setLoading(true);
    try {
      const appleResult = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleResult;
      if (identityToken) {
        const provider = new OAuthProvider('apple.com');
        const credential = provider.credential({
          idToken: identityToken,
        });
        await signInWithCredential(auth, credential);
        router.replace('/paywall/pro');
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert("Apple Sign-Up Error", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert("Error", "Google Registration Request not ready yet. Please try again.");
    }
  };

  const handleGuestSignUp = () => {
    router.replace('/paywall/pro');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome! 💖</Text>
      <Text style={styles.subtitle}>Create an account to build your permanent Relationship Lens and unlock AI emotional intelligence.</Text>

      <TouchableOpacity style={styles.oauthButton} onPress={handleAppleSignUp} disabled={loading}>
        <Text style={styles.oauthButtonText}> Sign up with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.oauthButton, styles.googleButton]} onPress={handleGoogleSignUp} disabled={loading}>
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

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>Build My Lens</Text>
        )}
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
