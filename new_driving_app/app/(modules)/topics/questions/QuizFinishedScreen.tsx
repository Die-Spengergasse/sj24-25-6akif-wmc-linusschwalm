import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

interface QuizFinishedScreenForModulesProps {
    totalPointsReached: number;
    totalPointsReachable: number;
}

export default function QuizFinishedScreen({ totalPointsReached, totalPointsReachable }: QuizFinishedScreenForModulesProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push("/(modules)");
    };

    return (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
                Du hast {totalPointsReached} von {totalPointsReachable} Punkten erreicht!
            </Text>
            <Pressable onPress={handleNavigation} style={styles.link}>
                <Text style={styles.linkText}>Zurück zu den Modulen</Text>
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