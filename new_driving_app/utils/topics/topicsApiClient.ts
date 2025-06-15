import {axiosInstance, createErrorResponse, ErrorResponse} from "@/utils/apiClient";
import {isTopic, Topic} from "@/types/Topic";

export async function getTopics(guid: string): Promise<Topic[] | ErrorResponse> {
    try {
        const topicsResponse = await axiosInstance.get<Topic[]>(`api/topics?assignedModule=${guid}`);
        return topicsResponse.data.filter(isTopic);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function deleteTopic(guid: string): Promise<void | ErrorResponse> {
    try {
        await axiosInstance.delete(`api/topics/${guid}?removeQuestions=true`);
    } catch (e) {
        return createErrorResponse(e);
    }
}

export async function createTopic(name: string): Promise<Topic | ErrorResponse> {
    try {
        return await axiosInstance.post("api/topics", { name });
    } catch (e) {
        return createErrorResponse(e);
    }
}