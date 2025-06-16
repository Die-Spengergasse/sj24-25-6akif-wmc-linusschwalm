export interface Module {
    number: number;
    guid: string;
    name: string;
}

export function isModule(item: any): item is Module {
    return (
        typeof item === "object" &&
        "number" in item &&
        typeof item.number === "number" &&
        "guid" in item &&
        typeof item.guid === "string" &&
        "name" in item &&
        typeof item.name === "string"
    );
}