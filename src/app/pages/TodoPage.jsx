// app/pages/TodoPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTaskAsync,      // ✅ Changed to async thunk
  deleteTaskAsync,   // ✅ Changed to async thunk
  toggleTaskAsync,   // ✅ Changed to async thunk
  editTaskAsync,     // ✅ Changed to async thunk
  fetchTasksAsync,   // ✅ Added to load tasks on mount
  setFilter, 
  setActiveNav 
} from '../../redux/task/task.slice';
import { TodoSidebar } from '../components/todo/TodoSidebar';
import { TodoInput } from '../components/todo/TodoInput';
import { TodoSearch } from '../components/todo/TodoSearch';
import { TodoTable } from '../components/todo/TodoTable';
import { TodoStats } from '../components/todo/TodoStats';
import { getAllTasksUseCase } from '../boot';

export const TodoPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const activeNav = useSelector((state) => state.tasks.activeNav);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  
  // Local state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // ✅ Load tasks on component mount
  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  // ✅ Show error if any
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  // Stats
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  // Get filtered tasks using use case
  const filteredTasks = getAllTasksUseCase.execute(filter, activeNav);

  // Get upcoming count
  const getUpcomingCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime() && 
             taskDate.getTime() <= nextWeek.getTime();
    }).length;
  };

  // ✅ Handlers with async thunks and loading states
  const handleAddTask = async (text) => {
    try {
      await dispatch(addTaskAsync({ title: text, createdAt: new Date().toISOString() })).unwrap();
    } catch (error) {
      alert('Failed to add task: ' + error.message);
    }
  };

  const handleAddWithDate = async (days) => {
    const input = document.querySelector('#task-input');
    if (input && input.value.trim()) {
      try {
        const date = new Date();
        date.setHours(0,0,0,0);
        date.setDate(date.getDate() + days);
        await dispatch(addTaskAsync({ title: input.value, createdAt: date.toISOString() })).unwrap();
        input.value = '';
      } catch (error) {
        alert('Failed to add task: ' + error.message);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await dispatch(deleteTaskAsync(id)).unwrap();
      } catch (error) {
        alert('Failed to delete task: ' + error.message);
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await dispatch(toggleTaskAsync(id)).unwrap();
    } catch (error) {
      alert('Failed to toggle task: ' + error.message);
    }
  };

  const handleEditTask = async (id, text) => {
    try {
      await dispatch(editTaskAsync({ id, title: text })).unwrap();
    } catch (error) {
      alert('Failed to edit task: ' + error.message);
    }
  };

  const handleNavClick = (nav) => {
    dispatch(setActiveNav(nav));
    dispatch(setFilter(''));
  };

  const handleFilterChange = (value) => {
    dispatch(setFilter(value));
  };

  const handleClearFilter = () => {
    dispatch(setFilter(''));
  };

  const handleClearNav = () => {
    dispatch(setActiveNav('all'));
  };

  // Format date

  // Get label
  const getNavLabel = () => {
    switch (activeNav) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming (7 Days)';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      default: return 'All Tasks';
    }
  };

  // Get empty message
  const getEmptyMessage = () => {
    switch (activeNav) {
      case 'today': 
        return { title: 'No tasks for today 🎯', sub: 'Add a task to get started!' };
      case 'upcoming': 
        return { title: 'No upcoming tasks 📅', sub: 'Plan ahead by adding tasks for the future!' };
      case 'this-week': 
        return { title: 'No tasks this week 📆', sub: 'Add some tasks for the week ahead!' };
      case 'this-month': 
        return { title: 'No tasks this month 📋', sub: 'Plan your month by adding tasks!' };
      default: 
        return { title: 'No tasks found', sub: 'Add a new task to get started! 🚀' };
    }
  };

  const emptyMessage = getEmptyMessage();

  // ✅ Show loading state
  if (loading && tasks.length === 0) {
    return (
      <div className="app-container" style={{ 
        justifyContent: 'center', 
        alignItems: 'center', 
        display: 'flex', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#1a4cff' }}></i>
          <p style={{ marginTop: '1rem', color: '#4a5a72' }}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TodoSidebar
        activeNav={activeNav}
        totalTasks={total}
        upcomingCount={getUpcomingCount()}
        onNavClick={handleNavClick}
      />

      <main className="main-content">
        <TodoStats
          done={done}
          total={total}
          label={getNavLabel()}
        />

        <TodoInput
          onAddTask={handleAddTask}
          onAddWithDate={handleAddWithDate}
        />

        <TodoSearch
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
          onClearNav={handleClearNav}
          activeNav={activeNav}
          placeholder={`Search ${getNavLabel().toLowerCase()}...`}
        />

        <TodoTable
          tasks={filteredTasks}
          editingId={editingId}
          editText={editText}
          onEditChange={setEditText}
          onSaveEdit={(id) => {
            handleEditTask(id, editText);
            setEditingId(null);
            setEditText('');
          }}
          onCancelEdit={() => {
            setEditingId(null);
            setEditText('');
          }}
          onEditKeyDown={(e, id) => {
            if (e.key === 'Enter') {
              handleEditTask(id, editText);
              setEditingId(null);
              setEditText('');
            } else if (e.key === 'Escape') {
              setEditingId(null);
              setEditText('');
            }
          }}
          onToggleComplete={handleToggleComplete}
          onStartEditing={(id) => {
            const task = tasks.find(t => t.id === id);
            if (task) {
              setEditingId(id);
              setEditText(task.title);
            }
          }}
          onDeleteTask={handleDeleteTask}
          emptyTitle={emptyMessage.title}
          emptySub={emptyMessage.sub}
        />
      </main>
    </div>
  );
};