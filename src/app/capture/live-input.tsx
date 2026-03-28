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

  const handleCapture = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please log in to capture signals.");

      console.log('Analyzing Signal:', input);
      const res = await AnalysisService.analyzeSignal(input, sessionId);

      if (res.success && res.signal) {
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
        throw new Error(res.error || "Signal analysis failed.");
      }
    } catch (e: any) {
      console.error('Capture Error:', e);
      setError(e.message);
      Alert.alert("Analysis Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture the Moment</Text>
      
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
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>Capture Signal</Text>
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
