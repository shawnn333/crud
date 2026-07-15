# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Firebase Setup (required)

This app uses Firebase for authentication and task storage (`FirebaseTaskRepository` / `FirebaseAuthRepository`).

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com and create a new project.
2. In the project, go to **Build -> Authentication -> Get started -> Sign-in method** and enable **Email/Password**.
3. Go to **Build -> Firestore Database -> Create database** (start in production mode).

### 2. Get your config
Project settings (gear icon) -> General -> Your apps -> add a **Web app** -> copy the config values.

### 3. Fill in `.env`
Paste the values into the `REACT_APP_FIREBASE_*` variables in `.env` at the project root.
(These are safe to commit - they are not secret keys; access is controlled by the security rules below, not by hiding these values.)

### 4. Firestore security rules
Go to **Firestore Database -> Rules** and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This makes sure a signed-in user can only read/write their own tasks (stored at `users/{uid}/tasks/{taskId}`), and no CRUD is possible at all without being signed in.

### 5. Switching repository implementations
`REACT_APP_TASK_REPOSITORY` in `.env` controls which `ITaskRepository` implementation `boot.js` uses:
- `firebase` (default) - Firestore, per-user, requires login
- `localStorage` - browser storage, no login required
- `memory` - in-memory only, resets on every refresh

Nothing outside `boot.js` needs to change when switching - that's the whole point of the interface.
