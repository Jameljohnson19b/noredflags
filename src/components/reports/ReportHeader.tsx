import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  title: string;
  date: string;
}

export function ReportHeader({ title, date }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  date: {
    color: Colors.textMuted,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
  }
});
