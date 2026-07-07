// app/redux/task/task.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Primary source: app's persisted Redux state
      const stored = localStorage.getItem('tasksState');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const tasksData = parsed?.tasks;
          if (Array.isArray(tasksData)) return tasksData;
          if (tasksData && Array.isArray(tasksData.tasks)) return tasksData.tasks;
        } catch (e) {
          // continue to fallback
        }
      }

      // Fallback: repository localStorage key used by LocalStorageTaskRepository
      const repoStored = localStorage.getItem('tasks_data');
      if (repoStored) {
        try {
          const parsedRepo = JSON.parse(repoStored);
          // repo format: { tasks: [...], nextId: N }
          if (parsedRepo && Array.isArray(parsedRepo.tasks)) {
            // Tasks may be stored as full objects; return them directly
            return parsedRepo.tasks.map(t => ({
              id: t.id,
              title: t.title,
              completed: !!t.completed,
              createdAt: t.createdAt || t.createdAt
            }));
          }
        } catch (e) {
          // ignore and return empty
        }
      }

      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const task = {
        id: Date.now(),
        title: typeof taskData === 'string' ? taskData : taskData.title || taskData.text,
      };
      // Return only id and title in the fulfilled payload
      return { id: task.id, title: task.title };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTaskAsync = createAsyncThunk(
  'tasks/toggleTask',
  async (id, { rejectWithValue }) => {
    try {
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editTaskAsync = createAsyncThunk(
  'tasks/editTask',
  async ({ id, title }, { rejectWithValue }) => {
    try {
      return { id, title };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [], // ✅ Always an array
  filter: '',
  activeNav: 'all',
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setActiveNav: (state, action) => {
      state.activeNav = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.tasks = action.payload || []; // ✅ Ensure array
        state.loading = false;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tasks = []; // ✅ Reset to empty array on error
      })
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        // Build full task object for local state/storage using original thunk arg
        const arg = action.meta && action.meta.arg;
        let createdAt = new Date().toISOString();
        if (arg) {
          if (typeof arg === 'string') {
            createdAt = new Date().toISOString();
          } else if (arg.createdAt) {
            try {
              createdAt = new Date(arg.createdAt).toISOString();
            } catch (e) {
              createdAt = new Date().toISOString();
            }
          }
        }
        const newTask = {
          id: action.payload.id,
          title: action.payload.title,
          completed: false,
          createdAt,
        };
        state.tasks.push(newTask);
        state.loading = false;
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskAsync.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload);
        if (task) {
          task.completed = !task.completed;
        }
        state.loading = false;
      })
      .addCase(toggleTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTaskAsync.fulfilled, (state, action) => {
        const { id, title } = action.payload;
        const task = state.tasks.find(task => task.id === id);
        if (task) {
          task.title = title;
        }
        state.loading = false;
      })
      .addCase(editTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setActiveNav, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;