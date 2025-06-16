import {Stack, Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {AppProvider, useAppContext} from "@/context/AppContext";
import React from "react";
import ErrorViewer from "@/components/ErrorViewer";
import {SplashScreenController} from "@/context/splash";

function RootLayoutContent() {

    return (
        <Tabs>
            <Tabs.Screen
                name="(modules)"
                options={{
                    title: 'Modules',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="apps" color={color} size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="(testsimulation)"
                options={{
                    title: 'Test Simulation',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="school" color={color} size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="(myexams)"
                options={{
                    title: 'My Exams',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="clipboard" color={color} size={size}/>
                    ),
                }}
            />
        </Tabs>
    );
}

export default function RootLayout() {
    return (
        <AppProvider>
            <SplashScreenController />
            <RootLayoutContent />
            <ErrorViewer />
        </AppProvider>
    );
}