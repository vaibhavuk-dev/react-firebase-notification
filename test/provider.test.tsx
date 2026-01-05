import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FirebaseNotificationProvider, useFirebaseNotification } from '../src';
import React from 'react';

// Mock Firebase
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    getApp: vi.fn(),
}));

vi.mock('firebase/messaging', () => ({
    getMessaging: vi.fn(),
    getToken: vi.fn(),
    deleteToken: vi.fn(),
    onMessage: vi.fn(),
    isSupported: vi.fn(() => Promise.resolve(true)),
}));

// Mock service worker registration to avoid browser API issues in JSDOM
vi.mock('../src/utils/serviceWorker', () => ({
    registerServiceWorker: vi.fn(() => Promise.resolve({ scope: 'test-scope' })),
}));

const TestComponent = () => {
    const { permission, isSupported } = useFirebaseNotification();
    return (
        <div>
            <div data-testid="permission">Permission: {permission}</div>
            <div data-testid="support">Supported: {String(isSupported)}</div>
        </div>
    );
};

describe('FirebaseNotificationProvider', () => {
    it('renders children and provides context', async () => {
        render(
            <FirebaseNotificationProvider firebaseConfig={{ apiKey: 'test' }} vapidKey="test">
                <TestComponent />
            </FirebaseNotificationProvider>
        );

        // Initial render might be supported=false until async check completes
        expect(screen.getByTestId('permission')).toBeTruthy();

        // Wait for async isSupported to resolve
        await waitFor(() => {
            expect(screen.getByTestId('support').textContent).toContain('true');
        });
    });
});
