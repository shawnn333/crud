export class AddTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title) {

    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    const task = await this.repository.addTask(title.trim());
    return task;
  }
}
