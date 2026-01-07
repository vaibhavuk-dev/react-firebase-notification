# Contributing to react-firebase-notification

First off, thank you for considering contributing to `react-firebase-notification`! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

We love all kinds of contributions, whether it's:
- 🐛 Reporting a bug
- 📝 Improving documentation
- 🔧 Submitting a fix
- 💡 Proposing new features

## 🚀 Getting Started

If you're new to open source, this is a great place to start! Here’s how to set up your local development environment.

### 1. Fork and Clone
1.  Fork the repository (click the "Fork" button in the top right of this page).
2.  Clone your fork locally:
    ```bash
    git clone https://github.com/YOUR-USERNAME/react-firebase-notification.git
    cd react-firebase-notification
    ```

### 2. Install Dependencies
We use `npm` for dependency management.
```bash
npm install
```

### 3. Start Development
To compile the library in watch mode (so it rebuilds when you save):
```bash
npm run build -- --watch
```

---

## 🧪 Testing Your Changes

The best way to test your changes is to run the included example app.

1.  Open a **new terminal window** (keep the build watch command running in the first one).
2.  Navigate to the example folder:
    ```bash
    cd examples/demo-vite
    ```
3.  Install example dependencies:
    ```bash
    npm install
    ```
4.  Start the demo app:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Tip:** You might need to update the `firebaseConfig` in `examples/demo-vite/src/App.tsx` with your own project credentials to test actual notifications.

---

## ✅ Running Tests

Before submitting a Pull Request, please make sure all tests pass.

```bash
npm test
```

If you add a new feature, please try to add a test case for it in the `test/` folder.

---

## 📮 Submitting a Pull Request (PR)

1.  **Create a Branch**: Create a new branch for your feature or fix.
    ```bash
    git checkout -b feat-my-new-feature
    # or
    git checkout -b fix-login-bug
    ```
2.  **Commit Changes**: We recommend using [Conventional Commits](https://www.conventionalcommits.org/).
    - `feat: add new hook for background messages`
    - `fix: crash on ios devices`
    - `docs: update readme typo`
3.  **Push**: Push your branch to your fork.
    ```bash
    git push origin feat-my-new-feature
    ```
4.  **Open PR**: Go to the original repository and click "Compare & pull request". Add a clear description of what you changed and why.

---

## ❓ Need Help?

If you get stuck or have questions, feel free to open a [Discussion](https://github.com/vaibhavuk-dev/react-firebase-notification/discussions) or an Issue. We're happy to help you get your contribution merged!

Happy Coding! 💻 
