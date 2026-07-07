import { TaskRepositoryImpl } from '../data/repositories/LocalStorageTaskRepository.js';
import { AddTaskUseCase } from '../usecases/addTaskUseCase.js';
import { GetAllTasksUseCase } from '../usecases/getAllTasksUseCase.js';
import { GetTaskUseCase } from '../usecases/getTaskUseCase.js';
import { RemoveTaskUseCase } from '../usecases/removeTaskUseCase.js';
import { UpdateTaskUseCase } from '../usecases/updateTaskUseCase.js';

// Create repository instance
const taskRepository = new TaskRepositoryImpl();

// Create and export use cases
export const addTaskUseCase = new AddTaskUseCase(taskRepository);
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
export const getTaskUseCase = new GetTaskUseCase(taskRepository);
export const removeTaskUseCase = new RemoveTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

// Export repository for direct access if needed
export { taskRepository };