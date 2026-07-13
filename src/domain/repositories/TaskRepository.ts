import { Task } from "../entities/Task";

export interface TaskRepository {
  // Reads: always return data.
  getAllTasks(): Promise<Task[]>;
  getTask(id: number | string): Promise<Task | null>;
  getByStatus(completed: boolean): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
  count(): Promise<number>;

  // Mutations: no return, per team convention (repo just persists,
  // caller already holds/derives the data it needs).
  addTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  removeTask(task: Task): Promise<void>;
  toggleComplete(id: number | string): Promise<void>;
  clearAll(): Promise<void>;
}
