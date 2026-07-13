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

    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // repository.updateTask is void, so we mutate a real domain entity
    // here and hand the finished copy back to the caller ourselves.
    const task = Task.fromJSON(existing);
    if (data.title) {
      task.updateTitle(data.title);
    }

    await this.repository.updateTask(task);
    return task.toJSON();
  }
}
