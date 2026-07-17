import { InMemoryTaskRepository } from '../data/repositories/InMemoryTaskRepository.js';
import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository.js';
import { FirebaseTaskRepository } from '../data/repositories/FirebaseTaskRepository.js';
import { FirebaseAuthRepository } from '../data/repositories/FirebaseAuthRepository.js';

import { AddTaskUseCase } from '../domain/usecases/addTaskUseCase.js';
import { GetAllTasksUseCase } from '../domain/usecases/getAllTasksUseCase.js';
import { GetTaskUseCase } from '../domain/usecases/getTaskUseCase.js';
import { RemoveTaskUseCase } from '../domain/usecases/removeTaskUseCase.js';
import { UpdateTaskUseCase } from '../domain/usecases/updateTaskUseCase.js';
import { ToggleTaskCompletionUseCase } from '../domain/usecases/toggleTaskCompletionUseCase.js';
import { LoginUseCase } from '../domain/usecases/loginUseCase.js';
import { RegisterUseCase } from '../domain/usecases/registerUseCase.js';
import { LogoutUseCase } from '../domain/usecases/logoutUseCase.js';

const REPOSITORY_KIND = process.env.REACT_APP_TASK_REPOSITORY || 'firebase';

function createTaskRepository(kind) {
  switch (kind) {
    case 'memory':
      return new InMemoryTaskRepository();
    case 'localStorage':
      return new LocalStorageTaskRepository();
    case 'firebase':
    default:
      return new FirebaseTaskRepository();
  }
}

const taskRepository = createTaskRepository(REPOSITORY_KIND);

export const addTaskUseCase = new AddTaskUseCase(taskRepository);
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
export const getTaskUseCase = new GetTaskUseCase(taskRepository);
export const removeTaskUseCase = new RemoveTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const toggleTaskCompletionUseCase = new ToggleTaskCompletionUseCase(taskRepository);

// --- Auth -------------------------------------------------------------
// Same pattern: IAuthRepository is the contract, FirebaseAuthRepository
// is the implementation, use cases depend only on the interface.
const authRepository = new FirebaseAuthRepository();

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);

export { taskRepository, authRepository };
