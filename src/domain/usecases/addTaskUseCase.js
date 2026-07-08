export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title) {
    // Validate input
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    // Create the task
    const task = await this.repository.addTask(title.trim());
    return task;
  }
}