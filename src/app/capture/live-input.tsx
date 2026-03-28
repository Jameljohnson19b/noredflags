import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function LiveInputScreen() {
  const [input, setInput] = useState('');

  const handleCapture = () => {
    // Will integrate with classifyStatement and DeepSeek later
    console.log('Captured:', input);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture the Moment</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput}
          placeholder="What happened? What was said?"
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, !input.trim() && styles.buttonDisabled]} 
        onPress={handleCapture}
        disabled={!input.trim()}
      >
        <Text style={styles.buttonText}>Capture Signal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    minHeight: 150,
    marginBottom: 20,
  },
  textInput: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.text, // Simple white button
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.background, // Black text
    fontSize: 16,
    fontWeight: 'bold',
  },
});
