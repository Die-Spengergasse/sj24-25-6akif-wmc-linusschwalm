import React, {useEffect} from "react";
import {View, Text, StyleSheet, Alert} from "react-native";
import {SwipeListView} from "react-native-swipe-list-view";
import {deleteTopic} from "@/utils/topics/topicsApiClient";
import {Topic} from "@/types/Topic";
import {isErrorResponse} from "@/utils/apiClient";
import {Link} from "expo-router";

interface TopicListProps {
    moduleGuid: string | null;
    topics: Topic[] | null;
    setTopics: React.Dispatch<React.SetStateAction<Topic[] | null>>;
    setError: (value: string) => void;
}

function handleDelete(topicGuid: string, setTopics: React.Dispatch<React.SetStateAction<Topic[] | null>>, setError: (value: string) => void) {
    Alert.alert(
        "Topic löschen",
        "Möchtest du dieses Topic wirklich löschen, alle Fragen in diesem Topic werden gelöscht?",
        [
            {text: "Abbrechen", style: "cancel"},
            {
                text: "Löschen",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await deleteTopic(topicGuid);
                        if (!response) {
                            setTopics((prev) => prev?.filter((topic) => topic.guid !== topicGuid) || null);
                        } else {
                            setError(response.message);
                        }
                    } catch (error) {
                        if (isErrorResponse(error)) {
                            setError(error.message);
                        } else {
                            setError("Fehler beim Löschen des Topics:");
                        }
                    }
                },
            },
        ]
    );
}

export default function TopicList({moduleGuid, topics, setTopics, setError}: TopicListProps) {


    useEffect(() => {
        if (!(typeof moduleGuid === "string")) {
            setError("Ungültige oder fehlende GUID-Parameter.");
        }
    }, []);

    return (
        <View style={styles.container}>
            {topics ? (
                <SwipeListView
                    data={topics}
                    keyExtractor={(item) => item.guid}
                    renderItem={({item}) => (
                        <Link
                            href={
                                {
                                    pathname: "/topics/questions/[guid]",
                                    params: {moduleGuid: moduleGuid, topicGuid: item.guid},
                                }
                            }
                            style={styles.topicItem}>
                            <Text style={styles.topicName}>{item.name}</Text>
                        </Link>
                    )}
                    renderHiddenItem={({item}) => (
                        <View style={styles.hiddenItem}>
                            <Text
                                style={styles.deleteText}
                                onPress={() => handleDelete(item.guid, setTopics, setError)}
                            >
                                Löschen
                            </Text>
                        </View>
                    )}
                    rightOpenValue={-100}
                />
            ) : (
                <Text style={styles.loadingText}>Topics werden geladen...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    topicItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    topicName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    loadingText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    hiddenItem: {
        justifyContent: "center",
        alignItems: "flex-end",
        height: "100%",
        paddingRight: 20,
        marginVertical: 8,
    },
    deleteText: {
        color: "#d11a2a",
        fontWeight: "600",
        fontSize: 16,
    },
});