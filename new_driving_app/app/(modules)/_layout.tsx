import {Stack} from "expo-router";


export default function RootLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="topics/[guid]"/>
            <Stack.Screen name="topics/questions/[guid]"/>
        </Stack>
    )
}