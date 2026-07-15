import { Task } from '../entities/Task.js';

export class RemoveTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    // removeTask takes the full entity per ITaskRepository, so fetch it
    // first rather than passing a bare id.
    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const task = Task.fromJSON(existing);
    await this.repository.removeTask(task);
    return id;
  }
}
