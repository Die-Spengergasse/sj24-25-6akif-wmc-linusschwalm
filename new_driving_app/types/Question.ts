export interface Answer {
    guid: string;
    text: string;
}

export interface Question {
    guid: string;
    number: number;
    text: string;
    points: number;
    imageUrl: string;
    moduleGuid: string;
    topicGuid: string;
    answers: Answer[];
}

export function isAnswer(item: any): item is Answer {
    return (
        typeof item === "object" &&
        "guid" in item &&
        typeof item.guid === "string" &&
        "text" in item &&
        typeof item.text === "string"
    );
}

export function isQuestion(item: any): item is Question {
    return (
        typeof item === "object" &&
        "guid" in item &&
        typeof item.guid === "string" &&
        "number" in item &&
        typeof item.number === "number" &&
        "text" in item &&
        typeof item.text === "string" &&
        "points" in item &&
        typeof item.points === "number" &&
        "imageUrl" in item &&
        typeof item.imageUrl === "string" &&
        "moduleGuid" in item &&
        typeof item.moduleGuid === "string" &&
        "topicGuid" in item &&
        typeof item.topicGuid === "string" &&
        "answers" in item &&
        Array.isArray(item.answers) &&
        item.answers.every(isAnswer)
    );
}

export interface CheckedAnswer {
    guid: string;
    isChecked: boolean;
}

export function isCheckedAnswer(item: any): item is CheckedAnswer {
    return (
        typeof item === "object" &&
        "guid" in item &&
        typeof item.guid === "string" &&
        "isChecked" in item &&
        typeof item.isChecked === "boolean"
    );
}

export interface CheckAnswersResponse {
    pointsReachable: number;
    pointsReached: number;
    checkResult: {
        [key: string]: boolean;
    };
}