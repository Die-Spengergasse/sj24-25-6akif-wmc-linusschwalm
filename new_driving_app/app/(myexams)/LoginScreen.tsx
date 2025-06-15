import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@/context/AppContext';

type ExamResult = {
  id: string;
  date: string;
  totalPointsReached: number;
  totalPointsReachable: number;
};

export default function LoginScreen() {
  const { actions } = useAppContext();
  const [examResults, setExamResults] = useState<ExamResult[]>([]); // Typisierung des States

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedResults = await AsyncStorage.getItem('examResults');
        if (storedResults) {
          setExamResults(JSON.parse(storedResults) as ExamResult[]); // Typcasting der Daten
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Ergebnisse:', error);
      }
    };

    fetchResults();
  }, []);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Login mit Microsoft</Text>
        <Button title="Mit Microsoft anmelden" onPress={actions.login} />
        <Text style={styles.subtitle}>Gespeicherte Ergebnisse:</Text>
        {examResults.map((result) => (
            <Text key={result.id} style={styles.result}>
              {result.date}: {result.totalPointsReached} / {result.totalPointsReachable} Punkte
            </Text>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 24,
    textAlign: 'center',
  },
  result: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});