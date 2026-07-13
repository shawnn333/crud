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

    const task = await this.repository.updateTask(id, data);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return task;
  }

}