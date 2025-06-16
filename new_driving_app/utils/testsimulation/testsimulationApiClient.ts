import {isQuestion, Question} from "@/types/Question";
import {axiosInstance, createErrorResponse, ErrorResponse} from "@/utils/apiClient";

export async function getQuestionsForSimulation(moduleGuid: string, count: number): Promise<Question[] | ErrorResponse> {
    try {
        const questionsResponse = await axiosInstance
            .get<Question[]>(`/api/questions/${moduleGuid}?count=${count}`);
        return questionsResponse.data.filter(isQuestion);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}