import {createErrorResponse, ErrorResponse} from "@/utils/apiClient";
import {axiosInstance} from "@/utils/apiClient";
import {isModule, Module} from "@/types/Module";

export async function getModules(): Promise<Module[] | ErrorResponse> {
    try {
        const modulesResponse = await axiosInstance.get<Module[]>("api/modules");
        return modulesResponse.data.filter(isModule);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function deleteModule(guid: string): Promise<void | ErrorResponse> {
    try {
        await axiosInstance.delete(`api/modules/${guid}?removeQuestions=true`);
    } catch (e) {
        return createErrorResponse(e);
    }
}

export async function createModule(number: number, name: string, passcode: string): Promise<Module | ErrorResponse> {
    try {
        const response = await axiosInstance.post<Module>(`api/modules?password=${passcode}`, { number, name });
        return response.data;
    } catch (e) {
        return createErrorResponse(e);
    }
}