import { configureStore } from '@reduxjs/toolkit';
import taskSliceReducer from './task/task.slice';

// Note: Task persistence is handled entirely by LocalStorageTaskRepository
// (src/data/repositories/LocalStorageTaskRepository.js), not here. Redux
// only holds in-memory UI state; it is hydrated from the repository via
// the fetchTasksAsync thunk on app start, and never reads/writes storage
// directly.

// Allow enabling Redux DevTools in production via a runtime localStorage flag.
// This keeps DevTools off by default in production but lets you enable it
// for debugging on the published site by running:
// localStorage.setItem('enableReduxDev','true'); location.reload();
let devToolsEnabled = false;
try {
  const runtimeFlag = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('enableReduxDev') === 'true';
  devToolsEnabled = process.env.NODE_ENV !== 'production' || runtimeFlag || !!(typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__);
} catch (e) {
  devToolsEnabled = process.env.NODE_ENV !== 'production';
}

export const store = configureStore({
  reducer: {
    tasks: taskSliceReducer,
  },
  devTools: devToolsEnabled,
});

export default store;
