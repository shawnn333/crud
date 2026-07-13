export class Task {
  constructor(id, title, createdAt) {
    if (id === undefined || id === null) {
      throw new Error('Task id is required');
    }
    if (!title || !title.toString().trim()) {
      throw new Error('Task title cannot be empty');
    }

    this.id = id;
    this.title = title.toString().trim();
    this.completed = false;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = new Date();
  }

  // Update task title
  updateTitle(newTitle) {
    if (!newTitle || !newTitle.trim()) {
      throw new Error('Task title cannot be empty');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
    return this;
  }

  // Update task text (alias)
  updateText(newText) {
    return this.updateTitle(newText);
  }

  // Toggle task completion
  toggleComplete() {
    this.completed = !this.completed;
    this.updatedAt = new Date();
    return this;
  }

  // Check if task is completed
  isCompleted() {
    return this.completed;
  }

  // Check if task is pending
  isPending() {
    return !this.completed;
  }

  // Get formatted date
  getFormattedDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Convert to plain object for API consumers
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    };
  }

  // Convert to plain object for storage persistence
  toStorageJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    };
  }

  // Create from plain object
  static fromJSON(data) {
    const task = new Task(
      data.id,
      data.title ?? data.text ?? ''
    );

    if (data.completed !== undefined) {
      task.completed = data.completed;
    }
    if (data.createdAt) {
      task.createdAt = new Date(data.createdAt);
    }
    if (data.updatedAt) {
      task.updatedAt = new Date(data.updatedAt);
    }
    return task;
  }
}