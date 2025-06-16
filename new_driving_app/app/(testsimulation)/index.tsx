import React, { useState, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAppContext } from "@/context/AppContext";
import QuestionsList from "@/components/QuestionsList";
import { getQuestionsForSimulation } from "@/utils/testsimulation/testsimulationApiClient";
import { isErrorResponse } from "@/utils/apiClient";
import { Module } from "@/types/Module";
import { Question } from "@/types/Question";

export default function TestSimulationIndexScreen() {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const context = useAppContext();

    useFocusEffect(
        useCallback(() => {
            const fetchModules = async () => {
                try {
                    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/modules`);
                    const data = await response.json();
                    setModules(data);
                } catch (error) {
                    context.actions.setError("Fehler beim Abrufen der Module: " + error);
                }
            };

            fetchModules();
        }, [context])
    );

    const startSimulation = async (moduleGuid: string) => {
        try {
            const response = await getQuestionsForSimulation(moduleGuid, 20);
            if (isErrorResponse(response)) {
                context.actions.setError(response.message);
            } else {
                setQuestions(response);
            }
        } catch (error) {
            context.actions.setError("Fehler beim Abrufen der Fragen: " + error);
        }
    };

    if (questions) {
        return <QuestionsList questions={questions} isForModules={false} />;
    }

    if (selectedModule) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Modul: {selectedModule.name}</Text>
                <Button title="Prüfung starten" onPress={() => startSimulation(selectedModule.guid)} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prüfungssimulation</Text>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.guid}
                renderItem={({ item }) => (
                    <Button title={item.name} onPress={() => setSelectedModule(item)} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
});