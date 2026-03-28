import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PricingCard } from '../../components/paywall/PricingCard';
import { PLANS } from '../../constants/plans';
import { Colors } from '../../constants/colors';

export default function CorePaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'yearly'>('weekly');

  const handleSubscribe = () => {
    // Will tie to RevenueCat trigger soon
    console.log(`Triggering subscription for Core: ${selectedPlan}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PLANS.CORE.name}</Text>
      <Text style={styles.tagline}>{PLANS.CORE.tagline}</Text>
      
      <View style={styles.plansContainer}>
        <PricingCard 
          title="Weekly" 
          price={`$${PLANS.CORE.weekly}`} 
          period="week"
          selected={selectedPlan === 'weekly'}
          onPress={() => setSelectedPlan('weekly')}
        />
        <PricingCard 
          title="Yearly" 
          price={`$${PLANS.CORE.yearly}`} 
          period="year"
          selected={selectedPlan === 'yearly'}
          onPress={() => setSelectedPlan('yearly')}
        />
      </View>

      <Text style={styles.trialText}>Includes {PLANS.CORE.trialDays}-Day Free Trial</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Start Free Trial</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 50,
  },
  plansContainer: {
    marginBottom: 30,
  },
  trialText: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.text,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
