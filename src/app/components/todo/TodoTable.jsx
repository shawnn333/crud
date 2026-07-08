import React from 'react';

export const TodoTable = ({
  tasks,
  editingId,
  editText,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onEditKeyDown,
  onToggleComplete,
  onStartEditing,
  onDeleteTask,
  emptyTitle,
  emptySub,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="todo-table-wrapper">
        <table className="todo-table">
          <tbody>
            <tr>
              <td colSpan={4} className="no-tasks">
                <i className="fas fa-inbox empty-icon"></i>
                <div className="empty-title">{emptyTitle}</div>
                <div className="empty-sub">{emptySub}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="todo-table-wrapper">
      <table className="todo-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th>Task</th>
            <th style={{ width: '220px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            return (
              <tr key={task.id} className={task.completed ? 'task-completed-row' : ''}>
                <td className="task-number">{task.id}</td>
                <td>
                  {editingId === task.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        id={`edit-task-${task.id}`}
                        name={`edit-task-${task.id}`}
                        className="edit-input"
                        value={editText}
                        onChange={(e) => onEditChange(e.target.value)}
                        onKeyDown={(e) => onEditKeyDown(e, task.id)}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button 
                          className="edit-save-btn" 
                          onClick={() => onSaveEdit(task.id)}
                          title="Save changes"
                          type="button"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          className="edit-cancel-btn" 
                          onClick={onCancelEdit}
                          title="Cancel editing"
                          type="button"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                      {task.title}
                    </span>
                  )}
                  <span className={`status-badge ${task.completed ? 'done' : 'pending'}`}>
                    {task.completed ? '✓ Done' : '⏳ Pending'}
                  </span>
                </td>
                <td>
                  <div className="action-group">
                    <button
                      className={`action-btn complete ${task.completed ? 'is-completed' : ''}`}
                      onClick={() => onToggleComplete(task.id)}
                      title={task.completed ? "Mark as pending" : "Mark as complete"}
                      type="button"
                    >
                      <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                      <span className="action-label">
                        {task.completed ? 'Done' : 'Mark'}
                      </span>
                    </button>

                    {editingId === task.id ? (
                      <button
                        className="action-btn edit"
                        onClick={() => onSaveEdit(task.id)}
                        title="Save changes"
                        type="button"
                      >
                        <i className="fas fa-save"></i>
                        <span className="action-label">Save</span>
                      </button>
                    ) : (
                      <button
                        className="action-btn edit"
                        onClick={() => onStartEditing(task.id)}
                        title="Edit task"
                        type="button"
                      >
                        <i className="fas fa-pen"></i>
                        <span className="action-label">Edit</span>
                      </button>
                    )}

                    <button
                      className="action-btn delete"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                      type="button"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span className="action-label">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};