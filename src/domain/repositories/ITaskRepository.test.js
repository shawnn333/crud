import { InMemoryTaskRepository } from '../../data/repositories/InMemoryTaskRepository.js';

describe('ITaskRepository contract', () => {
  it('exposes the expected task repository methods', () => {
    const repository = new InMemoryTaskRepository();

    expect(typeof repository.addTask).toBe('function');
    expect(typeof repository.removeTask).toBe('function');
    expect(typeof repository.updateTask).toBe('function');
    expect(typeof repository.getAllTasks).toBe('function');
    expect(typeof repository.getTask).toBe('function');
    expect(typeof repository.toggleComplete).toBe('function');
    expect(typeof repository.getByStatus).toBe('function');
    expect(typeof repository.search).toBe('function');
    expect(typeof repository.clearAll).toBe('function');
    expect(typeof repository.count).toBe('function');
  });
});
