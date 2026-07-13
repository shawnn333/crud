import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';
import { Task } from '../../domain/entities/Task.js';

const STORAGE_KEY = 'tasks_data';

export class LocalStorageTaskRepository extends ITaskRepository {
  constructor() {
    super();
    this.tasks = [];
    this.nextId = 1;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.tasks = parsed.tasks.map(t => Task.fromJSON(t));
        this.nextId = parsed.nextId || this.getMaxId() + 1;
      }
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error);
      this.tasks = [];
      this.nextId = 1;
    }
  }

  saveToStorage() {
    try {
      const data = {
        tasks: this.tasks.map(t => t.toStorageJSON()),
        nextId: this.nextId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }

  getMaxId() {
    if (this.tasks.length === 0) return 0;
    return Math.max(...this.tasks.map(t => t.id));
  }

  async addTask(title, createdAt) {
    const task = new Task(this.nextId++, title, createdAt);
    this.tasks.push(task);
    this.saveToStorage();
    return task.toJSON();
  }

  async removeTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  async updateTask(id, data) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    if (data.title) {
      task.updateTitle(data.title);
    }
    this.saveToStorage();
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
    this.saveToStorage();
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
    this.saveToStorage();
  }

  async count() {
    return this.tasks.length;
  }
}
