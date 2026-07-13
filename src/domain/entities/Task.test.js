import { Task } from './Task';

describe('Task serialization', () => {
  it('exposes id, title, completed and dates in the serialized output', () => {
    const task = new Task(7, 'Write docs');

    const json = task.toJSON();
    expect(json.id).toBe(7);
    expect(json.title).toBe('Write docs');
    expect(json.completed).toBe(false);
    expect(typeof json.createdAt).toBe('string');
    expect(typeof json.updatedAt).toBe('string');
  });
});
