import {isTodoItem, TodoItem} from "@/types/TodoItem";
import {axiosInstance, createErrorResponse, ErrorResponse} from "@/utils/apiClient";

export async function getTodoItems(): Promise<TodoItem[] | ErrorResponse> {
    try {
        const todoItemsResponse = await axiosInstance.get<TodoItem[]>("api/todoitems");
        return todoItemsResponse.data.filter(isTodoItem);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}