import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { getScoreColor } from '../../lib/scoring/colorMap';

// Placeholder props mirroring realistic data objects we would iterate
function ReportCard({ title, date, score }: { title: string, date: string, score: number }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={[styles.dot, { backgroundColor: getScoreColor(score) }]} />
      </View>
      <Text style={styles.cardDate}>{date}</Text>
    </TouchableOpacity>
  );
}

export default function ReportsHub() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Intelligence</Text>
      <Text style={styles.subtitle}>Your analytical breakdown.</Text>
      
      <View style={styles.grid}>
        <ReportCard title="Psychology Read" date="Last Date" score={65} />
        <ReportCard title="Pattern Report" date="Past 30 Days" score={30} />
        <ReportCard title="Date Breakdown" date="Sarah / Friday" score={5} />
      </View>
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
  },
  header: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 18,
    marginBottom: 32,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDate: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  }
});
