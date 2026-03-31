import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { LensService } from '../../lib/onboarding/lensService';
import { auth } from '../../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple select pseudo-buttons for the Lens
const SelectOption = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
  <TouchableOpacity style={[styles.selectOption, selected && styles.selectOptionActive]} onPress={onPress}>
    <Text style={[styles.selectText, selected && styles.selectTextActive]}>{label}</Text>
  </TouchableOpacity>
);

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

  const updateLens = (key: string, val: string) => {
    setLens(prev => ({ ...prev, [key]: val }));
    if (error) setError(null);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      Alert.alert("Account Required", "Please log in on the previous screen to save your Lens.");
      router.replace('/paywall/pro');
      return;
    }

    try {
      console.log("Saving Lens directly to cloud...");
      await LensService.saveLens(lens);
      
      // Once lens is saved, move to the core capture experience
      router.replace('/capture/live-input');
    } catch (e: any) {
      console.error("Lens save error:", e);
      setError(e.message || "Failed to save Relationship Lens.");
      Alert.alert("Save Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      alwaysBounceVertical={true}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Text style={styles.title}>Your Relationship Lens 🔎</Text>
      <Text style={styles.subtitle}>We use this deeply personal profile to stop generic advice. Tell us the absolute truth about what you need.</Text>

      <Text style={styles.label}>Who are you?</Text>
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} placeholder="e.g. Introverted designer, 28" value={lens.whoAmI} onChangeText={t => updateLens('whoAmI', t)} />

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
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} placeholder="e.g. Creative types, older men" value={lens.whoTheyDate} onChangeText={t => updateLens('whoTheyDate', t)} />


      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleFinish} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>Activate Lens</Text>
        )}
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
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  selectOptionActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  selectText: {
    color: Colors.text,
    fontWeight: '600',
  },
  selectTextActive: {
    color: Colors.background,
  },
  button: {
    backgroundColor: Colors.text,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
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
  }
});
