import React from 'react';

export const TodoSearch = ({
  filter,
  onFilterChange,
  onClearFilter,
  onClearNav,
  activeNav,
  placeholder,
}) => {
  return (
    <div className="search-row">
      <label htmlFor="search-input" className="sr-only">
        Search tasks
      </label>
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        id="search-input"
        name="search"
        placeholder={placeholder}
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        autoComplete="off"
        aria-label="Search tasks"
      />
      {filter && (
        <button 
          className="clear-filter-btn"
          onClick={onClearFilter}
          title="Clear search"
          type="button"
          aria-label="Clear search"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
      {activeNav !== 'all' && (
        <button 
          className="clear-filter-btn"
          onClick={onClearNav}
          title="Show all tasks"
          type="button"
          aria-label="Show all tasks"
        >
          <i className="fas fa-home"></i>
        </button>
      )}
    </div>
  );
};