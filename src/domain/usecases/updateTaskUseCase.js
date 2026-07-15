import { Task } from '../entities/Task.js';

export class UpdateTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, data) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    // Validate data
    if (data.title && !data.title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    // Get the existing task
    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // Update the task
    const task = Task.fromJSON(existing);
    if (data.title) {
      task.updateTitle(data.title);
    }

    // updateTask returns void - we already hold the updated entity.
    await this.repository.updateTask(task);
    return task.toJSON();
  }
}
