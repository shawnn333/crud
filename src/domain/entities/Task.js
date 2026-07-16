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

  static create(title, createdAt) {
 
    const titleStr = typeof title === 'string' ? title : String(title);
    
    let id;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {

      id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    }
    
    return new Task(id, titleStr, createdAt);
  }

  updateTitle(newTitle) {
    if (!newTitle || !newTitle.trim()) {
      throw new Error('Task title cannot be empty');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
    return this;
  }

  updateText(newText) {
    return this.updateTitle(newText);
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.updatedAt = new Date();
    return this;
  }

  isCompleted() {
    return this.completed;
  }

  isPending() {
    return !this.completed;
  }

  getFormattedDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    };
  }

  toStorageJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    };
  }

  static fromJSON(data) {
    const task = new Task(
      data.id,
      data.title ?? data.text ?? 'Untitled'
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
