import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  title: string;
  price: string;
  period: string;
  selected?: boolean;
  onPress: () => void;
}

export function PricingCard({ title, price, period, selected, onPress }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.card, selected && styles.selectedCard]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.radioContainer}>
        <View style={[styles.radio, selected && styles.radioActive]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}<Text style={styles.period}> / {period}</Text></Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  selectedCard: {
    borderColor: Colors.text, // Clean white border for selection adhering to B&W rules
  },
  radioContainer: {
    marginRight: 16,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  radioActive: {
    borderColor: Colors.text,
    backgroundColor: Colors.text,
  },
  content: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  period: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: 'normal',
  }
});
