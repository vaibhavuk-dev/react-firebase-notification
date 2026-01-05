import { useContext } from 'react';
import { FirebaseNotificationContext } from '../provider';
import { FirebaseNotificationContextValue } from '../types';

export const useFirebaseNotification = (): FirebaseNotificationContextValue => {
    const context = useContext(FirebaseNotificationContext);
    if (!context) {
        throw new Error('useFirebaseNotification must be used within a FirebaseNotificationProvider');
    }
    return context;
};
