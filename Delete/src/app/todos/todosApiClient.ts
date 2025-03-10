'use server';

import { revalidatePath } from "next/cache";
import { axiosInstance, createErrorResponse } from "../utils/apiClient";

export async function deleteTodoItem(todoItemGuid: string, deleteTasks: boolean) {
    try {
        await axiosInstance.delete(`TodoItems/${todoItemGuid}`, {params: {deleteTasks}});
        revalidatePath("/todos");
    } catch (e) {
        return createErrorResponse(e);
    }
}