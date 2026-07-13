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
