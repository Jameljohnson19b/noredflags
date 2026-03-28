import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { LensService } from '../../lib/onboarding/lensService';
import { auth } from '../../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ActivityIndicator, Alert } from 'react-native';

// Simple select pseudo-buttons for the Lens
const SelectOption = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
  <TouchableOpacity style={[styles.selectOption, selected && styles.selectOptionActive]} onPress={onPress}>
    <Text style={[styles.selectText, selected && styles.selectTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function OnboardingLens() {
  const [lens, setLens] = useState({
    whoAmI: '',
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

    try {
      let user = auth.currentUser;
      
      // If no session exists, initialize an anonymous guest session 
      // per GEMINI.md requirements for low-friction onboarding.
      if (!user) {
        console.log("Initializing Anonymous Guest Session...");
        const cred = await signInAnonymously(auth);
        user = cred.user;
      }

      console.log("Saving Relationship Lens...", lens);
      await LensService.saveLens(lens);
      
      // Move to capturing signals
      router.replace('/capture/live-input');
    } catch (e: any) {
      console.error("Error saving lens:", e);
      setError(e.message || "Failed to save Relationship Lens. Please try again.");
      Alert.alert("Submission Error", e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Relationship Lens 🔎</Text>
      <Text style={styles.subtitle}>We use this deeply personal profile to stop generic advice. Tell us the absolute truth about what you need.</Text>

      <Text style={styles.label}>Who are you?</Text>
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} placeholder="e.g. Introverted designer, 28" value={lens.whoAmI} onChangeText={t => updateLens('whoAmI', t)} />

      <Text style={styles.label}>Who do you usually date?</Text>
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} placeholder="e.g. Creative types, older men" value={lens.whoTheyDate} onChangeText={t => updateLens('whoTheyDate', t)} />

      <Text style={styles.label}>What's the goal right now?</Text>
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} placeholder="e.g. Casual leading to long-term" value={lens.relationshipGoals} onChangeText={t => updateLens('relationshipGoals', t)} />

      <Text style={styles.label}>Relationship Style</Text>
      <View style={styles.row}>
        <SelectOption label="Monogamy" selected={lens.monogamy === 'Monogamy'} onPress={() => updateLens('monogamy', 'Monogamy')} />
        <SelectOption label="Non-Monogamy" selected={lens.monogamy === 'Non-Monogamy'} onPress={() => updateLens('monogamy', 'Non-Monogamy')} />
      </View>

      <Text style={styles.label}>Do you want children?</Text>
      <View style={styles.row}>
        <SelectOption label="Yes" selected={lens.desireForChildren === 'Yes'} onPress={() => updateLens('desireForChildren', 'Yes')} />
        <SelectOption label="No" selected={lens.desireForChildren === 'No'} onPress={() => updateLens('desireForChildren', 'No')} />
        <SelectOption label="Maybe" selected={lens.desireForChildren === 'Maybe'} onPress={() => updateLens('desireForChildren', 'Maybe')} />
      </View>

      <Text style={styles.label}>Open to them having kids?</Text>
      <View style={styles.row}>
        <SelectOption label="Yes" selected={lens.openToChildren === 'Yes'} onPress={() => updateLens('openToChildren', 'Yes')} />
        <SelectOption label="No" selected={lens.openToChildren === 'No'} onPress={() => updateLens('openToChildren', 'No')} />
      </View>

      <Text style={styles.label}>Financial Stability Importance</Text>
      <View style={styles.row}>
        <SelectOption label="Low" selected={lens.financialImportance === 'Low'} onPress={() => updateLens('financialImportance', 'Low')} />
        <SelectOption label="Medium" selected={lens.financialImportance === 'Medium'} onPress={() => updateLens('financialImportance', 'Medium')} />
        <SelectOption label="High" selected={lens.financialImportance === 'High'} onPress={() => updateLens('financialImportance', 'High')} />
      </View>

      <Text style={styles.label}>Ambition Importance</Text>
      <View style={styles.row}>
        <SelectOption label="Low" selected={lens.ambitionImportance === 'Low'} onPress={() => updateLens('ambitionImportance', 'Low')} />
        <SelectOption label="Medium" selected={lens.ambitionImportance === 'Medium'} onPress={() => updateLens('ambitionImportance', 'Medium')} />
        <SelectOption label="High" selected={lens.ambitionImportance === 'High'} onPress={() => updateLens('ambitionImportance', 'High')} />
      </View>

      <Text style={styles.label}>Lifestyle Preferences</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={Colors.textMuted} placeholder="e.g. Travel heavy, loves dogs, sober" multiline value={lens.lifestyle} onChangeText={t => updateLens('lifestyle', t)} />

      <Text style={styles.label}>Hard Dealbreakers</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={Colors.textMuted} placeholder="e.g. Smoking, inconsistent communication" multiline value={lens.hardDealbreakers} onChangeText={t => updateLens('hardDealbreakers', t)} />

      <Text style={styles.label}>Soft Concerns</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={Colors.textMuted} placeholder="e.g. Poor texter but good in person" multiline value={lens.softConcerns} onChangeText={t => updateLens('softConcerns', t)} />

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
    paddingBottom: 80,
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
