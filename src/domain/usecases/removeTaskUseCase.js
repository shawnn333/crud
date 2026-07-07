export class RemoveTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return true;
  }
}