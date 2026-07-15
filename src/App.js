import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTaskAsync,
  deleteTaskAsync,
  toggleTaskAsync,
  editTaskAsync,
  setFilter,
  setActiveNav,
} from './app/redux/task/task.slice';
import { logoutAsync } from './app/redux/auth/auth.slice';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const dispatch = useDispatch();
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const currentUserEmail = useSelector((state) => state?.auth?.user?.email || '');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setShowLogoutOverlay(true);
      setTimeout(async () => {
        try {
          await dispatch(logoutAsync()).unwrap();
        } catch (error) {
          console.error('Logout failed:', error);
          setShowLogoutOverlay(false);
        }
      }, 500);
    }
  };
  
  const tasks = useSelector((state) => {
    const tasksData = state?.tasks?.tasks;
    return Array.isArray(tasksData) ? tasksData : [];
  });
  
  const filter = useSelector((state) => {
    const value = state?.tasks?.filter;
    return typeof value === 'string' ? value : '';
  });
  const activeNav = useSelector((state) => {
    const value = state?.tasks?.activeNav;
    return typeof value === 'string' ? value : 'all';
  });
  const loading = useSelector((state) => {
    const value = state?.tasks?.loading;
    return typeof value === 'boolean' ? value : false;
  });
  
  const [inputValue, setInputValue] = useState('');
  const [selectedDays, setSelectedDays] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getTaskDate = (task) => {
    if (!task?.createdAt) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + (task?.id % 5 || 0));
      return defaultDate;
    }
    const date = new Date(task.createdAt);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (filter.trim()) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    const today = getToday();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    switch (activeNav) {
      case 'today':
        filtered = filtered.filter(task => {
          const taskDate = getTaskDate(task);
          return taskDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(task => {
          const taskDate = getTaskDate(task);
          return taskDate.getTime() > today.getTime() && 
                 taskDate.getTime() <= nextWeek.getTime();
        });
        break;
      case 'this-week':
        filtered = filtered.filter(task => {
          const taskDate = getTaskDate(task);
          return taskDate.getTime() >= today.getTime() && 
                 taskDate.getTime() <= nextWeek.getTime();
        });
        break;
      case 'this-month':
        filtered = filtered.filter(task => {
          const taskDate = getTaskDate(task);
          return taskDate.getTime() >= today.getTime() && 
                 taskDate.getTime() <= endOfMonth.getTime();
        });
        break;
      default:
        break;
    }

    return [...filtered].sort((a, b) => {
      if (activeNav === 'upcoming' || activeNav === 'this-week' || activeNav === 'this-month') {
        const dateA = getTaskDate(a);
        const dateB = getTaskDate(b);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
      }
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.id - a.id;
    });
  };

  const filteredTasks = getFilteredTasks();
  
  const total = tasks.length || 0;
  const done = tasks.filter ? tasks.filter(t => t.completed).length : 0;

  const getUpcomingCount = () => {
    if (!Array.isArray(tasks)) return 0;
    const today = getToday();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return tasks.filter(task => {
      const taskDate = getTaskDate(task);
      return taskDate.getTime() > today.getTime() && 
             taskDate.getTime() <= nextWeek.getTime();
    }).length;
  };

  const getTaskCreatedAt = (daysFromNow = 0) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  };

  const handleAddTask = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      alert('Please enter a task.');
      return;
    }

    try {
      await dispatch(addTaskAsync({
        title: trimmed,
        createdAt: getTaskCreatedAt(selectedDays),
      })).unwrap();
      setInputValue('');
      setSelectedDays(0);
      inputRef.current?.focus();
    } catch (error) {
      alert('Failed to add task: ' + (typeof error === 'string' ? error : error.message));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const startEditing = (id) => {
    if (!Array.isArray(tasks)) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.completed) {
      alert('⚠️ This task is already completed and cannot be edited.');
      return;
    }
    setEditingId(id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      alert('Task cannot be empty.');
      return;
    }
    try {
      await dispatch(editTaskAsync({ id, title: trimmed })).unwrap();
      setEditingId(null);
      setEditText('');
    } catch (error) {
      alert('Failed to edit task: ' + (typeof error === 'string' ? error : error.message));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      await saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await dispatch(deleteTaskAsync(id)).unwrap();
      } catch (error) {
        alert('Failed to delete task: ' + (typeof error === 'string' ? error : error.message));
      }
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) {
        alert('Task not found');
        return;
      }
      
      if (task.completed) {
        alert('⚠️ This task is already completed. Completed tasks cannot be undone.');
        return;
      }
      
      const today = getToday();
      const taskDate = getTaskDate(task);
      
      if (taskDate.getTime() > today.getTime()) {
        alert('⚠️ This task is scheduled for tomorrow or a future date.\nYou cannot mark it as done today.');
        return;
      }
      
      await dispatch(toggleTaskAsync(id)).unwrap();
      
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : error.message;
      alert(errorMsg || 'Failed to toggle task');
    }
  };

  const handleNavClick = (nav) => {
    dispatch(setActiveNav(nav));
    dispatch(setFilter(''));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = getToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.getTime() === today.getTime()) return 'Today';
    if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    const options = { month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
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

  if (showLogoutOverlay) {
    return (
      <div className="logout-overlay">
        <div className="logout-box">
          <div className="logout-icon">
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
          <h3>Logging out...</h3>
          <p>Please wait</p>
        </div>
      </div>
    );
  }

  const getSelectedDateLabel = () => {
    return selectedDays === 0 ? 'Today' : 'Tomorrow';
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-check-circle brand-icon"></i>
          <span className="brand-text">TaskFlow</span>
          <span className="brand-badge">PRO</span>
        </div>

        {currentUserEmail && (
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <span className="user-email">{currentUserEmail}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}

        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeNav === 'all' ? 'active' : ''}`}
            onClick={() => handleNavClick('all')}
          >
            <i className="fas fa-list-ul"></i> All Tasks
            <span className="nav-badge">{tasks.length}</span>
          </div>
          <div 
            className={`nav-item ${activeNav === 'today' ? 'active' : ''}`}
            onClick={() => handleNavClick('today')}
          >
            <i className="fas fa-clock"></i> Today
          </div>
          <div 
            className={`nav-item ${activeNav === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleNavClick('upcoming')}
          >
            <i className="fas fa-calendar-week"></i> Upcoming
            <span className="nav-badge">{getUpcomingCount()}</span>
          </div>
          <div 
            className={`nav-item ${activeNav === 'this-week' ? 'active' : ''}`}
            onClick={() => handleNavClick('this-week')}
          >
            <i className="fas fa-calendar-alt"></i> This Week
          </div>
          <div 
            className={`nav-item ${activeNav === 'this-month' ? 'active' : ''}`}
            onClick={() => handleNavClick('this-month')}
          >
            <i className="fas fa-calendar"></i> This Month
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <div className="todo-header">
          <h2>
            <span className="header-icon">
              <i className="fas fa-pencil-alt"></i>
            </span>
            <span className="header-title">{getNavLabel()}</span>
          </h2>
          <div className="header-actions">
            <span className="task-stats">
              <i className="fas fa-check-circle stat-done"></i> 
              <span className="stat-number">{done}</span>
              <span className="stat-divider">/</span>
              <span className="stat-number">{total}</span>
            </span>
          </div>
        </div>

        <div className="input-row">
          <i className="fas fa-plus-circle input-icon"></i>
          <input
            type="text"
            id="task-input"
            name="task"
            placeholder={`Enter task for ${getSelectedDateLabel()}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            autoComplete="off"
          />
          <div className="quick-add-buttons">
            <button 
              className={`btn quick-add ${selectedDays === 0 ? 'active' : ''}`} 
              onClick={() => setSelectedDays(0)}
              title="Set task for today"
            >
              <i className="fas fa-calendar-day"></i> Today
            </button>
            <button 
              className={`btn quick-add ${selectedDays === 1 ? 'active' : ''}`} 
              onClick={() => setSelectedDays(1)}
              title="Set task for tomorrow"
            >
              <i className="fas fa-calendar-plus"></i> Tomorrow
            </button>
          </div>
          <button className="btn" onClick={handleAddTask}>
            <i className="fas fa-plus-circle"></i> Add
          </button>
        </div>

        <div className="search-row">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            id="search-input"
            name="search"
            placeholder={`Search ${getNavLabel().toLowerCase()}...`}
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          {filter && (
            <button className="clear-filter-btn" onClick={() => dispatch(setFilter(''))}>
              <i className="fas fa-times"></i>
            </button>
          )}
          {activeNav !== 'all' && (
            <button className="clear-filter-btn" onClick={() => handleNavClick('all')}>
              <i className="fas fa-home"></i>
            </button>
          )}
        </div>

        <div className="todo-table-wrapper">
          <table className="todo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-tasks">
                    <i className="fas fa-inbox empty-icon"></i>
                    <div className="empty-title">{emptyMessage.title}</div>
                    <div className="empty-sub">{emptyMessage.sub}</div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => {
                  const taskDate = getTaskDate(task);
                  const dateStr = formatDate(taskDate);
                  const isCompleted = task.completed;
                  
                  return (
                    <tr key={task.id} className={isCompleted ? 'task-completed-row' : ''}>
                      <td className="task-number">{index + 1}</td>
                      <td>
                        {editingId === task.id ? (
                          <div className="edit-container">
                            <input
                              type="text"
                              id={`edit-task-${task.id}`}
                              name={`edit-task-${task.id}`}
                              className="edit-input"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                              autoFocus
                            />
                            <div className="edit-actions">
                              <button className="edit-save-btn" onClick={() => saveEdit(task.id)}>
                                <i className="fas fa-check"></i>
                              </button>
                              <button className="edit-cancel-btn" onClick={cancelEdit}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className={`task-text ${isCompleted ? 'completed' : ''}`}>
                            {task.title}
                          </span>
                        )}
                        <span className={`status-badge ${isCompleted ? 'done' : 'pending'}`}>
                          {isCompleted ? '✓ Done' : '⏳ Pending'}
                        </span>
                      </td>
                      <td>
                        <span className="date-badge">
                          <i className="fas fa-calendar-alt"></i> {dateStr}
                        </span>
                      </td>
                      <td>
                        <div className="action-group">
                          {!isCompleted ? (
                            <>
                              <button
                                className="action-btn complete"
                                onClick={() => handleToggleTask(task.id)}
                                title="Mark as complete"
                              >
                                <i className="fas fa-circle"></i>
                                <span className="action-label">Mark</span>
                              </button>
                              <button
                                className="action-btn edit"
                                onClick={() => startEditing(task.id)}
                                title="Edit task"
                              >
                                <i className="fas fa-pen"></i>
                                <span className="action-label">Edit</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="action-btn complete is-completed"
                                disabled
                                title="Task is already completed"
                              >
                                <i className="fas fa-check-circle"></i>
                                <span className="action-label">Done</span>
                              </button>
                              <button
                                className="action-btn edit"
                                disabled
                                title="Cannot edit completed tasks"
                              >
                                <i className="fas fa-pen"></i>
                                <span className="action-label">Edit</span>
                              </button>
                            </>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete task"
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span className="action-label">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default App;