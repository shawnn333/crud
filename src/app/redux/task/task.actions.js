import * as types from './task.types';

export const addTask = (task) => ({
  type: types.ADD_TASK,
  payload: task,
});

export const deleteTask = (id) => ({
  type: types.DELETE_TASK,
  payload: id,
});

export const toggleTask = (id) => ({
  type: types.TOGGLE_TASK,
  payload: id,
});

export const editTask = (id, text) => ({
  type: types.EDIT_TASK,
  payload: { id, text },
});

export const setFilter = (filter) => ({
  type: types.SET_FILTER,
  payload: filter,
});

export const setActiveNav = (nav) => ({
  type: types.SET_ACTIVE_NAV,
  payload: nav,
});

export const setLoading = (loading) => ({
  type: types.SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: types.SET_ERROR,
  payload: error,
});

export const clearTasks = () => ({
  type: types.CLEAR_TASKS,
});

export const setTasks = (tasks) => ({
  type: types.SET_TASKS,
  payload: tasks,
});


export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_TASKS_REQUEST });
    dispatch(setLoading(true));
    
    try {
      const stored = localStorage.getItem('tasksState');
      const data = stored ? JSON.parse(stored).tasks : [];
      
      dispatch(setTasks(data));
      dispatch({ type: types.FETCH_TASKS_SUCCESS });
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch({ type: types.FETCH_TASKS_FAILURE, payload: error.message });
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

// 2. Add Task
export const addTaskThunk = (taskData) => {
  return async (dispatch) => {
    dispatch({ type: types.ADD_TASK_REQUEST });
    dispatch(setLoading(true));
    
    try {
      const task = {
        id: Date.now(),
        text: typeof taskData === 'string' ? taskData : taskData.text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      dispatch(addTask(task));
      dispatch({ type: types.ADD_TASK_SUCCESS });
      dispatch(setLoading(false));
      return task;
    } catch (error) {
      dispatch({ type: types.ADD_TASK_FAILURE, payload: error.message });
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

// 3. Delete Task
export const deleteTaskThunk = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.DELETE_TASK_REQUEST });
    dispatch(setLoading(true));
    
    try {
      dispatch(deleteTask(id));
      dispatch({ type: types.DELETE_TASK_SUCCESS });
      dispatch(setLoading(false));
      return true;
    } catch (error) {
      dispatch({ type: types.DELETE_TASK_FAILURE, payload: error.message });
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

// 4. Toggle Task
export const toggleTaskThunk = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.TOGGLE_TASK_REQUEST });
    dispatch(setLoading(true));
    
    try {
      dispatch(toggleTask(id));
      dispatch({ type: types.TOGGLE_TASK_SUCCESS });
      dispatch(setLoading(false));
      return true;
    } catch (error) {
      dispatch({ type: types.TOGGLE_TASK_FAILURE, payload: error.message });
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

// 5. Edit Task
export const editTaskThunk = (id, text) => {
  return async (dispatch) => {
    dispatch({ type: types.EDIT_TASK_REQUEST });
    dispatch(setLoading(true));
    
    try {
      dispatch(editTask(id, text));
      dispatch({ type: types.EDIT_TASK_SUCCESS });
      dispatch(setLoading(false));
      return true;
    } catch (error) {
      dispatch({ type: types.EDIT_TASK_FAILURE, payload: error.message });
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};
