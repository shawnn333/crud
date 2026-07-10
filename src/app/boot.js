import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository.js';
import { AddTaskUseCase } from '../domain/usecases/addTaskUseCase.js';
import { GetAllTasksUseCase } from '../domain/usecases/getAllTasksUseCase.js';
import { GetTaskUseCase } from '../domain/usecases/getTaskUseCase.js';
import { RemoveTaskUseCase } from '../domain/usecases/removeTaskUseCase.js';
import { UpdateTaskUseCase } from '../domain/usecases/updateTaskUseCase.js';

const taskRepository = new LocalStorageTaskRepository();

export const addTaskUseCase = new AddTaskUseCase(taskRepository);
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
export const getTaskUseCase = new GetTaskUseCase(taskRepository);
export const removeTaskUseCase = new RemoveTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

export { taskRepository };
