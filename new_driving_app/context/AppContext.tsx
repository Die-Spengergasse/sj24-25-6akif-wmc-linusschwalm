import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { axiosInstance, isErrorResponse } from '@/utils/apiClient';
import {Linking} from "react-native";

type AppState = {
    username: string | null;
    error: string;
    isAuthenticated: boolean;
    isLoading: boolean;
};

type AppContextType = AppState & {
    actions: {
        setActiveUser: (username: string) => void;
        login: () => Promise<void>;
        logout: () => Promise<void>;
        setError: (value: string) => void;
    };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>({
        username: null,
        error: '',
        isAuthenticated: false,
        isLoading: true,
    });

    const setActiveUser = (username: string) => setState(prev => ({ ...prev, username, isAuthenticated: true }));

    const login = async () => {
        try {
            // const redirectUri = `${process.env.EXPO_PUBLIC_REDIRECT_URI}`;
            const redirectUri = `newdrivingapp://redirect`;
            const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/oauth/login?redirectUri=${redirectUri}`;
            await Linking.openURL(loginUrl);
        } catch (error) {
            setError('Login fehlgeschlagen.');
            console.error(error);
        }
    };

    const logout = async () => {
        setState(prev => ({ ...prev, username: null, isAuthenticated: false }));
        try {
            await axiosInstance.get('/oauth/logout');
        } catch (err) {
            if (isErrorResponse(err)) {
                setError(err.message);
            } else {
                setError('Logout fehlgeschlagen.');
            }
        }
    };

    const setError = (value: string) => setState(prev => ({ ...prev, error: value }));

    useEffect(() => {
        const handleRedirect = async ({ url }: { url: string }) => {
            console.log('Redirect URL:', url);
            // Einfach Userdaten abfragen
            try {
                const response = await axiosInstance.get('/oauth/me');
                if (response.status === 200) {
                    setActiveUser(response.data.Username); // oder firstname+lastname etc.
                }
            } catch (error) {
                setError('Benutzer ist nicht authentifiziert.');
                setState(prev => ({ ...prev, isAuthenticated: false, username: null }));
            }
        };

        const sub = Linking.addEventListener('url', handleRedirect);
        Linking.getInitialURL().then((url) => {
            if (url) handleRedirect({ url });
        });

        return () => sub.remove();
    }, []);


    return (
        <AppContext.Provider value={{ ...state, actions: { setActiveUser, login, logout, setError } }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};