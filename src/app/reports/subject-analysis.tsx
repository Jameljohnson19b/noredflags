import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLocalSearchParams, router } from 'expo-router';
import { SubjectService, SubjectProfile } from '../../lib/subjects/subjectService';

export default function SubjectAnalysisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [subject, setSubject] = useState<SubjectProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubject = async () => {
      if (!id) return;
      const list = await SubjectService.getSubjects();
      const found = list.find(s => s.id === id);
      setSubject(found || null);
      setLoading(false);
    };
    loadSubject();
  }, [id]);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator color="#fff" /></View>;
  }

  if (!subject) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Persona not found.</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: '#fff', marginTop: 20 }}>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← DASHBOARD</Text>
      </TouchableOpacity>

      <Text style={styles.header}>INTELLIGENCE REPORT</Text>
      <Text style={styles.subjectName}>{subject.name.toUpperCase()}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>PATTERN SUMMARY</Text>
        <Text style={styles.bodyText}>
          Based on the collected signals, this individual shows a pattern of [Aggregated AI Analysis will appear here]. 
          We are analyzing the frequency of caution signals relative to your Relationship Lens.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>PSYCHOLOGICAL PROFILE</Text>
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Consistency:</Text>
          <Text style={styles.traitValue}>MEDIUM</Text>
        </View>
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Emotional Intel:</Text>
          <Text style={styles.traitValue}>LOW</Text>
        </View>
        <View style={styles.traitRow}>
          <Text style={styles.traitLabel}>Alignment:</Text>
          <Text style={styles.traitValue}>20%</Text>
        </View>
      </View>

      <View style={[styles.card, { borderColor: '#F25C2A' }]}>
        <Text style={[styles.sectionTitle, { color: '#F25C2A' }]}>TACTICAL ADVICE</Text>
        <Text style={styles.bodyText}>
          Maintain distance until verbal commitments match behavioral output. Do not over-explain your needs; watch for self-correction.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  backButton: {
    marginBottom: 32,
  },
  backText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  header: {
    color: '#888',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  subjectName: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  bodyText: {
    color: '#888',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  traitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  traitLabel: {
    color: '#444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  traitValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
