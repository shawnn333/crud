import { configureStore } from '@reduxjs/toolkit';
import taskSliceReducer from './task/task.slice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('tasksState');
    if (serializedState === null) {
      return undefined;
    }
    const parsed = JSON.parse(serializedState);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined;
    }

    const sliceState = parsed.tasks;
    if (!sliceState || typeof sliceState !== 'object' || Array.isArray(sliceState)) {
      return undefined;
    }

    if (sliceState.tasks && !Array.isArray(sliceState.tasks)) {
      sliceState.tasks = [];
    }
    if (typeof sliceState.filter !== 'string') {
      sliceState.filter = '';
    }
    if (typeof sliceState.activeNav !== 'string') {
      sliceState.activeNav = 'all';
    }
    if (typeof sliceState.loading !== 'boolean') {
      sliceState.loading = false;
    }

    return { tasks: sliceState };
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('tasksState', serializedState);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
};

const preloadedState = loadState();

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
  preloadedState,
  devTools: devToolsEnabled,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
