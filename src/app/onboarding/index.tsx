import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { LensService } from '../../lib/onboarding/lensService';
import { auth } from '../../lib/firebase';

import { User } from 'firebase/auth';

export default function OnboardingLens() {
  const [lens, setLens] = useState({
    whoAmI: '',
    userWants: '',
    userDontWants: '',
    whoTheyDate: '',
    relationshipGoals: '',
    monogamy: 'Monogamous',
    desireForChildren: 'Yes',
    openToChildren: 'Yes',
    financialImportance: 'High',
    ambitionImportance: 'High',
    lifestyle: '',
    hardDealbreakers: '',
    softConcerns: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 🔥 STRICT AUTH GUARD: Guest users cannot access this screen.
    const userSnapshot = auth.currentUser;
    if (!userSnapshot || userSnapshot.isAnonymous) {
      console.log("[Onboarding] Unauthorized Guest. Shunting to Sign-In.");
      router.replace('/(auth)/sign-in');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (!user || user.isAnonymous) {
        setIsAuthenticated(false);
        router.replace('/(auth)/sign-in');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateLens = (key: string, val: string) => {
    setLens(prev => ({ ...prev, [key]: val }));
    if (error) setError(null);
  };

  const handleFinish = async () => {
    // 1. Validation check
    if (!lens.whoAmI.trim()) {
      Alert.alert("Missing Info", "Please tell us a little bit about who you are.");
      return;
    }

    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    // Use optional chaining for safety
    if (!user?.uid || user.isAnonymous) {
      setLoading(false);
      Alert.alert(
        "Account Required", 
        "A permanent account (Email/Apple/Google) is required to unlock your dating intelligence 3-day trial.",
        [
          { text: "Log In", onPress: () => router.push('/(auth)/sign-in') },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    // 2. Robust Timeout Management: Increased to 30s to account for AI latency & cold starts
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      Alert.alert("Connection Timeout", "Optimizing your Relationship Lens is taking longer than expected. Please wait a moment and try again.");
    }, 30000);

    try {
      console.log("Saving Lens directly to cloud...");
      const res = await LensService.saveLens(lens);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (res.success) {
        // Once lens is saved, move to the core capture experience
        router.replace('/capture/live-input');
      } else {
        throw new Error("Cloud save failed.");
      }
    } catch (e: any) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.error("Lens save error:", e);
      setError(e.message || "Failed to save Relationship Lens.");
      Alert.alert("Save Error", e.message || "Something went wrong while saving your Lens.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Your Relationship Lens 🔎</Text>
        <Text style={styles.subtitle}>We use this deeply personal profile to stop generic advice. Tell us the absolute truth about what you need.</Text>

        {auth.currentUser && !auth.currentUser.isAnonymous && (
           <View style={styles.authContainer}>
             <View style={styles.authRow}>
               <View style={styles.authInfo}>
                 <Text style={styles.authLabel}>ACTIVE SESSION</Text>
                 <Text style={styles.authValue} numberOfLines={1} ellipsizeMode="middle">
                   {auth.currentUser.email || 'Anonymous'}
                 </Text>
               </View>
               <TouchableOpacity 
                 style={styles.signOutButton} 
                 onPress={async () => {
                   await auth.signOut();
                   router.replace('/(auth)/sign-in');
                 }}
               >
                 <Text style={styles.signOutText}>LOG OUT</Text>
               </TouchableOpacity>
             </View>
           </View>
        )}

        <Text style={styles.label}>Who are you?</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={Colors.textMuted} 
          placeholder="e.g. Introverted designer, 28" 
          value={lens.whoAmI} 
          onChangeText={t => updateLens('whoAmI', t)} 
        />

        <View style={styles.masterSection}>
          <Text style={styles.masterLabel}>THE WANT LIST</Text>
          <Text style={styles.masterSub}>What do you actually want in a partner?</Text>
          <TextInput 
            style={[styles.input, styles.textArea, styles.masterInput]} 
            placeholderTextColor={Colors.textMuted} 
            placeholder="e.g. Emotional intelligence, growth mindset, stability..." 
            multiline 
            value={lens.userWants} 
            onChangeText={t => updateLens('userWants', t)} 
          />
        </View>

        <View style={styles.masterSection}>
          <Text style={styles.masterLabel}>THE NO LIST (DEALBREAKERS)</Text>
          <Text style={styles.masterSub}>What is absolutely NOT allowed?</Text>
          <TextInput 
            style={[styles.input, styles.textArea, styles.masterInput, { borderColor: '#EF4444' }]} 
            placeholderTextColor={Colors.textMuted} 
            placeholder="e.g. Inconsistency, bad hygiene, over-attachment" 
            multiline 
            value={lens.userDontWants} 
            onChangeText={t => updateLens('userDontWants', t)} 
          />
        </View>

        <Text style={[styles.label, { marginTop: 40 }]}>Who do you usually date?</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={Colors.textMuted} 
          placeholder="e.g. Creative types, older men" 
          value={lens.whoTheyDate} 
          onChangeText={t => updateLens('whoTheyDate', t)} 
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={() => {
            if (!auth.currentUser || auth.currentUser.isAnonymous) {
              // Immediate Feedback: Direct redirect to sign-in for guests
              router.push('/(auth)/sign-in');
            } else {
              handleFinish();
            }
          }} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              {!auth.currentUser || auth.currentUser.isAnonymous ? "Sign In to Save" : "Activate Lens"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
    flexGrow: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  label: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  masterSection: {
    marginTop: 40,
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  masterLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  masterSub: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 16,
    marginTop: 2,
  },
  masterInput: {
    backgroundColor: '#000',
    borderColor: '#333',
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.text,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  authContainer: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authInfo: {
    flex: 1,
    marginRight: 16,
  },
  authLabel: {
    color: '#444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  authValue: {
    color: '#EAB308',
    fontSize: 14,
    fontWeight: '700',
  },
  signOutButton: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
  }
});
