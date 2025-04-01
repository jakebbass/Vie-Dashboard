//
//  DashBoardScreen.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//
// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchDashboardData } from '../services/calculationService';
import ChartPlaceholder from '../components/ChartPlaceholder';
import ConversationalInput from '../components/ConversationalInput';

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const monthlyDeposit = 100; // Default input; later, this comes from the conversational UI

  useEffect(() => {
    // Fetch our calculated dashboard data
    fetchDashboardData(monthlyDeposit).then((res) => {
      setData(res);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ConversationalInput />
      <Text style={styles.header}>Interactive Consumer Finance Dashboard</Text>
      {data ? (
        <View>
          <Text style={styles.subHeader}>Loan Schedule</Text>
          <ChartPlaceholder title="Loan Schedule Chart" />
          <Text style={styles.subHeader}>Accumulation</Text>
          <ChartPlaceholder title="Accumulation Chart" />
          <Text style={styles.subHeader}>Asset Value</Text>
          <ChartPlaceholder title="Asset Value Chart" />
        </View>
      ) : (
        <Text>Loading data...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 20, fontWeight: '600', marginVertical: 12 }
});