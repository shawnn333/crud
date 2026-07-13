import { Task } from '../entities/Task.js';

export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title, createdAt) {
    // Validate input
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    // Id generation is a domain concern now (repository.addTask is void),
    // so the entity is fully built here before being handed to the repo.
    const task = Task.create(title.trim(), createdAt);
    await this.repository.addTask(task);
    return task.toJSON();
  }
}
