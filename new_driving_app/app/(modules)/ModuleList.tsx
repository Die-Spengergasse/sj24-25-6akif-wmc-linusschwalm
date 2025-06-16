import {Alert, Button, Modal, StyleSheet, Text, TextInput, View} from "react-native";
import {SwipeListView} from "react-native-swipe-list-view";
import {Link} from "expo-router";
import React, {useState} from "react";
import {createModule, deleteModule} from "@/utils/modules/modulesApiClient";
import {isErrorResponse} from "@/utils/apiClient";
import {Module} from "@/types/Module";
import {getModules} from "@/utils/modules/modulesApiClient";

interface ModuleListProps {
    modules: Module[] | null;
    setModules: React.Dispatch<React.SetStateAction<Module[] | null>>;
    setError: (value: string) => void;
}

function handleDelete(guid: string, setError: (value: string) => void, setModules: React.Dispatch<React.SetStateAction<Module[] | null>>) {
    Alert.alert(
        "Modul löschen",
        "Möchtest du dieses Modul wirklich löschen?",
        [
            { text: "Abbrechen", style: "cancel" },
            {
                text: "Löschen",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await deleteModule(guid);
                        if (isErrorResponse(response)) {
                            setError(response.message);
                        } else {
                            setModules((prev) => prev?.filter((module) => module.guid !== guid) || null);
                        }
                    } catch (error) {
                        setError("Fehler beim Löschen des Moduls:");
                    }
                },
            },
        ]
    );
}

async function handleCreateModule(
    number: number,
    name: string,
    passcode: string,
    setModules: React.Dispatch<React.SetStateAction<Module[] | null>>,
    setError: (value: string) => void
) {
    try {
        const response = await createModule(number, name, passcode);
        if (isErrorResponse(response)) {
            setError(response.message);
        } else {
            const updatedModules = await getModules(); // Liste erneut abrufen
            if (isErrorResponse(updatedModules)) {
                setError(updatedModules.message);
            } else {
                setModules(updatedModules); // State aktualisieren
            }
        }
    } catch (error) {
        setError("Fehler beim Erstellen des Moduls:");
    }
}

export default function ModuleList({ modules, setModules, setError }: ModuleListProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [number, setNumber] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [passcode, setPasscode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    return (
        <View style={styles.container}>
            <Button title="Modul hinzufügen" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Neues Modul hinzufügen</Text>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Modulnummer"
                            keyboardType="numeric"
                            value={number}
                            onChangeText={setNumber}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Modulname"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Passwort (optional)"
                            secureTextEntry={true}
                            value={passcode}
                            onChangeText={setPasscode}
                        />
                        <Button
                            title="Hinzufügen"
                            onPress={async () => {
                                const moduleNumber = parseInt(number, 10);
                                if (!isNaN(moduleNumber) && name.trim()) {
                                    await handleCreateModule(
                                        moduleNumber,
                                        name.trim(),
                                        passcode,
                                        setModules,
                                        setErrorMessage
                                    );
                                    setNumber("");
                                    setName("");
                                    setPasscode("");
                                    setModalVisible(false);
                                    setErrorMessage("");
                                } else {
                                    setErrorMessage(
                                        "Fehler: Die Eingabe ist ungültig. Bitte stellen Sie sicher, dass:\n" +
                                        "- 'Modulnummer' eine Zahl zwischen 1 und 999999 ist.\n" +
                                        "- 'Modulname' zwischen 1 und 255 Zeichen lang ist."
                                    );
                                }
                            }}
                        />
                        <Button title="Abbrechen" onPress={() => {
                            setModalVisible(false);
                            setErrorMessage("");
                        }} />
                    </View>
                </View>
            </Modal>
            {modules ? (
                <SwipeListView
                    data={modules}
                    keyExtractor={(item) => item.guid}
                    renderItem={({ item }) => (
                        <Link
                            href={{
                                pathname: '/topics/[guid]',
                                params: { guid: item.guid },
                            }}
                            style={styles.moduleItem}
                        >
                            <Text style={styles.moduleName}>{item.name}</Text>
                        </Link>
                    )}
                    renderHiddenItem={({ item }) => (
                        <View style={styles.hiddenItem}>
                            <Text
                                style={styles.deleteText}
                                onPress={() => handleDelete(item.guid, setError, setModules)}
                            >
                                Löschen
                            </Text>
                        </View>
                    )}
                    rightOpenValue={-100}
                />
            ) : (
                <Text style={styles.loadingText}>Module werden geladen...</Text>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 8,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    moduleItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    moduleName: {
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