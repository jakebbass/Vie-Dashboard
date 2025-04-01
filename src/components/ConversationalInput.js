//
//  ConversationalInput.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//


// src/components/ConversationalInput.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConversationalInput() {
  // Placeholder for our AI conversational interface
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hi there! How can I help you with your financial planning today?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 },
  text: { fontSize: 16 }
});