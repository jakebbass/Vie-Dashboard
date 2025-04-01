
// src/screens/DashboardScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
// Import the function to run our calculations
import { fetchDashboardData } from '../services/calculationService';
// Import the function to save simulation data to Supabase
import { createSimulation } from '../services/dbService';

export default function DashboardScreen() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(100); // example default input
  const [simulationData, setSimulationData] = useState(null);
  const [simulationId, setSimulationId] = useState(null);
  const [error, setError] = useState(null);

  // This function runs when the "Run Simulation" button is pressed
  async function runSimulation() {
    try {
      // 1. Run your simulation calculations.
      const data = fetchDashboardData(monthlyDeposit);
      setSimulationData(data);

      // 2. Now that you have the simulation data, call the createSimulation function to save it in Supabase.
      const simId = await createSimulation(monthlyDeposit, data);
      setSimulationId(simId);
      console.log('Simulation saved with ID:', simId);
    } catch (err) {
      console.error('Error running simulation:', err);
      setError(err.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Interactive Consumer Finance Dashboard</Text>
      
      {/* Conversational Input or additional UI elements can go here */}

      <Button title="Run Simulation" onPress={runSimulation} />

      {simulationData && (
        <View style={styles.result}>
          <Text style={styles.subHeader}>Simulation Results</Text>
          <Text>Data successfully computed and saved!</Text>
          {simulationId && <Text>Simulation ID: {simulationId}</Text>}
        </View>
      )}
      
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 20, fontWeight: '600', marginVertical: 12 },
  result: { marginTop: 20 },
  error: { marginTop: 20, backgroundColor: '#fcc', padding: 10 },
  errorText: { color: '#900' }
});