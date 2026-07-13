import { Task } from "../entities/Task";

export interface TaskRepository {

  getAllTasks(): Promise<Task[]>;
  getTask(id: number | string): Promise<Task | null>;
  getByStatus(completed: boolean): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
  count(): Promise<number>;

  addTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  removeTask(task: Task): Promise<void>;
  toggleComplete(id: number | string): Promise<void>;
  clearAll(): Promise<void>;
}
