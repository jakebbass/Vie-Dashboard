//
//  ChartPlaceholder.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//


// src/components/ChartPlaceholder.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ChartPlaceholder({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={require('../../assets/chart-placeholder.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  image: { width: '100%', height: 200 }
});