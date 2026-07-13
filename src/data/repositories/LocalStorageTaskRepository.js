import { Task } from '../../domain/entities/Task.js';

const STORAGE_KEY = 'tasks_data';

/**
 * LocalStorageTaskRepository - concrete implementation of TaskRepository
 * (see ../../domain/repositories/TaskRepository.ts for the contract).
 *
 * This is the ONLY place in the app allowed to touch localStorage for
 * task data. Redux thunks / React components must go through the use
 * cases, which depend on this repository - never on localStorage directly.
 *
 * Mutation methods return void per team convention: the repository's
 * only job is to persist. Callers (use cases) already hold or can
 * query for the data they need.
 */
export class LocalStorageTaskRepository {
  constructor() {
    this.tasks = [];
    this.loadFromStorage();
  }

  // Load tasks from localStorage
  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.tasks = (parsed.tasks || []).map(t => Task.fromJSON(t));
      }
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error);
      this.tasks = [];
    }
  }

  // Save tasks to localStorage
  saveToStorage() {
    try {
      const data = {
        tasks: this.tasks.map(t => t.toStorageJSON())
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }

  async addTask(task) {
    this.tasks.push(task);
    this.saveToStorage();
  }

  async removeTask(task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;
    this.tasks.splice(index, 1);
    this.saveToStorage();
  }

  async updateTask(task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;
    this.tasks[index] = task;
    this.saveToStorage();
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
    this.saveToStorage();
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
    this.saveToStorage();
  }

  async count() {
    return this.tasks.length;
  }
}
