import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTask, 
  deleteTask, 
  toggleComplete, 
  editTask, 
  setFilter, 
  setActiveNav 
} from './features/task/taskSlice';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const activeNav = useSelector((state) => state.tasks.activeNav);
  
  // Local state
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  // Helper to get today at midnight
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Helper to get date from task (with fallback)
  const getTaskDate = (task) => {
    if (!task.createdAt) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + (task.id % 5));
      return defaultDate;
    }
    const date = new Date(task.createdAt);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // ========== FILTER FUNCTIONS ==========
  const getFilteredTasks = () => {
    // ✅ Always create a copy of the array
    let filtered = [...tasks];

    // Search filter
    if (filter.trim()) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(filter.toLowerCase())
      );
    }

    const today = getToday();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    // Navigation filter
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

    // ✅ Create another copy before sorting
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

  // Stats
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  // Get upcoming tasks count
  const getUpcomingCount = () => {
    const today = getToday();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return tasks.filter(task => {
      const taskDate = getTaskDate(task);
      return taskDate.getTime() > today.getTime() && 
             taskDate.getTime() <= nextWeek.getTime();
    }).length;
  };

  // ========== CREATE ==========
  const handleAddTask = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      alert('Please enter a task.');
      return;
    }
    
    dispatch(addTask(trimmed));
    setInputValue('');
    inputRef.current?.focus();
  };

  // Quick add with date
  const addTaskWithDate = (daysFromNow) => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      alert('Please enter a task.');
      return;
    }

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + daysFromNow);

    dispatch(addTask({ text: trimmed, date: date.toISOString() }));
    setInputValue('');
    inputRef.current?.focus();
  };

  // ========== UPDATE ==========
  const startEditing = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setEditingId(id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      alert('Task cannot be empty.');
      return;
    }
    dispatch(editTask({ id, text: trimmed }));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // ========== DELETE ==========
  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  // ========== TOGGLE COMPLETE ==========
  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  // ========== NAVIGATION HANDLER ==========
  const handleNavClick = (nav) => {
    dispatch(setActiveNav(nav));
    dispatch(setFilter(''));
  };

  // Enter key to add
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  // Format date for display
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

  // Get navigation label
  const getNavLabel = () => {
    switch (activeNav) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming (7 Days)';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      default: return 'All Tasks';
    }
  };

  // Get empty state message
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

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-check-circle brand-icon"></i>
          <span className="brand-text">TaskFlow</span>
          <span className="brand-badge">PRO</span>
        </div>

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

        <div className="sidebar-divider"></div>
      </aside>

      {/* Main Content */}
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

        {/* Add Task Row */}
        <div className="input-row">
          <i className="fas fa-plus-circle input-icon"></i>
          <input
            type="text"
            placeholder="Enter task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            autoComplete="off"
          />
          <div className="quick-add-buttons">
            <button 
              className="btn quick-add" 
              onClick={() => addTaskWithDate(0)}
              title="Add for today"
            >
              <i className="fas fa-calendar-day"></i> Today
            </button>
            <button 
              className="btn quick-add" 
              onClick={() => addTaskWithDate(1)}
              title="Add for tomorrow"
            >
              <i className="fas fa-calendar-plus"></i> Tomorrow
            </button>
          </div>
          <button className="btn" onClick={handleAddTask}>
            <i className="fas fa-plus-circle"></i> Add
          </button>
        </div>

        {/* Search Row */}
        <div className="search-row">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder={`Search ${getNavLabel().toLowerCase()}...`}
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          {filter && (
            <button 
              className="clear-filter-btn"
              onClick={() => dispatch(setFilter(''))}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          {activeNav !== 'all' && (
            <button 
              className="clear-filter-btn"
              onClick={() => handleNavClick('all')}
              title="Show all tasks"
            >
              <i className="fas fa-home"></i>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="todo-table-wrapper">
          <table className="todo-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Task</th>
                <th style={{ width: '100px' }}>Date</th>
                <th style={{ width: '220px' }}>Actions</th>
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
                  
                  return (
                    <tr key={task.id} className={task.completed ? 'task-completed-row' : ''}>
                      <td className="task-number">{index + 1}</td>
                      <td>
                        {editingId === task.id ? (
                          <div className="edit-container">
                            <input
                              type="text"
                              className="edit-input"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                              autoFocus
                            />
                            <div className="edit-actions">
                              <button 
                                className="edit-save-btn" 
                                onClick={() => saveEdit(task.id)}
                                title="Save changes"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                className="edit-cancel-btn" 
                                onClick={cancelEdit}
                                title="Cancel editing"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                            {task.text}
                          </span>
                        )}
                        <span className={`status-badge ${task.completed ? 'done' : 'pending'}`}>
                          {task.completed ? '✓ Done' : '⏳ Pending'}
                        </span>
                      </td>
                      <td>
                        <span className="date-badge">
                          <i className="fas fa-calendar-alt"></i> {dateStr}
                        </span>
                      </td>
                      <td>
                        <div className="action-group">
                          <button
                            className={`action-btn complete ${task.completed ? 'is-completed' : ''}`}
                            onClick={() => handleToggleComplete(task.id)}
                            title={task.completed ? "Mark as pending" : "Mark as complete"}
                          >
                            <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                            <span className="action-label">
                              {task.completed ? 'Done' : 'Mark'}
                            </span>
                          </button>

                          {editingId === task.id ? (
                            <button
                              className="action-btn edit"
                              onClick={() => saveEdit(task.id)}
                              title="Save changes"
                            >
                              <i className="fas fa-save"></i>
                              <span className="action-label">Save</span>
                            </button>
                          ) : (
                            <button
                              className="action-btn edit"
                              onClick={() => startEditing(task.id)}
                              title="Edit task"
                            >
                              <i className="fas fa-pen"></i>
                              <span className="action-label">Edit</span>
                            </button>
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
