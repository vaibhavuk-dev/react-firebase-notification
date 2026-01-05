# react-firebase-notification

> Build a small, well-documented React library that manages FCM permission/token lifecycle, service worker registration, foreground/background message handling, and optional UI.

## Features

- **useFirebaseNotification**: Hook to manage permission and token.
- **FirebaseNotificationProvider**: Context provider for global configuration.
- **useFirebaseOnMessage**: Hook to handle foreground messages.
- Lightweight and TypeScript ready.

## Installation

```bash
npm install react-firebase-notification firebase
```

## Quick Start

1. Wrap your app with `FirebaseNotificationProvider`.

```tsx
import { FirebaseNotificationProvider } from 'react-firebase-notification';
import { firebaseConfig } from './firebase'; // Your firebase config

function App() {
  return (
    <FirebaseNotificationProvider firebaseConfig={firebaseConfig} vapidKey="YOUR_VAPID_KEY">
      <YourComponent />
    </FirebaseNotificationProvider>
  );
}
```

2. Use the hook in your component.

```tsx
import { useFirebaseNotification } from 'react-firebase-notification';

function YourComponent() {
  const { requestPermission, token } = useFirebaseNotification();

  return (
    <div>
      <button onClick={requestPermission}>Enable Notifications</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
}
```

## License

MIT
