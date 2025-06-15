import {useLocalSearchParams} from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Question } from "@/types/Question";
import { getQuestions } from "@/utils/questions/questionsApiClient";
import {useAppContext} from "@/context/AppContext";
import QuestionsList from "@/components/QuestionsList";

export default function QuestionScreen() {
    const { moduleGuid, topicGuid } = useLocalSearchParams();
    const moduleGuidString = Array.isArray(moduleGuid) ? moduleGuid[0] : moduleGuid;
    const topicGuidString = Array.isArray(topicGuid) ? topicGuid[0] : topicGuid;
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const context = useAppContext();

    useEffect(() => {
        async function fetchQuestions() {
            if (moduleGuid && topicGuid) {
                const response = await getQuestions(moduleGuidString, topicGuidString);
                if (Array.isArray(response)) {
                    setQuestions(response);
                } else {
                    context.actions.setError(response.message);
                }
            }
        }

        fetchQuestions();
    }, [moduleGuid, topicGuid]);

    return (
        <View style={styles.container}>
            {questions ? (
                <QuestionsList questions={questions} isForModules={true} />
            ) : (
                <Text style={styles.loadingText}>Fragen werden geladen...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    questionText: { fontSize: 16, marginVertical: 8 },
    loadingText: { fontSize: 16, textAlign: "center", marginTop: 20 },
});