export class ToggleTaskCompletionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const existing = await this.repository.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // Business rule: a task can only be marked as done once its
    // scheduled date has arrived. Un-marking (done -> pending) is
    // always allowed.
    if (!existing.completed) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = new Date(existing.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate.getTime() > today.getTime()) {
        throw new Error('This task is scheduled for a future date and cannot be marked as done yet.');
      }
    }

    // repository.toggleComplete is void now, so we re-fetch to hand
    // the caller the fresh state.
    await this.repository.toggleComplete(id);
    const updated = await this.repository.getTask(id);
    if (!updated) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return updated;
  }
}
