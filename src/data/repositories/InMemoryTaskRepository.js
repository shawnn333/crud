import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';
import { Task } from '../../domain/entities/Task.js';

/**
 * InMemoryTaskRepository - concrete implementation of ITaskRepository.
 * All actual data access/storage logic lives here, never in the view
 * or state-management layer.
 */
export class InMemoryTaskRepository extends ITaskRepository {
  constructor() {
    super();
    this.tasks = [];
    this.nextId = 1;
  }

  async addTask(title, createdAt) {
    const task = new Task(this.nextId++, title, createdAt);
    this.tasks.push(task);
    return task.toJSON();
  }

  async removeTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  async updateTask(id, data) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    if (data.title) {
      task.updateTitle(data.title);
    }
    return task.toJSON();
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
    if (!task) return null;
    task.toggleComplete();
    return task.toJSON();
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
    this.nextId = 1;
  }

  async count() {
    return this.tasks.length;
  }

  // Utility method to add sample data
  addSampleData() {
    const sampleTasks = [
      'Review project proposal',
      'Design new sidebar',
      'Write documentation',
      'Fix navigation bug',
      'Deploy to production'
    ];
    sampleTasks.forEach(text => this.addTask(text));
  }
}
