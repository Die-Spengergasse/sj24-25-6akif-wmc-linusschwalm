export interface Topic {
    guid: string;
    name: string;
    questionCount: number;
}

export function isTopic(item: any): item is Topic {
    return (
        typeof item === "object" &&
        "guid" in item &&
        typeof item.guid === "string" &&
        "name" in item &&
        typeof item.name === "string" &&
        "questionCount" in item &&
        typeof item.questionCount === "number"
    );
}