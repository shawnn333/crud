import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';
import { Task } from '../../domain/entities/Task.js';

export class InMemoryTaskRepository extends ITaskRepository {
  constructor() {
    super();
    this.tasks = [];
    this.nextId = 1;
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
    return task;
  }

  async update(id, data) {
    const task = await this.getById(id);
    if (!task) return null;

    if (data.title) {
      task.updateTitle(data.title);
    }
    return task;
  }

  async delete(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
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
    sampleTasks.forEach(text => this.create(text));
  }
}