import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTaskUseCase,
  getAllTasksUseCase,
  removeTaskUseCase,
  updateTaskUseCase,
  toggleTaskCompletionUseCase,
} from '../../boot';

export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllTasksUseCase.execute();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const title = typeof taskData === 'string' ? taskData : (taskData.title || taskData.text);
      const createdAt = typeof taskData === 'object' ? taskData.createdAt : undefined;
      return await addTaskUseCase.execute(title, createdAt);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await removeTaskUseCase.execute(id);
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
      return await toggleTaskCompletionUseCase.execute(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editTaskAsync = createAsyncThunk(
  'tasks/editTask',
  async ({ id, title }, { rejectWithValue }) => {
    try {
      return await updateTaskUseCase.execute(id, { title });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
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
        state.tasks = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tasks = [];
      })
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {

        state.tasks.push(action.payload);
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
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
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
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
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
