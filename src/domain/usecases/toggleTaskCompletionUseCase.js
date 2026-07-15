import { Task } from '../entities/Task.js';

export class ToggleTaskCompletionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    // Get the existing task first
    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const task = Task.fromJSON(existing);

    // If the task is not completed yet, check if it's for a future date
    if (!task.completed) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      // Check if the task is scheduled for a future date (tomorrow or later)
      if (taskDate.getTime() > today.getTime()) {
        throw new Error('This task is scheduled for tomorrow or a future date and cannot be marked as done today.');
      }
    }

    // Domain flips its own state; repository just persists it and
    // returns void - we already hold the updated entity.
    task.toggleComplete();
    await this.repository.toggleComplete(task);
    return task.toJSON();
  }
}
