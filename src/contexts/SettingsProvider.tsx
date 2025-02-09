import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '../services/api/settings';
import { Settings } from '../types/settings';

const COMPATIBLE_BACKEND_VERSION = '0.3.*';

interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    error: Error | null;
    isCompatibleBackend: boolean;
    compatibleBackendVersion: string;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: null,
    loading: true,
    isCompatibleBackend: true,
    compatibleBackendVersion: COMPATIBLE_BACKEND_VERSION,
    error: null,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isCompatibleBackend, setIsCompatibleBackend] = useState<boolean>(true)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsApi.getSettings();
                setSettings(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        if (!settings) return;
        if (!settings.api_version || settings.api_version === 'development') {
            setIsCompatibleBackend(true);
            return;
        }
        const [major, minor, patch]: string[] = settings.api_version.split('.');
        const [majorBackend, minorBackend, patchBackend]: string[] = COMPATIBLE_BACKEND_VERSION.split('.');
        // it is not compatible less than 0.3.0
        setIsCompatibleBackend(
            (major == '*' || major == majorBackend) &&
            (minor == '*' || minor == minorBackend) &&
            (patch == '*' || patch == patchBackend)
        );
    }, [settings])

    return (
        <SettingsContext.Provider value={{ settings, loading, error, isCompatibleBackend, compatibleBackendVersion: COMPATIBLE_BACKEND_VERSION }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
