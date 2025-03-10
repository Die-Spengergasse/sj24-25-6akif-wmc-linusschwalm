'use client';

import { useReducer, useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";
import ModalDialog from "../components/ModalDialog";
import TodosEdit, { TodoEditRef } from "./TodosEdit";
import TodoItemDelete from "./TodosDelete";
import React from "react";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

type EditDeleteReducerAction = 
    | { type: null; todoItem: null }
    | { type: "edit" | "delete"; todoItem: TodoItem };
type EditDeleteState =
    | { actionType: null; todoItem: null }
    | { actionType: "edit" | "delete"; todoItem: TodoItem };

function editDeleteReducer(
    state: EditDeleteState,
    action: EditDeleteReducerAction
): EditDeleteState {
    switch (action.type) {
        case "edit":
            return { todoItem: action.todoItem, actionType: "edit" };
        case "delete":
            return { todoItem: action.todoItem, actionType: "delete" };
        default:
            return { todoItem: null, actionType: null };
    }
}

export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedTodo, selectedTodoDispatch] = useReducer(editDeleteReducer, { actionType: null, todoItem: null });
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const todoEditRef = React.createRef<TodoEditRef>();

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const filteredTodoItems = selectedCategory
        ? todoItems.filter(item => item.categoryName === selectedCategory)
        : todoItems;

    return (
        <div className={styles.categories}>
            <h1>Todo Liste</h1>
            <select onChange={handleCategoryChange}>
                <option value="">Alle Kategorien</option>
                {categories.map(category => (
                    <option key={category.guid} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            <ul>
                {filteredTodoItems.map(item => (
                    <li
                        key={item.guid}
                        className={
                            new Date(item.dueDate) < new Date() ? styles.overdue : styles.onTime
                        }
                    >
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Kategorie: {item.categoryName} (GUID {item.categoryGuid})</p>
                        <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                        <span
                            className={styles.editIcon}
                            onClick={() => selectedTodoDispatch({ type: "edit", todoItem: item })}
                            title="Edit"
                            >✏️</span>
                        <span
                            className={styles.editIcon}
                            onClick={() => selectedTodoDispatch({ type: "delete", todoItem: item })}
                            title="Delete"
                            >🗑️</span>
                    </li>
                ))}
            </ul>

            {selectedTodo.actionType == "edit" && (
                <ModalDialog title={`Edit ${selectedTodo.todoItem.title}`}
                onOk={() => todoEditRef.current?.startSubmit()}
                onCancel={() => selectedTodoDispatch({ type: null, todoItem: null })}>
                    <TodosEdit todoItem={selectedTodo.todoItem}
                        ref={todoEditRef}
                        onSubmitted={() => selectedTodoDispatch({ type: null, todoItem: null })} />
                </ModalDialog>
            )}
            {selectedTodo.actionType == "delete" && (
                <TodoItemDelete todoItem={selectedTodo.todoItem}
                    onCancel={() => selectedTodoDispatch({ type: null, todoItem: null })}
                    onDeleted={() => selectedTodoDispatch({ type: null, todoItem: null })} />
            )}
        </div>
    );
}
