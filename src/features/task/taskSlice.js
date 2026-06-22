import { createSlice } from '@reduxjs/toolkit';

const TASKS_STORAGE_KEY = 'crud_tasks_state';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Unable to load tasks from localStorage:', error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(TASKS_STORAGE_KEY, serializedState);
  } catch (error) {
    console.warn('Unable to save tasks to localStorage:', error);
  }
};

const initialState = loadState() ?? {
  tasks: [],
  filter: '',
  activeNav: 'all',
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
        createdAt: new Date(),
      });
      saveState(state);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveState(state);
    },
    toggleComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
      saveState(state);
    },
    editTask: (state, action) => {
      const { id, text } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.text = text;
      }
      saveState(state);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      saveState(state);
    },
    setActiveNav: (state, action) => {
      state.activeNav = action.payload;
      saveState(state);
    },
    clearTasks: (state) => {
      state.tasks = [];
      saveState(state);
    },
  },
});

export const { 
  addTask, 
  deleteTask, 
  toggleComplete, 
  editTask, 
  setFilter, 
  setActiveNav,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;