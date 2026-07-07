import React, { useState, useRef } from 'react';

export const TodoInput = ({ onAddTask, onAddWithDate }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="input-row">
      <label htmlFor="task-input" className="sr-only">
        Add a new task
      </label>
      <i className="fas fa-plus-circle input-icon"></i>
      <input
        type="text"
        id="task-input"
        name="task"
        placeholder="Enter task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        autoComplete="off"
        aria-label="Enter a new task"
      />
      <div className="quick-add-buttons">
        <button 
          className="btn quick-add" 
          onClick={() => {
            const trimmed = inputValue.trim();
            if (trimmed) {
              onAddWithDate(0);
              setInputValue('');
            }
          }}
          title="Add for today"
          type="button"
        >
          <i className="fas fa-calendar-day"></i> Today
        </button>
        <button 
          className="btn quick-add" 
          onClick={() => {
            const trimmed = inputValue.trim();
            if (trimmed) {
              onAddWithDate(1);
              setInputValue('');
            }
          }}
          title="Add for tomorrow"
          type="button"
        >
          <i className="fas fa-calendar-plus"></i> Tomorrow
        </button>
      </div>
      <button 
        className="btn" 
        onClick={handleAdd}
        type="button"
      >
        <i className="fas fa-plus-circle"></i> Add
      </button>
    </div>
  );
};