import { Task } from '../entities/Task.js';

export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title, createdAt) {

    if (!title) {
      throw new Error('Task title is required');
    }

    const titleString = typeof title === 'string' ? title : String(title);

    if (!titleString.trim()) {
      throw new Error('Task title cannot be empty');
    }

    const task = Task.create(titleString.trim(), createdAt);
    await this.repository.addTask(task);
    return task.toJSON();
  }
}
