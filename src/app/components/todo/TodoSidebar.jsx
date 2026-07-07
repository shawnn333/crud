import React from 'react';

export const TodoSidebar = ({ activeNav, totalTasks, upcomingCount, onNavClick }) => {
  const navItems = [
    { id: 'all', icon: 'fa-list-ul', label: 'All Tasks', badge: totalTasks },
    { id: 'today', icon: 'fa-clock', label: 'Today' },
    { id: 'upcoming', icon: 'fa-calendar-week', label: 'Upcoming', badge: upcomingCount },
    { id: 'this-week', icon: 'fa-calendar-alt', label: 'This Week' },
    { id: 'this-month', icon: 'fa-calendar', label: 'This Month' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="fas fa-check-circle brand-icon"></i>
        <span className="brand-text">TaskFlow</span>
        <span className="brand-badge">PRO</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onNavClick(item.id)}
          >
            <i className={`fas ${item.icon}`}></i> {item.label}
            {item.badge !== undefined && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-divider"></div>
    </aside>
  );
};