import { configureStore } from '@reduxjs/toolkit';
import taskSliceReducer from './task/task.slice';

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
