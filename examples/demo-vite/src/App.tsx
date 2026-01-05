import { useState } from 'react'
import { FirebaseNotificationProvider, useFirebaseNotification, useFirebaseOnMessage } from 'react-firebase-notification'
import './App.css'

// Firebase Configuration (Loaded from .env file)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const NotificationComponent = () => {
  const { permission, token, requestPermission, deleteToken, error, isSupported } = useFirebaseNotification();
  const [lastMessage, setLastMessage] = useState<any>(null);

  useFirebaseOnMessage((payload) => {
    console.log("Foreground message received:", payload);
    setLastMessage({
      ...payload,
      receivedAt: new Date().toISOString()
    });
  });

  const getPermissionBadgeClass = () => {
    switch (permission) {
      case 'granted': return 'status-badge granted';
      case 'denied': return 'status-badge denied';
      default: return 'status-badge default';
    }
  };

  const getPermissionText = () => {
    switch (permission) {
      case 'granted': return 'Granted ✓';
      case 'denied': return 'Denied ✗';
      default: return 'Not Requested';
    }
  };

  if (!isSupported) {
    return (
      <div className="notification-card">
        <div className="error-message">
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong>Not Supported</strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              Firebase Messaging is not supported in this browser. Please use a modern browser with Service Worker support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-card">
      {/* Permission Status */}
      <div className="status-section">
        <div className="status-label">Permission Status</div>
        <div className={getPermissionBadgeClass()}>
          <span className="status-dot"></span>
          {getPermissionText()}
        </div>
      </div>

      {/* FCM Token */}
      <div className="token-section">
        <div className="status-label">FCM Registration Token</div>
        <div className="token-display">
          {token || ''}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span style={{ fontSize: '1.5rem' }}>❌</span>
          <div>
            <strong>Error</strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{error.message}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button className="btn btn-primary" onClick={() => requestPermission()}>
          🔔 Request Permission & Get Token
        </button>
        <button className="btn btn-secondary" onClick={() => deleteToken()}>
          🗑️ Delete Token
        </button>
      </div>

      {/* Last Message */}
      {lastMessage && (
        <div className="message-card">
          <div className="message-header">
            <div className="message-title">
              📬 {lastMessage.notification?.title || 'Message Received'}
            </div>
            <div className="message-time">
              {new Date(lastMessage.receivedAt).toLocaleTimeString()}
            </div>
          </div>
          <div className="message-content">
            <pre className="message-pre">{JSON.stringify(lastMessage, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <FirebaseNotificationProvider
      firebaseConfig={firebaseConfig}
      vapidKey={VAPID_KEY}
      serviceWorkerPath={`/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&authDomain=${firebaseConfig.authDomain}&projectId=${firebaseConfig.projectId}&storageBucket=${firebaseConfig.storageBucket}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`}
      onTokenChange={(token) => console.log("Token changed:", token)}
      onError={(error) => console.error("Firebase Notification Error:", error)}
    >
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">🔥 React Firebase Notification</h1>
          <p className="app-subtitle">
            A modern library for Firebase Cloud Messaging in React
          </p>
        </div>
        <NotificationComponent />
      </div>
    </FirebaseNotificationProvider>
  )
}

export default App
