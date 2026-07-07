export class Task {
  constructor(id, title) {
    if (id === undefined || id === null) {
      throw new Error('Task id is required');
    }
    if (!title || !title.toString().trim()) {
      throw new Error('Task title cannot be empty');
    }

    this.id = id;
    this.title = title.toString().trim();
  }

  // Update task text
  updateText(newText) {
    if (!newText || !newText.trim()) {
      throw new Error('Task text cannot be empty');
    }
    this.text = newText.trim();
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

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      title: this.title
    };
  }

  // Create from plain object
  static fromJSON(data) {
    const task = new Task(
      data.id,
      data.title ?? data.text ?? ''
    );

    if (data.updatedAt) {
      task.updatedAt = new Date(data.updatedAt);
    }
    return task;
  }
}