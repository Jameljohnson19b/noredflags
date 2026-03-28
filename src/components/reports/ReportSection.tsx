import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { getScoreColor } from '../../lib/scoring/colorMap';

interface Props {
  heading: string;
  body: string;
  highlightScore?: number;
}

export function ReportSection({ heading, body, highlightScore }: Props) {
  // Leverage meaningful color from the scoring engine if a risk score is tied to this section
  const accentColor = highlightScore !== undefined ? getScoreColor(highlightScore) : Colors.text;

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 16,
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
  heading: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  body: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  }
});
