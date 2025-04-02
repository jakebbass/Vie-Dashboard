
// src/screens/DashboardScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/vie-logo-white-green.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Vie Dashboard</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your Financial Dashboard</Text>
        <Text style={styles.subtitle}>
          Your dynamic charts and capital account projections appear below.
        </Text>
        {/* Dynamic chart components will be inserted here */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  header: {
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    paddingVertical: 20
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.accent,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text
  }
});
