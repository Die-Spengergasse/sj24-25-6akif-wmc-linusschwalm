import {Stack} from "expo-router";
import React from "react";
import {useAppContext} from "@/context/AppContext";


export default function RootLayout() {
    const {username} = useAppContext();

    if (!username) {
        return <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginScreen"/>
        </Stack>;
    }
    else
    {
        return (
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="index"/>
            </Stack>
        )
    }
}