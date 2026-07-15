import { Task } from '../entities/Task.js';

export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title, createdAt) {
    // Validate input
    if (!title) {
      throw new Error('Task title is required');
    }

    const titleString = typeof title === 'string' ? title : String(title);

    if (!titleString.trim()) {
      throw new Error('Task title cannot be empty');
    }

    // Task.create() generates the real id client-side, so we don't need
    // anything handed back from the repository - addTask returns void.
    const task = Task.create(titleString.trim(), createdAt);
    await this.repository.addTask(task);
    return task.toJSON();
  }
}
