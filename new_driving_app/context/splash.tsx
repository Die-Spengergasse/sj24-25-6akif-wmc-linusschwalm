import { SplashScreen } from 'expo-router';
import { useAppContext } from './AppContext';

export function SplashScreenController() {
    const { isLoading } = useAppContext();

    if (!isLoading) {
        SplashScreen.hideAsync();
    }

    return null;
}
