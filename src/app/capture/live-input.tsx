import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { AnalysisService } from '../../lib/capture/analysisService';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../../lib/firebase';

export default function LiveInputScreen() {
  const { sessionId = 'default_session' } = useLocalSearchParams<{ sessionId?: string }>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AUTH GATE: 
  // If the user lands here without a profile, they shouldn't even be seeing the UI.
  // We force them back to the Paywall -> Sign In flow.
  React.useEffect(() => {
    const checkAuth = () => {
      // SIMULATOR BYPASS: Always allow the analyzer in development mode.
      if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
        console.warn("Dev Mode: Bypassing Intelligence Gate for Simulator...");
        return;
      }

      if (!auth.currentUser || auth.currentUser.isAnonymous) {
        console.log("No authenticated session. Redirecting to Paywall Gate...");
        router.replace('/paywall/pro');
      }
    };
    
    // Check on mount AND on auth-state-change to catch session expirations.
    const unsubscribe = auth.onAuthStateChanged(checkAuth);
    checkAuth();

    return unsubscribe;
  }, []);

  const handleCapture = async () => {
    console.log("[LiveInput] Clicked Check for Flags. Current input length:", input.trim().length);
    if (!input.trim()) {
      console.warn("[LiveInput] Empty input. Returning.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development';

      if (!user && !isDev) {
        console.error("[LiveInput] Access Denied: No user found.");
        throw new Error("Please log in to capture signals.");
      }

      console.log('[LiveInput] Firing analysis for:', input);
      const res = await AnalysisService.analyzeSignal(input, sessionId);

      if (res.success && res.signal) {
        console.log("[LiveInput] Analysis Success! Progressing to report screen...");
        setInput('');
        
        // Push to psychology read with the analysis results
        router.push({
          pathname: '/reports/psychology-read',
          params: { 
            riskLevel: res.signal.riskLevel,
            reasoning: res.signal.reasoning,
            confidence: res.signal.confidence.toString(),
            content: res.signal.content
          }
        });
      } else {
        console.error("[LiveInput] Service failed:", res.error);
        throw new Error(res.error || "Signal analysis failed.");
      }
    } catch (e: any) {
      console.error('[LiveInput] Caught Exception:', e);
      setError(e.message);
      Alert.alert("Analysis Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ANALYZE POTENTIAL MATCH</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput}
          placeholder="What happened? What was said?"
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.button, (!input.trim() || loading) && styles.buttonDisabled]} 
        onPress={handleCapture}
        disabled={!input.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.text} />
        ) : (
          <Text style={styles.buttonText}>CHECK FOR FLAGS</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    minHeight: 150,
    marginBottom: 20,
  },
  textInput: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.text, // Simple white button
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.background, // Black text
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  }
});
