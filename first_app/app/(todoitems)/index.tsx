import React, { useReducer, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getTodoItems } from '@/utils/todoitems/apiClient';
import { TodoItem } from '@/types/TodoItem';

type State = {
    selectedCategory: string | null;
    todoItems: TodoItem[];
    filteredItems: TodoItem[];
    error: string | null;
};

type Action =
    | { type: 'SET_TODO_ITEMS'; payload: TodoItem[] }
    | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
    | { type: 'SET_ERROR'; payload: string };

const initialState: State = {
    selectedCategory: null,
    todoItems: [],
    filteredItems: [],
    error: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_TODO_ITEMS':
            return {
                ...state,
                todoItems: action.payload,
                filteredItems: state.selectedCategory
                    ? action.payload.filter(item => item.categoryGuid === state.selectedCategory)
                    : action.payload,
                error: null,
            };
        case 'SET_SELECTED_CATEGORY':
            return {
                ...state,
                selectedCategory: action.payload === "" ? null : action.payload,
                filteredItems: action.payload === ""
                    ? state.todoItems // Zeige alle TodoItems an, wenn "All Categories" ausgewählt ist
                    : state.todoItems.filter(item => item.categoryGuid === action.payload),
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default function TodoItemsIndexScreen() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadTodoItems = useCallback(async () => {
        try {
            const items = await getTodoItems();
            if (Array.isArray(items)) {
                dispatch({ type: 'SET_TODO_ITEMS', payload: items });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            console.error(errorMessage);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTodoItems();
        }, [loadTodoItems])
    );

    return (
        <View style={styles.container}>
            {state.error && <Text style={styles.error}>{state.error}</Text>}
            <Picker
                selectedValue={state.selectedCategory ?? ""}
                onValueChange={(value) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: value })}
                style={styles.picker}
            >
                <Picker.Item label="All Categories" value="" />
                {[...new Set(state.todoItems.map(item => item.categoryName))].map((category, index) => (
                    <Picker.Item
                        key={index}
                        label={category}
                        value={state.todoItems.find(item => item.categoryName === category)?.categoryGuid}
                    />
                ))}
            </Picker>
            <FlatList
                data={state.filteredItems}
                keyExtractor={(item) => item.guid}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
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
    picker: {
        marginBottom: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
});