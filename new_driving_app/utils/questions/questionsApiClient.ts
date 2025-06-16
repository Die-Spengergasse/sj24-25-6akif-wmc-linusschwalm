import {axiosInstance, createErrorResponse, ErrorResponse} from "@/utils/apiClient";
import {isQuestion, Question, CheckedAnswer, CheckAnswersResponse} from "@/types/Question";

export async function getQuestions(moduleGuid: string, topicGuid: string): Promise<Question[] | ErrorResponse> {
    try {
        const questionsResponse = await axiosInstance
            .get<Question[]>(`api/questions?moduleGuid=${moduleGuid}&topicGuid=${topicGuid}`);
        return questionsResponse.data.filter(isQuestion);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function checkAnswers(questionGuid: string, answers: CheckedAnswer[]): Promise<CheckAnswersResponse | ErrorResponse> {
    try {
        const response = await axiosInstance.post<CheckAnswersResponse>(`api/questions/${questionGuid}/checkanswers`, {checkedAnswers: answers});
        return response.data;
    } catch (e) {
        return createErrorResponse(e);
    }
}