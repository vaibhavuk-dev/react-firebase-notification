import { FirebaseOptions } from 'firebase/app';
import { Messaging } from 'firebase/messaging';

export type PermissionState = 'default' | 'granted' | 'denied';

export interface FirebaseNotificationContextValue {
    permission: PermissionState;
    token: string | null;
    requestPermission: () => Promise<string | null>;
    deleteToken: () => Promise<boolean>;
    error?: Error | null;
    messaging: Messaging | null;
    isSupported: boolean;
    serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export interface FirebaseNotificationProviderProps {
    children: React.ReactNode;
    firebaseConfig: FirebaseOptions;
    vapidKey?: string;
    serviceWorkerPath?: string;
    onTokenChange?: (token: string | null) => void;
    onError?: (error: Error) => void;
    autoRequestPermission?: boolean;
}
