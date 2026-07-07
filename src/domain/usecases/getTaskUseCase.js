export class GetTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const task = await this.repository.getById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return task;
  }
}