# react-firebase-notification

[![npm version](https://img.shields.io/npm/v/react-firebase-notification.svg)](https://www.npmjs.com/package/react-firebase-notification)
[![npm downloads](https://img.shields.io/npm/dm/react-firebase-notification.svg)](https://www.npmjs.com/package/react-firebase-notification)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **The easiest way to add Firebase Cloud Messaging (FCM) to your React application.**

Managing Firebase notifications in React can be tricky—handling token lifecycles, service worker registration, and permission states often leads to messy boilerplate. **react-firebase-notification** abstracts all the complexity into a clean, type-safe hook and provider.

## ✨ Features

- 🔒 **Token Management**: Automatically handles FCM token generation and management.
- 📦 **Service Worker Auto-Register**: We handle the ugly `navigator.serviceWorker.register` stuff for you.
- 🪝 **Simple Hooks**: `useFirebaseNotification` for permissions/tokens and `useFirebaseOnMessage` for listening to messages.
- 🚀 **Framework Agnostic**: Works perfectly with **Vite**, **Create React App**, **Next.js (App & Pages Router)**, and more.
-  TypeScript First.

## 🤝 Supported Frameworks

While built for **React**, this library works in any React-based environment:

| Framework | Support Status | Notes |
|-----------|----------------|-------|
| **React (Vite / CRA)** | ✅ Full Support | Works out of the box. |
| **Next.js (App & Pages)**| ✅ Full Support | Use inside Client Components (`'use client'`). |
| **Remix** | ✅ Full Support | Works standardly in route components. |
| **Gatsby** | ✅ Full Support | Ensure `window` checks (handled internally). |
| **Astro** | ✅ Full Support | Use with `client:load` or `client:only="react"`. |
| **Ionic React** | ✅ Full Support | For PWA / Web deployments. |
| **React Native** | ❌ Not Supported | Use `react-native-firebase` instead. |

---

## 📦 Installation

```bash
npm install react-firebase-notification firebase
# or
yarn add react-firebase-notification firebase
# or
pnpm add react-firebase-notification firebase
```

---

## 🛠 Prerequisites

Before you start, you need two things from your [Firebase Console](https://console.firebase.google.com/):

1.  **Firebase Config Object**: found in Project Settings > General > Your Apps.
2.  **VAPID Key**: found in Project Settings > Cloud Messaging > Web configuration (Generate a new pair if you haven't).

---

## 📝 Step-by-Step Implementation

### Step 1: Create the Service Worker (Mandatory)

FCM requires a service worker to handle background notifications (when your app is closed or tab is hidden).

Create a file named `firebase-messaging-sw.js` in your project's **public** folder.

**File:** `public/firebase-messaging-sw.js`
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  // ⚠️ INSERT YOUR FIREBASE CONFIG HERE
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // path to your logo in public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

> **Note**: This file *must* stay in the `public` folder so it can be accessed at `http://your-site.com/firebase-messaging-sw.js`.

---

### Step 2: Choose Your Framework

#### 👉 Option A: React (Vite / Create React App)

Wrap your main application with the provider.

**File:** `src/main.tsx` or `src/App.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseNotificationProvider } from 'react-firebase-notification';
import App from './App';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseNotificationProvider 
      firebaseConfig={firebaseConfig} 
      vapidKey="YOUR_VAPID_KEY"
    >
      <App />
    </FirebaseNotificationProvider>
  </React.StrictMode>
);
```

#### 👉 Option B: Next.js (App Router)

Since the provider uses React Context, it must be a **Client Component**.

1. Create a logical wrapper component.

**File:** `components/NotificationProvider.tsx`
```tsx
'use client';

import { FirebaseNotificationProvider } from 'react-firebase-notification';

const firebaseConfig = {
  // your config
};

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseNotificationProvider 
      firebaseConfig={firebaseConfig} 
      vapidKey="YOUR_VAPID_KEY_HERE"
    >
      {children}
    </FirebaseNotificationProvider>
  );
}
```

2. Wrap your `layout.tsx`.

**File:** `app/layout.tsx`
```tsx
import NotificationProvider from '../components/NotificationProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

---

### Step 3: Using it in components

Now you can request permissions and listen for messages anywhere in your app.

**File:** `src/components/NotificationButton.tsx`
```tsx
import { useFirebaseNotification, useFirebaseOnMessage } from 'react-firebase-notification';

export const NotificationButton = () => {
  const { requestPermission, token, message } = useFirebaseNotification();

  // Listen for foreground messages
  useFirebaseOnMessage((payload) => {
    console.log('Foreground Message Received:', payload);
    alert(`New Message: ${payload.notification?.title}`);
  });

  return (
    <div>
      <h1>Deepmind Setup Complete</h1>
      {!token ? (
        <button onClick={requestPermission}>
          Enable Notifications
        </button>
      ) : (
        <p>✅ Notifications Enabled! Token: {token.slice(0, 10)}...</p>
      )}
    </div>
  );
};
```

---

## 📚 API Reference

### `<FirebaseNotificationProvider />`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `firebaseConfig` | `FirebaseOptions` | **Msndatory** | Your Firebase configuration object. |
| `vapidKey` | `string` | Optional | Web Push Certificate Key (Required for `getToken`). |
| `serviceWorkerPath` | `string` | Optional | Path to SW file. Default: `/firebase-messaging-sw.js`. |
| `autoRequestPermission`| `boolean` | Optional | If `true`, tries to request permission on mount. Default: `false`. |
| `onError` | `(err: Error) => void` | Optional | Callback when an error occurs (e.g. SW registration failed). |
| `onTokenChange` | `(token: string) => void` | Optional | Callback when `token` updates. |

### `useFirebaseNotification()` (Hook)

Returns an object with:

- `requestPermission: () => Promise<string | null>`: Triggers browser permission prompt. Returns token if granted.
- `token: string | null`: The current FCM registration token.
- `permission: 'default' | 'granted' | 'denied'`: Current permission state.
- `deleteToken: () => Promise<boolean>`: Invalidates the current token.
- `isSupported: boolean`: Returns `true` if the browser supports Firebase Messaging.

---

## ⚠️ Troubleshooting / Common Issues

1.  **"Store Not Found" or "MIME type checking failed"**:
    - Ensure `firebase-messaging-sw.js` is in your `public/` folder.
    - Verify you can open `http://localhost:3000/firebase-messaging-sw.js` in your browser.

2.  **Permissions not showing**:
    - Check if your browser blocks notifications for localhost.
    - Check the browser console errors.
    
3.  **Next.js "Window is not defined"**:
    - Ensure you are using the Provider inside a valid `'use client'` component or wrapper.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to set up the project locally and submit pull requests.

## License

MIT © [Vaibhav](https://github.com/vaibhavuk-dev)
