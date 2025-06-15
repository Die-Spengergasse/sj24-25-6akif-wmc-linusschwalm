import React, { useState } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, Button, KeyboardAvoidingView, Platform} from "react-native";
import {Question, CheckedAnswer, CheckAnswersResponse} from "@/types/Question";
import { checkAnswers } from "@/utils/questions/questionsApiClient";
import { MaterialIcons } from "@expo/vector-icons";
import {useAppContext} from "@/context/AppContext";

interface QuestionsListProps {
    questions: Question[];
    isForModules: boolean;
}

import { ScrollView } from "react-native";
import {ErrorResponse, isErrorResponse} from "@/utils/apiClient";
import QuizFinishedScreen from "@/app/(modules)/topics/questions/QuizFinishedScreen";
import QuizFinishedScreenForTestSimulation from "@/app/(testsimulation)/QuizFinishedScreenForTestSimulation";

export default function QuestionsList({ questions, isForModules }: QuestionsListProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [checkedAnswers, setCheckedAnswers] = useState<CheckedAnswer[] | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [totalPointsReached, setTotalPointsReached] = useState(0);
    const [totalPointsReachable, setTotalPointsReachable] = useState(0);
    const context = useAppContext();

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (answerGuid: string) => {
        if (showResult) return;
        setSelectedAnswers((prev) =>
            prev.includes(answerGuid) ? prev.filter((id) => id !== answerGuid) : [...prev, answerGuid]
        );
    };

    const handleSubmit = async () => {
        try {
            const answersWithStatus = currentQuestion.answers.map((answer) => ({
                guid: answer.guid,
                isChecked: selectedAnswers.includes(answer.guid),
            }));

            const response: CheckAnswersResponse | ErrorResponse = await checkAnswers(currentQuestion.guid, answersWithStatus);

            if (isErrorResponse(response)) {
                context.actions.setError(response.message);
                return;
            }

            if (response && response.checkResult) {
                setCheckedAnswers(
                    currentQuestion.answers.map((answer) => ({
                        guid: answer.guid,
                        isChecked: response.checkResult[answer.guid] || false,
                    }))
                );

                const isQuestionCorrect = response.pointsReached === response.pointsReachable;
                setIsCorrect(isQuestionCorrect);
                setTotalPointsReached((prev) => prev + response.pointsReached);
                setTotalPointsReachable((prev) => prev + response.pointsReachable);
                setShowResult(true);
            } else {
                context.actions.setError("Die Antwort des Servers ist nicht im erwarteten Format.");
            }
        } catch (error) {
            context.actions.setError("Fehler beim Überprüfen der Antworten: " + error);
        }
    };

    const handleNextQuestion = () => {
        setShowResult(false);
        setSelectedAnswers([]);
        setCheckedAnswers(null);
        setIsCorrect(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    if (quizFinished) {
        return isForModules ? (
            <QuizFinishedScreen totalPointsReached={totalPointsReached} totalPointsReachable={totalPointsReachable} />
        ) : (
            <QuizFinishedScreenForTestSimulation
                totalPointsReached={totalPointsReached}
                totalPointsReachable={totalPointsReachable}
            />
        )
    }

    const questionStyle = showResult
        ? isCorrect === true
            ? styles.correctQuestion
            : isCorrect === false
                ? styles.wrongQuestion
                : styles.defaultQuestion
        : styles.defaultQuestion;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.container, questionStyle]}>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>
                    {currentQuestion.imageUrl && (
                        <Image source={{ uri: currentQuestion.imageUrl }} style={styles.image} />
                    )}
                    <View style={styles.answersContainer}>
                        {currentQuestion.answers.map((answer) => {
                            const isSelected = selectedAnswers.includes(answer.guid);
                            const isChecked = checkedAnswers?.find((ca) => ca.guid === answer.guid)?.isChecked;

                            return (
                                <TouchableOpacity
                                    key={answer.guid}
                                    style={[
                                        styles.answer,
                                        isSelected && styles.selectedAnswer,
                                        showResult && isChecked && styles.correctAnswer,
                                    ]}
                                    onPress={() => handleAnswerSelect(answer.guid)}
                                >
                                    <Text style={styles.answerText}>{answer.text}</Text>
                                    {isSelected && <MaterialIcons name="check" size={20} color="black" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {showResult ? (
                        <Button
                            title={
                                currentQuestionIndex < questions.length - 1
                                    ? "Nächste Frage"
                                    : "Quiz beenden"
                            }
                            onPress={handleNextQuestion}
                        />
                    ) : (
                        <Button title="Antwort bestätigen" onPress={handleSubmit} />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    defaultQuestion: { backgroundColor: "white" },
    correctQuestion: { backgroundColor: "#c8f7c5" },
    wrongQuestion: { backgroundColor: "#f7c5c5" },
    questionText: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
    image: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 16 },
    answersContainer: { marginBottom: 16 },
    answer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        marginVertical: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    selectedAnswer: {
        backgroundColor: "#d0e8ff",
    },
    correctAnswer: {
        backgroundColor: "#c8f7c5",
    },
    answerText: { fontSize: 16 },
});