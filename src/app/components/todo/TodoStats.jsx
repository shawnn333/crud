import React from 'react';

export const TodoStats = ({ done, total, label }) => {
  return (
    <div className="todo-header">
      <h2>
        <span className="header-icon">
          <i className="fas fa-pencil-alt"></i>
        </span>
        <span className="header-title">{label}</span>
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
  );
};