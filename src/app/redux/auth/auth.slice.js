import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUseCase, registerUseCase, logoutUseCase, authRepository } from '../../boot';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('auth.slice: loginAsync called');
      const result = await loginUseCase.execute(email, password);
      console.log('auth.slice: loginAsync result:', result);
      return result;
    } catch (error) {
      console.error('auth.slice: loginAsync error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('auth.slice: registerAsync called');

      const result = await registerUseCase.execute(email, password);
      console.log('auth.slice: registerAsync result:', result);
      
      await logoutUseCase.execute();
      console.log('auth.slice: Signed out after registration');
      
      return { registered: true };
    } catch (error) {
      console.error('auth.slice: registerAsync error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('auth.slice: logoutAsync called');
      await logoutUseCase.execute();
      console.log('auth.slice: logoutAsync completed');
      return null;
    } catch (error) {
      console.error('auth.slice: logoutAsync error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  initializing: true,
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.initializing = false;
      console.log('auth.slice: setUser called with:', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.registrationSuccess = false;
        console.log('auth.slice: loginAsync fulfilled');
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
        console.error('auth.slice: loginAsync rejected:', action.payload);
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
        // User is already signed out from the thunk
        // Keep user as null so they stay on login page
        state.user = null;
        console.log('auth.slice: registerAsync fulfilled - user must login');
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
        console.error('auth.slice: registerAsync rejected:', action.payload);
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.registrationSuccess = false;
        console.log('auth.slice: logoutAsync fulfilled');
      });
  },
});

export const { setUser, clearError, clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;

// Re-exported so App.js can subscribe without importing firebase directly.
export { authRepository };
