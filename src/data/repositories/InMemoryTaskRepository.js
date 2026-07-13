/**
 * InMemoryTaskRepository - concrete implementation of TaskRepository
 * (see ../../domain/repositories/TaskRepository.ts for the contract).
 * All actual data access/storage logic lives here, never in the view
 * or state-management layer.
 *
 * Mutation methods return void per team convention: the repository's
 * only job is to persist. Callers (use cases) already hold or can
 * query for the data they need.
 */
export class InMemoryTaskRepository {
  constructor() {
    this.tasks = [];
  }

  async addTask(task) {
    this.tasks.push(task);
  }

  async removeTask(task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;
    this.tasks.splice(index, 1);
  }

  async updateTask(task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;
    this.tasks[index] = task;
  }

  async getAllTasks() {
    return this.tasks.map(task => task.toJSON());
  }

  async getTask(id) {
    const task = this.tasks.find(t => t.id === id);
    return task ? task.toJSON() : null;
  }

  async toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.toggleComplete();
  }

  async getByStatus(completed) {
    return this.tasks
      .filter(task => task.completed === completed)
      .map(task => task.toJSON());
  }

  async search(query) {
    if (!query || !query.trim()) return this.getAllTasks();
    const searchTerm = query.toLowerCase().trim();
    return this.tasks
      .filter(t => t.title.toLowerCase().includes(searchTerm))
      .map(task => task.toJSON());
  }

  async clearAll() {
    this.tasks = [];
  }

  async count() {
    return this.tasks.length;
  }
}
