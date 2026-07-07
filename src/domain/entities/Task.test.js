import { Task } from './Task';

describe('Task serialization', () => {
  it('only exposes id and title in the serialized output', () => {
    const task = new Task(7, 'Write docs');

    expect(task.toJSON()).toEqual({ id: 7, title: 'Write docs' });
    expect(JSON.stringify(task)).toBe('{"id":7,"title":"Write docs"}');
  });
});
