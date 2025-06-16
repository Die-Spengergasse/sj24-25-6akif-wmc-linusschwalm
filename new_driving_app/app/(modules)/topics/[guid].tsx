import {isTopic, Topic} from "@/types/Topic";
import {useEffect, useState} from "react";
import {useFocusEffect} from "expo-router";
import {createErrorResponse, ErrorResponse, isErrorResponse} from "@/utils/apiClient";
import {getTopics} from "@/utils/topics/topicsApiClient";
import {useAppContext} from "@/context/AppContext";
import {useSearchParams} from "expo-router/build/hooks";
import TopicList from "@/app/(modules)/topics/TopicList";

async function fetchTopics(
    guid: string,
    setTopics: React.Dispatch<React.SetStateAction<Topic[] | null>>,
    setError: (value: string) => void
): Promise<void> {
    try {
        const data = await getTopics(guid);
        if (isErrorResponse(data)) {
            setTopics(null);
            setError(data.message);
        } else if (Array.isArray(data) && data.every(isTopic)) {
            setTopics(data);
        } else {
            setTopics(null);
            setError("Ungültige Datenstruktur erhalten.");
        }
    } catch (error) {
        setTopics(null);
        setError("Fehler beim Abrufen der Topics.");
    }
}

export default function Guid() {
    const searchParams = useSearchParams();
    const guid = searchParams.get("guid");
    const context = useAppContext();
    const [topics, setTopics] = useState<Topic[] | null>(null);

    useEffect(() => {
        if (typeof guid === "string") {
            fetchTopics(guid, setTopics, context.actions.setError);
        } else {
            context.actions.setError("Ungültiger oder fehlender GUID-Parameter.");
        }
    }, [guid, context.actions]);

    return(
        <TopicList moduleGuid={guid} topics={topics} setTopics={setTopics} setError={context.actions.setError} />
    )
}