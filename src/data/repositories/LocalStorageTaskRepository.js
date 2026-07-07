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

  // Load tasks from localStorage
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

  // Save tasks to localStorage
  saveToStorage() {
    try {
      const data = {
        tasks: this.tasks.map(t => t.toJSON()),
        nextId: this.nextId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }

  // Get max ID from tasks
  getMaxId() {
    if (this.tasks.length === 0) return 0;
    return Math.max(...this.tasks.map(t => t.id));
  }

  async getAll() {
    return [...this.tasks];
  }

  async getById(id) {
    const task = this.tasks.find(t => t.id === id);
    return task ? task : null;
  }

  async create(title) {
    const task = new Task(this.nextId++, title);
    this.tasks.push(task);
    this.saveToStorage();
    return task;
  }

  async update(id, data) {
    const task = await this.getById(id);
    if (!task) return null;

    if (data.title) {
      task.updateTitle(data.title);
    }
    this.saveToStorage();
    return task;
  }

  async delete(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.saveToStorage();
    return true;
  }


  async search(query) {
    if (!query || !query.trim()) return this.getAll();
    const searchTerm = query.toLowerCase().trim();
    return this.tasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm)
    );
  }

  async clearAll() {
    this.tasks = [];
    this.nextId = 1;
    this.saveToStorage();
  }

  async count() {
    return this.tasks.length;
  }

  // Add sample data if empty
  addSampleDataIfEmpty() {
    if (this.tasks.length === 0) {
      const sampleTasks = [
        'Review project proposal',
        'Design new sidebar',
        'Write documentation',
        'Fix navigation bug',
        'Deploy to production'
      ];
      sampleTasks.forEach(text => this.create(text));
    }
  }
}