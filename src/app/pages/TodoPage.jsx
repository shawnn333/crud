import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTaskAsync,
  deleteTaskAsync,
  toggleTaskAsync,
  editTaskAsync,
  fetchTasksAsync,
  setFilter, 
  setActiveNav
} from '../redux/task/task.slice';
import { TodoSidebar } from '../components/todo/TodoSidebar';
import { TodoInput } from '../components/todo/TodoInput';
import { TodoSearch } from '../components/todo/TodoSearch';
import { TodoTable } from '../components/todo/TodoTable';
import { TodoStats } from '../components/todo/TodoStats';

export const TodoPage = () => {
  const dispatch = useDispatch();
  
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const activeNav = useSelector((state) => state.tasks.activeNav);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    console.log('TodoPage: Fetching tasks...');
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error('TodoPage: Error:', error);
      alert('Error: ' + error);
    }
  }, [error]);

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  const getTaskDate = (task) => {
    const date = task.createdAt ? new Date(task.createdAt) : new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (filter && filter.trim()) {
      const term = filter.toLowerCase().trim();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(term));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    switch (activeNav) {
      case 'today':
        filtered = filtered.filter(t => getTaskDate(t).getTime() === today.getTime());
        break;
      case 'upcoming':
        filtered = filtered.filter(t => {
          const d = getTaskDate(t).getTime();
          return d > today.getTime() && d <= nextWeek.getTime();
        });
        break;
      case 'this-week':
        filtered = filtered.filter(t => {
          const d = getTaskDate(t).getTime();
          return d >= today.getTime() && d <= nextWeek.getTime();
        });
        break;
      case 'this-month':
        filtered = filtered.filter(t => {
          const d = getTaskDate(t).getTime();
          return d >= today.getTime() && d <= endOfMonth.getTime();
        });
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    });
  };

  const filteredTasks = getFilteredTasks();

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

  const handleAddTask = async (text) => {
    console.log('TodoPage: handleAddTask called with:', text);
    
    if (!text || typeof text !== 'string' || !text.trim()) {
      alert('Please enter a valid task description');
      return;
    }
    
    try {
      const taskData = { 
        title: text.trim(), 
        createdAt: new Date().toISOString() 
      };
      console.log('TodoPage: Dispatching addTaskAsync with:', taskData);
      
      const result = await dispatch(addTaskAsync(taskData)).unwrap();
      console.log('TodoPage: Task added successfully:', result);
    } catch (error) {
      console.error('TodoPage: Failed to add task:', error);
      alert('Failed to add task: ' + error.message);
    }
  };

  const handleAddWithDate = async (text, days) => {
    console.log('TodoPage: handleAddWithDate called with:', text, days);
    
    if (!text || typeof text !== 'string' || !text.trim()) {
      alert('Please enter a valid task description');
      return;
    }
    
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + days);
      
      const taskData = { 
        title: text.trim(), 
        createdAt: date.toISOString() 
      };
      console.log('TodoPage: Dispatching addTaskAsync with date:', taskData);
      
      const result = await dispatch(addTaskAsync(taskData)).unwrap();
      console.log('TodoPage: Task added successfully with date:', result);
    } catch (error) {
      console.error('TodoPage: Failed to add task with date:', error);
      alert('Failed to add task: ' + error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    console.log('TodoPage: Delete task called for ID:', id);
    if (window.confirm('Delete this task?')) {
      try {
        await dispatch(deleteTaskAsync(id)).unwrap();
        console.log('TodoPage: Task deleted successfully');
      } catch (error) {
        console.error('TodoPage: Failed to delete task:', error);
        alert('Failed to delete task: ' + error.message);
      }
    }
  };

  const handleToggleComplete = async (id) => {
    console.log('TodoPage: Toggle complete called for ID:', id);
    try {
      const result = await dispatch(toggleTaskAsync(id)).unwrap();
      console.log('TodoPage: Task toggled successfully:', result);
    } catch (error) {
      console.error('TodoPage: Failed to toggle task:', error);
      // Check if it's the future date error
      if (error.message && error.message.includes('future date')) {
        alert('⚠️ This task is scheduled for tomorrow or a future date.\nYou cannot mark it as done today.');
      } else {
        alert('Failed to toggle task: ' + error.message);
      }
    }
  };

  const handleEditTask = async (id, text) => {
    console.log('TodoPage: Edit task called for ID:', id, 'text:', text);
    try {
      const result = await dispatch(editTaskAsync({ id, title: text })).unwrap();
      console.log('TodoPage: Task edited successfully:', result);
    } catch (error) {
      console.error('TodoPage: Failed to edit task:', error);
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

  const getNavLabel = () => {
    switch (activeNav) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming (7 Days)';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      default: return 'All Tasks';
    }
  };

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