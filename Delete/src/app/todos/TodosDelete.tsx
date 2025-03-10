import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalDialog from "../components/ModalDialog";
import { Category } from "../types/Category";
import { axiosInstance, createEmptyErrorResponse, createErrorResponse, ErrorResponse, isErrorResponse } from "../utils/apiClient";
import { revalidatePath } from "next/cache";
import { TodoItem } from "../types/TodoItem";
import { deleteTodoItem } from "./todosApiClient";

type TodoItemDeleteProps = {
    todoItem: TodoItem;
    onCancel: () => void;
    onDeleted: () => void;
}
async function handleSubmit(
    todoItem: string,
    deleteTasks: boolean,
    setError: Dispatch<SetStateAction<ErrorResponse>>,
    onDeleted: () => void
) {
    const response = await deleteTodoItem(todoItem, deleteTasks);
    if (isErrorResponse(response)) {
        setError(response);
    } else {
        onDeleted();
    }
}


export default function TodoItemDelete({ todoItem, onCancel, onDeleted }: TodoItemDeleteProps) {
    const [deleteTasks, setDeleteTasks] = useState<boolean>(false);
    const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
    useEffect(() => {
        if (error.message) {
            alert(error.message);
        }
    }, [error]);


    return (
        <div>
            <ModalDialog
                title={`Delete TodoItem ${todoItem.title}`}
                onCancel={onCancel}
                onOk={() => handleSubmit(todoItem.guid, deleteTasks, setError, onDeleted)}>
                <p>Möchtest du das TodoItem {todoItem.title} wirklich löschen?</p>
                <p>
                    <span>Sollen alle Tasks gelöscht werden?</span>
                    <input type={"checkbox"} name="deleteTasks" onChange={() => setDeleteTasks(!deleteTasks)} />
                </p>
            </ModalDialog>
        </div>
    );
}