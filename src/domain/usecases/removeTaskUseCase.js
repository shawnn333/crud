import { Task } from '../entities/Task.js';

export class RemoveTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    // repository.removeTask is void and takes the whole entity now
    // (matches DeleteTodo(data: Todo): void), so we fetch and rebuild
    // it first instead of relying on a returned "deleted" flag.
    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const task = Task.fromJSON(existing);
    await this.repository.removeTask(task);
    return true;
  }
}
