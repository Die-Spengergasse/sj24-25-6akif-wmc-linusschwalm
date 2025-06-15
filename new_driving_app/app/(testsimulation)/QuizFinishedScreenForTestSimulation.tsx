import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

interface QuizFinishedScreenForTestSimulationProps {
    totalPointsReached: number;
    totalPointsReachable: number;
}

export default function QuizFinishedScreenForTestSimulation({ totalPointsReached, totalPointsReachable }: QuizFinishedScreenForTestSimulationProps) {
    const router = useRouter();

    const saveResult = async () => {
        try {
            const storedResults = await AsyncStorage.getItem("examResults");
            const results = storedResults ? JSON.parse(storedResults) : [];
            const newResult = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                totalPointsReached,
                totalPointsReachable,
            };
            await AsyncStorage.setItem("examResults", JSON.stringify([...results, newResult]));
        } catch (error) {
            console.error("Fehler beim Speichern der Ergebnisse:", error);
        }
    };

    const handleReset = async () => {
        await saveResult();
        router.push("/(testsimulation)");
    };

    return (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
                Du hast {totalPointsReached} von {totalPointsReachable} Punkten erreicht!
            </Text>
            <Pressable onPress={handleReset} style={styles.link}>
                <Text style={styles.linkText}>Zurücksetzen</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    resultContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    resultText: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    link: { padding: 8, backgroundColor: "blue", borderRadius: 4 },
    linkText: { fontSize: 16, color: "white", textDecorationLine: "none" },
});