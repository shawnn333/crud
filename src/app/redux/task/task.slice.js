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
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (!state?.auth?.user) {
        console.log(`🔍 No user logged in, skipping fetch`);
        return [];
      }
      
      console.log(`📖 Fetching tasks from Firebase...`);
      const tasks = await getAllTasksUseCase.execute();
      console.log(`✅ Fetched ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      if (error.message?.includes('signed in') || 
          error.code === 'permission-denied' || 
          error.message?.includes('permission')) {
        console.log(`🔒 Permission denied, returning empty array`);
        return [];
      }
      console.error(`❌ Error fetching tasks: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      let title;
      let createdAt;
      
      if (typeof taskData === 'string') {
        title = taskData;
      } else if (taskData && typeof taskData === 'object') {
        title = taskData.title || taskData.text;
        createdAt = taskData.createdAt;
      }
      
      if (!title) {
        throw new Error('Task title is required');
      }
      
      const titleString = typeof title === 'string' ? title : String(title);
      
      if (!titleString.trim()) {
        throw new Error('Task title cannot be empty');
      }
      
      console.log(`📝 Adding task: "${titleString}"`);
      const result = await addTaskUseCase.execute(titleString, createdAt);
      console.log(`✅ Task added: "${result.title}" (ID: ${result.id})`);
      return result;
    } catch (error) {
      console.error(`❌ Error adding task: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Deleting task: ${id}`);
      await removeTaskUseCase.execute(id);
      console.log(`✅ Task deleted: ${id}`);
      return id;
    } catch (error) {
      console.error(`❌ Error deleting task: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTaskAsync = createAsyncThunk(
  'tasks/toggleTask',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Toggling task: ${id}`);
      const result = await toggleTaskCompletionUseCase.execute(id);
      console.log(`✅ Task toggled: "${result.title}" (${result.completed ? 'Done' : 'Pending'})`);
      return result;
    } catch (error) {
      console.error(`❌ Error toggling task: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const editTaskAsync = createAsyncThunk(
  'tasks/editTask',
  async ({ id, title }, { rejectWithValue }) => {
    try {
      console.log(`✏️ Editing task: ${id} → "${title}"`);
      const result = await updateTaskUseCase.execute(id, { title });
      console.log(`✅ Task edited: "${result.title}"`);
      return result;
    } catch (error) {
      console.error(`❌ Error editing task: ${error.message}`);
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

export const { 
  setFilter, 
  setActiveNav, 
  clearTasks
} = taskSlice.actions;
export default taskSlice.reducer;