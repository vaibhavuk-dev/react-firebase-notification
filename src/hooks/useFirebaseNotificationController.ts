import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getMessaging, Messaging, getToken, deleteToken as deleteFCMToken, isSupported } from 'firebase/messaging';
import { FirebaseNotificationContextValue, FirebaseNotificationProviderProps, PermissionState } from '../types';
import { registerServiceWorker } from '../utils/serviceWorker';

export const useFirebaseNotificationController = (
    props: FirebaseNotificationProviderProps
): FirebaseNotificationContextValue => {
    const {
        firebaseConfig,
        vapidKey,
        serviceWorkerPath = '/firebase-messaging-sw.js',
        onTokenChange,
        onError,
        autoRequestPermission = false,
    } = props;

    const [permission, setPermission] = useState<PermissionState>(
        typeof Notification !== 'undefined' ? (Notification.permission as PermissionState) : 'default'
    );
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [messagingInstance, setMessagingInstance] = useState<Messaging | null>(null);
    const [isSupportedState, setIsSupportedState] = useState<boolean>(false);
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

    const appRef = useRef<FirebaseApp | null>(null);

    const handleError = useCallback((err: Error) => {
        setError(err);
        if (onError) onError(err);
        console.error('Firebase Notification Error:', err);
    }, [onError]);

    // Sync state with Navigator Permissions API
    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' as any })
                .then((permissionStatus) => {
                    permissionStatus.onchange = () => {
                        setPermission(permissionStatus.state as PermissionState);
                    };
                })
                .catch((err) => {
                    // Some browsers might not support 'notifications' in permissions query
                    console.log('Permissions API query failed:', err);
                });
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const init = async () => {
            try {
                const supported = await isSupported();
                setIsSupportedState(supported);

                if (supported) {
                    if (getApps().length === 0) {
                        appRef.current = initializeApp(firebaseConfig);
                    } else {
                        appRef.current = getApp();
                    }

                    const msg = getMessaging(appRef.current);
                    setMessagingInstance(msg);
                    setIsReady(true);
                } else {
                    console.warn('Firebase Messaging is not supported in this browser.');
                }
            } catch (err: any) {
                handleError(err);
            }
        };

        init();
    }, [firebaseConfig, handleError]);

    useEffect(() => {
        const registerSW = async () => {
            if (isReady && isSupportedState && serviceWorkerPath) {
                try {
                    const registration = await registerServiceWorker(serviceWorkerPath);
                    setSwRegistration(registration);
                } catch (err: any) {
                    handleError(err);
                }
            }
        };
        registerSW();
    }, [isReady, isSupportedState, serviceWorkerPath, handleError]);

    const requestPermission = useCallback(async (): Promise<string | null> => {
        if (!messagingInstance) {
            const err = new Error('Firebase Messaging not initialized or not supported');
            handleError(err);
            return null;
        }

        try {
            const perm = await Notification.requestPermission();
            setPermission(perm as PermissionState);

            if (perm === 'granted') {
                const currentToken = await getToken(messagingInstance, {
                    vapidKey,
                    serviceWorkerRegistration: swRegistration || undefined,
                });

                if (currentToken) {
                    setToken(currentToken);
                    if (onTokenChange) onTokenChange(currentToken);
                    return currentToken;
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                    return null;
                }
            } else {
                console.log('Notification permission not granted.');
                return null;
            }
        } catch (err: any) {
            handleError(err);
            return null;
        }
    }, [vapidKey, onTokenChange, messagingInstance, swRegistration, handleError]);

    const deleteToken = useCallback(async (): Promise<boolean> => {
        if (!messagingInstance) return false;
        try {
            const deleted = await deleteFCMToken(messagingInstance);
            if (deleted) {
                setToken(null);
                if (onTokenChange) onTokenChange(null);
            }
            return deleted;
        } catch (err: any) {
            handleError(err);
            return false;
        }
    }, [onTokenChange, messagingInstance, handleError]);

    useEffect(() => {
        if (autoRequestPermission && isReady && permission === 'default') {
            requestPermission();
        }
    }, [autoRequestPermission, isReady, permission, requestPermission]);

    return useMemo(() => ({
        permission,
        token,
        requestPermission,
        deleteToken,
        error,
        messaging: messagingInstance,
        isSupported: isSupportedState,
        serviceWorkerRegistration: swRegistration,
    }), [
        permission,
        token,
        requestPermission,
        deleteToken,
        error,
        messagingInstance,
        isSupportedState,
        swRegistration,
    ]);
};
