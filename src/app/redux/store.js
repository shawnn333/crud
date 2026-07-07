// app/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskSliceReducer from './task/task.slice';

// Load state from localStorage
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

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('tasksState', serializedState);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    tasks: taskSliceReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;