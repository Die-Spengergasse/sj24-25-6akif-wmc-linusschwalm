import {axiosInstance} from "@/utils/apiClient";
import {Linking} from "react-native";
import {useAppContext} from "@/context/AppContext";

export async function redirectIfNotAuthenticated(redirectUri: string) {
    const { actions: { setActiveUser } } = useAppContext();

    console.log("Redirecting to authentication...");
    try {
        const response = await axiosInstance.get('/oauth/me');
        setActiveUser(response.data.user);
    }
    catch (error: any) {
        if (error.response?.status === 401)
            await Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL}/oauth/login?redirectUri=${redirectUri}`);
    }
}