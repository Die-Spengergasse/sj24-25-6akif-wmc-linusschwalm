import React, { useCallback, useState } from "react";
import { Module } from "@/types/Module";
import { useFocusEffect, Link } from "expo-router";
import { getModules, deleteModule } from "@/utils/modules/modulesApiClient";
import { isErrorResponse } from "@/utils/apiClient";
import { useAppContext } from "@/context/AppContext";
import ModuleList from "@/app/(modules)/ModuleList";

export default function ModulesIndexScreen() {
    const [modules, setModules] = useState<Module[] | null>(null);
    const context = useAppContext();

    useFocusEffect(
        useCallback(() => {
            async function loadModules() {
                try {
                    const data = await getModules();
                    if (isErrorResponse(data)) {
                        context.actions.setError(data.message);
                    } else {
                        setModules(data);
                    }
                } catch (error) {
                    console.error("Fehler beim Laden der Module:", error);
                }
            }

            loadModules();
        }, [context])
    );

    return (
        <ModuleList modules={modules} setModules={setModules} setError={context.actions.setError} />
    );
}