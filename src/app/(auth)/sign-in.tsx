import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, OAuthProvider, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
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
          Alert.alert("Google Login Error", e.message);
        })
        .finally(() => setLoading(false));
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    try {
      // Normalization: Remove accidental spaces often added by mobile keyboards
      const normalizedEmail = email.trim();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      console.log("Logged in successfully:", normalizedEmail);
      router.replace('/paywall/pro');
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Log in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
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
        Alert.alert("Apple Login Error", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert("Error", "Google Auth Request not ready yet. Please try again.");
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      // 🕵️ Secure Guest Auth: Provide a temporary UID to ensure Firestore permissions 
      // stay happy while the user tests the app.
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
      router.replace('/paywall/pro');
    } catch (e: any) {
      console.error("Guest login failed:", e);
      Alert.alert("Guest Mode Error", "Unable to start guest session. Please try email sign-up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back! 💌</Text>
      <Text style={styles.subtitle}>Time to decode your latest dates.</Text>

      <TouchableOpacity style={styles.oauthButton} onPress={handleAppleLogin}>
        <Text style={styles.oauthButtonText}> Sign in with Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.oauthButton, styles.googleButton]} onPress={handleGoogleLogin}>
        <Text style={[styles.oauthButtonText, styles.googleButtonText]}>G Sign in with Google</Text>
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
        keyboardType="email-address" // 👈 Opens the '@' keyboard for faster entry
        autoComplete="email"          // 👈 Supports password manager auto-fill
        spellCheck={false}           // 👈 Prevents annoying autocorrect on emails
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, (!email || !password || loading) && { opacity: 0.5 }]} 
        onPress={handleLogin}
        disabled={loading || !email || !password}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>Log In & Analyze</Text>
        )}
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
  oauthButton: {
    backgroundColor: Colors.text, // White/Text color
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
