import { useEffect } from 'react';
import { onMessage, MessagePayload } from 'firebase/messaging';
import { useRef } from 'react';
import { useFirebaseNotification } from './useFirebaseNotification';

export const useFirebaseOnMessage = (callback: (payload: MessagePayload) => void) => {
    const { messaging } = useFirebaseNotification();
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            if (callbackRef.current) {
                callbackRef.current(payload);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [messaging]);
};
