export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title, createdAt) {
    // Validate input
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    // Create the task
    const task = await this.repository.addTask(title.trim(), createdAt);
    return task;
  }
}
