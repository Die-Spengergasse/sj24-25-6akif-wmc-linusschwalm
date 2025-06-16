import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function ErrorViewer() {
    const todoAppState = useAppContext();
    const [visible, setVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0)); // Für Fade-In/Out-Animation

    useEffect(() => {
        if (todoAppState.error) {
            setVisible(true);

            // Fade-In-Animation starten
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Fehlernachricht nach 5 Sekunden automatisch ausblenden
            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setVisible(false);
                    todoAppState.actions.setError("");
                });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [todoAppState.error]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.errorViewer, { opacity: fadeAnim }]}>
            <View style={styles.errorContent}>
                <Text style={styles.errorText}>{todoAppState.error}</Text>
                <TouchableOpacity
                    style={styles.errorButton}
                    onPress={() => {
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => {
                            setVisible(false);
                            todoAppState.actions.setError("");
                        });
                    }}
                >
                    <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    errorViewer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#f8d7da",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    errorContent: {
        alignItems: "center",
    },
    errorText: {
        color: "#721c24",
        fontSize: 16,
        marginBottom: 12,
        textAlign: "center",
    },
    errorButton: {
        backgroundColor: "#f5c6cb",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    buttonText: {
        color: "#721c24",
        fontSize: 14,
        fontWeight: "bold",
    },
});