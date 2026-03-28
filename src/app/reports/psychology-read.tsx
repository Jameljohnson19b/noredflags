import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { ReportHeader } from '../../components/reports/ReportHeader';
import { ReportSection } from '../../components/reports/ReportSection';

export default function PsychologyReadScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ReportHeader title="Psychology Read" date="Generated Today" />
      
      <ReportSection 
        heading="Avoidant Attachment Signals" 
        body="Repeated use of 'I just need space' combined with defensive posture when discussing plans over the weekend points heavily toward classic avoidant strategies."
        highlightScore={25} // Escalation1
      />

      <ReportSection 
        heading="Love Bombing Indicators" 
        body="Using extreme language like 'soulmate' within 48 hours is a known risk. We captured this 3 times in quick succession."
        highlightScore={60} // Escalation3
      />
      
      <ReportSection 
        heading="Stability Factors" 
        body="They demonstrated active listening and emotional consistency when you described your work stress, momentarily pulling standard risk down."
        highlightScore={0} // Safe
      />
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
    paddingTop: 40,
  }
});
