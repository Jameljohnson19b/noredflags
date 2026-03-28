import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLocalSearchParams, router } from 'expo-router';

export default function PsychologyReadScreen() {
  const { riskLevel, reasoning, confidence, content } = useLocalSearchParams<{
    riskLevel: string;
    reasoning: string;
    confidence: string;
    content: string;
  }>();

  // Map risk levels to our strict B&W brand colors
  const getRiskStyles = () => {
    switch(riskLevel) {
      case 'Red Flag':
        return { color: Colors.maxRisk, border: Colors.maxRisk };
      case 'Yellow Flag':
        return { color: Colors.caution, border: Colors.caution };
      case 'Green Flag':
        return { color: Colors.safe, border: Colors.safe };
      case 'Personal Mismatch':
        return { color: Colors.warning, border: Colors.warning };
      case 'Personal Match':
        return { color: Colors.safe, border: Colors.safe };
      default:
        return { color: Colors.text, border: Colors.border };
    }
  };

  const styleSet = getRiskStyles();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Psychology Read</Text>
        <Text style={styles.date}>Generated {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Captured Input:</Text>
        <Text style={styles.quote}>"{content}"</Text>
      </View>

      <View style={[styles.statusCard, { borderColor: styleSet.border }]}>
        <Text style={[styles.statusLevel, { color: styleSet.color }]}>{riskLevel?.toUpperCase()}</Text>
        <Text style={styles.confidence}>Confidence: {Math.round(parseFloat(confidence || '0') * 100)}%</Text>
      </View>

      <View style={styles.analysisBox}>
        <Text style={styles.analysisHeader}>Artificial Intelligence Reasoning</Text>
        <Text style={styles.analysisBody}>{reasoning}</Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/')}>
        <Text style={styles.closeButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
  },
  date: {
    color: '#666666',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  quote: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  statusCard: {
    borderWidth: 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLevel: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  confidence: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  analysisBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  analysisHeader: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  analysisBody: {
    color: '#aaaaaa',
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 999,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  }
});
