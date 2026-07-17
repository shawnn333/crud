import { Task } from '../entities/Task.js';

export class ToggleTaskCompletionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const task = Task.fromJSON(existing);

    if (!task.completed) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate.getTime() > today.getTime()) {
        throw new Error('This task is scheduled for tomorrow or a future date and cannot be marked as done today.');
      }
    }

    task.toggleComplete();
    await this.repository.toggleComplete(task);
    return task.toJSON();
  }
}
