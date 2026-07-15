import { Task } from "../entities/Task";

/**
 * TaskRepository - typed domain contract, mirrored from ITaskRepository.js.
 *
 * Per team convention: mutation methods take the full entity and return
 * void. Callers already hold the entity they created/mutated, so nothing
 * needs to be handed back.
 */
export interface TaskRepository {

  getAllTasks(): Promise<Task[]>;
  getTask(id: number | string): Promise<Task | null>;
  getByStatus(completed: boolean): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
  count(): Promise<number>;

  addTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  removeTask(task: Task): Promise<void>;
  toggleComplete(task: Task): Promise<void>;
  clearAll(): Promise<void>;
}
