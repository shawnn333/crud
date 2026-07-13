import * as types from './task.types';

const initialState = {
  tasks: [],
  filter: '',
  activeNav: 'all',
  loading: false,
  error: null,
};

export const taskReducer = (state = initialState, action) => {
  switch (action.type) {

    case types.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case types.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case types.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case types.EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, text: action.payload.text }
            : task
        ),
      };

    case types.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case types.SET_ACTIVE_NAV:
      return {
        ...state,
        activeNav: action.payload,
      };

    case types.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case types.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case types.CLEAR_TASKS:
      return {
        ...state,
        tasks: [],
      };

    case types.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    case types.FETCH_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case types.FETCH_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.ADD_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.ADD_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.ADD_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.DELETE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.DELETE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.TOGGLE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.TOGGLE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.TOGGLE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.EDIT_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.EDIT_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.EDIT_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
