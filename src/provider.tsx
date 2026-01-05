import React, { createContext } from 'react';
import { FirebaseNotificationContextValue, FirebaseNotificationProviderProps } from './types';
import { useFirebaseNotificationController } from './hooks/useFirebaseNotificationController';

export const FirebaseNotificationContext = createContext<FirebaseNotificationContextValue | null>(null);

export const FirebaseNotificationProvider: React.FC<FirebaseNotificationProviderProps> = (props) => {
    const value = useFirebaseNotificationController(props);

    return (
        <FirebaseNotificationContext.Provider value={value}>
            {props.children}
        </FirebaseNotificationContext.Provider>
    );
};
